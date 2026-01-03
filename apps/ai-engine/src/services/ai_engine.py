import os
import json
from datetime import datetime # [UPDATE] Tambah import ini
from dotenv import load_dotenv
from google import genai
from google.genai import types
from src.schemas import AnalysisResponse, ImprovedCVResult, CVContactInfo

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL_NAME = "gemini-3-flash-preview" 
def clean_json_text(text: str) -> str:
    try:
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0]
        elif "```" in text:
            text = text.split("```")[1].split("```")[0]
        return text.strip()
    except Exception:
        return text

async def extract_data_only(cv_text: str) -> ImprovedCVResult:
    
    prompt_text = f"""
    You are a strict data parser. 
    Extract the following CV text into a structured JSON format matching this schema.
    
    RULES:
    1. DO NOT rewrite, improve, or change the content. Extract it exactly as is.
    2. If a field is missing, use an empty string "" or empty list [].
    
    CV TEXT:
    {cv_text[:4000]}

    OUTPUT SCHEMA: ImprovedCVResult (JSON)
    """
    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=[types.Content(role="user", parts=[types.Part.from_text(text=prompt_text)])],
            config=types.GenerateContentConfig(response_mime_type="application/json", response_schema=ImprovedCVResult)
        )
        if response.parsed: return response.parsed
        return ImprovedCVResult(**json.loads(clean_json_text(response.text)))
    except Exception as e:
        print(f"Extract Error: {e}")
        return ImprovedCVResult(
            full_name="Candidate", professional_summary="", 
            contact_info=CVContactInfo(email="", phone="", location=""), 
            hard_skills=[], soft_skills=[], work_experience=[], education=[], projects=[]
        )


async def analyze_cv(cv_text: str, job_desc: str, current_date: str = None):
    
  
    if not current_date:
        current_date = datetime.now().strftime("%Y-%m-%d")

    final_job_desc = job_desc
    if not job_desc or job_desc.strip() == "" or job_desc.lower() == "undefined":
        final_job_desc = "General Professional Standards for the candidate's role. Focus on impact, clarity, ATS best practices, and seniority level."

   
    prompt_text = f"""
    You are a Senior Technical Recruiter and CV Expert. 
    Analyze the following Candidate CV against the provided Job Description. Use "You" to address the candidate directly.

    *** TIME CONTEXT (CRITICAL) ***:
    - Today's Date is: **{current_date}**.
    - Any experience listed with a year equal to or before the current year ({current_date.split('-')[0]}) is VALID.
    - DO NOT flag "{current_date.split('-')[0]}" (Current Year) as a "future date error".
    - "Present" or "Current" means valid up to today.

    JOB DESCRIPTION:
    {final_job_desc}

    CANDIDATE CV CONTENT:
    {cv_text}

    Please perform a deep analysis based on these 6 specific criteria:

    1. **Candidate Overview**:
       - Extract the candidate's full name.
       - Give an overall score (1-100).
       - Provide detailed feedback summarizing strengths and weaknesses.
    
    2. **Writing Style (Score 0-100)**: 
       - Check for clarity, grammar, and typos.
    
    3. **CV Format & ATS (Score 0-100)**: 
       - Is the format ATS-friendly?
    
    4. **Skill Match (Score 0-100)**: 
       - How well do the hard skills and soft skills match the Job Description?
    
    5. **Experience & Projects (Score 0-100)**: 
       - Evaluate if work history/projects are relevant.
       - CHECK DATES CAREFULLY: Do not incorrectly mark valid recent dates as future errors based on the 'Today's Date' provided above.

    6. **Keyword Relevance & Critical Gaps (Score 0-100)**:
       - List primary selling points (key_strengths).
       - Identify critical gaps.
       - **CRITICAL INSTRUCTION**: For EACH gap identified, provide a specific "action". 
         Example: Gap="Docker", Action="Build a simple microservice using Docker."

    *** REQUIRED JSON OUTPUT FORMAT ***
    You MUST output strictly JSON matching the AnalysisResponse schema.
    """
    
    analysis_res = None
    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=[types.Content(role="user", parts=[types.Part.from_text(text=prompt_text)])],
            config=types.GenerateContentConfig(
                response_mime_type="application/json", 
                response_schema=AnalysisResponse,
                temperature=0.2 
            )
        )
        if response.parsed: 
            analysis_res = response.parsed
        else:
            analysis_res = AnalysisResponse(**json.loads(clean_json_text(response.text)))
            
    except Exception as e:
        print(f"Analyze Error: {e}")
        analysis_res = AnalysisResponse(
            candidate_name="Unknown", overall_score=0, overall_summary=f"Error: {str(e)}",
            writing_score=0, writing_detail="", ats_score=0, ats_detail="",
            skill_score=0, skill_detail="", experience_score=0, experience_detail="",
            keyword_score=0, key_strengths=[], critical_gaps=[]
        )

    original_data = await extract_data_only(cv_text)

    return {
        "analysis": analysis_res.model_dump(),
        "cv_data": original_data.model_dump()
    }

async def customize_cv(cv_text: str, mode: str, context_data: str, current_date: str = None):
    
    if not current_date:
        current_date = datetime.now().strftime("%Y-%m-%d")

    if mode == 'job_desc':
        mode_context = f"TARGET JOB DESCRIPTION: {context_data}"
        goal = "Tailor the CV keywords to match the Target Job, but PRESERVE the candidate's history."
    else: 
        mode_context = f"ANALYSIS FEEDBACK: {context_data}"
        goal = "Improve the CV based on the weakness analysis provided."

    prompt_text = f"""
    You are an Expert Resume Writer. Your task is to REWRITE the candidate's CV to be world-class, ATS-friendly, and high-impact.
    
    CONTEXT:
    - Today's Date: {current_date}
    - {mode_context}
    
    GOAL: {goal}

    ORIGINAL CV CONTENT:
    {cv_text}
    
    *** CRITICAL RULES ***:
    1. **NO DELETION**: Preserve all work history.
    2. **NO HALLUCINATIONS**: Do not invent skills.
    3. **DATE ACCURACY**: Ensure dates are formatted correctly relative to today ({current_date}). 
       If a job is current, ensure it is clear (e.g., "Jan 2024 - Present").
    
    *** WRITING INSTRUCTIONS ***:
    1. Summary: Metric-driven.
    2. Experience: Google XYZ formula.
    3. Skills: Re-organize based on priority.

    OUTPUT: Strictly JSON matching the ImprovedCVResult schema.
    """

    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=[types.Content(role="user", parts=[types.Part.from_text(text=prompt_text)])],
            config=types.GenerateContentConfig(response_mime_type="application/json", response_schema=ImprovedCVResult)
        )
        if response.parsed: return response.parsed
        return ImprovedCVResult(**json.loads(clean_json_text(response.text)))
    except Exception as e:
        print(f"Customize Error: {e}")
        return ImprovedCVResult(
            full_name="Error Generating CV", professional_summary=f"AI Error: {str(e)}",
            contact_info=CVContactInfo(email="", phone="", location=""),
            hard_skills=[], soft_skills=[], work_experience=[], education=[], projects=[]
        )