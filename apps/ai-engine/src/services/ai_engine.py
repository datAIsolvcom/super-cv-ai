import os
from dotenv import load_dotenv
from google import genai
from google.genai import types
from pydantic import ValidationError

# Import schema
from src.schemas import AnalysisResult, ImprovedCVResult

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

MODEL_NAME = "gemini-3-flash-preview" 

async def analyze_cv(cv_text: str, job_desc: str) -> AnalysisResult:
    # --- PROMPT DIPERBARUI ---
    prompt_text = f"""
    You are a Senior Technical Recruiter and CV Expert. 
    Analyze the following Candidate CV against the provided Job Description and make the words You for the candidate, not He/She.

    JOB DESCRIPTION:
    {job_desc}

    CANDIDATE CV CONTENT:
    {cv_text}

    Please perform a deep analysis based on these 5 specific criteria:

    1. **Candidate Overview**:
         - Extract the candidate's full name from the CV.
         - Make overall score (1-100) for each of the 5 keypoint(Writing style, CV Format & ATS, Skill Match, Experience & Projects, Key Strength).
         - Provide detailed feedback for overall score including strengths and weaknesses for candidate to improve.
    
    2. **Writing Style (Score 0-100)**: 
       - Check for clarity, grammar, and typos.
       - Identify weak phrasing (excessive passive voice) vs action-oriented language.
    
    3. **CV Format & ATS (Score 0-100)**: 
       - Is the format ATS-friendly? (Clean structure, standard fonts, no complex graphics blocking text).
       - If it's a "Creative CV", evaluate if it's readable by machines.
    
    4. **Skill Match (Score 0-100)**: 
       - How well do the hard skills and soft skills match the Job Description?
       - Are keywords present?
    
    5. **Experience & Projects (Score 0-100)**: 
       - Evaluate if the work history, projects, or portfolio are relevant to the role.
       - Does the experience level (Seniority) match the requirement?

    6. **Keyword Relevance (Score 0-100)**:
       - List the candidate's primary selling points found in the CV that match the job description.
       - List any critical gaps or missing elements that could be improved.

    Finally, strictly organize the output into JSON matching the schema.
    """
    generate_config = types.GenerateContentConfig(
        response_mime_type="application/json",
        response_schema=AnalysisResult, # Menggunakan schema baru
        temperature=0.1, 
    )

    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=[
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_text(text=prompt_text)
                    ]
                )
            ],
            config=generate_config
        )

        if response.parsed:
            return response.parsed
        else:
            # Fallback parsing manual (jarang terjadi di SDK baru)
            import json
            json_data = json.loads(response.text)
            return AnalysisResult(**json_data)

    except ValidationError as ve:
        print(f"Validation Error: {ve}")
        # Return error object yang sesuai struktur baru
        return AnalysisResult(
            candidate_name="Unknown",
            skill_score=0,
            skill_detail="Error validation",
            style_score=0,
            style_detail="Error validation",
            completeness_score=0,
            completeness_detail="Error validation",
            key_strengths=[],
            gaps=[],
            recommendations=["System Validation Error"]
        )
    except Exception as e:
        print(f"AI Engine Error: {e}")
        return AnalysisResult(
            candidate_name="Unknown",
            skill_score=0,
            skill_detail="System Error",
            style_score=0,
            style_detail="System Error",
            completeness_score=0,
            completeness_detail="System Error",
            key_strengths=[],
            gaps=[],
            recommendations=["System Internal Error"]
        )

async def improve_cv(cv_text: str, job_desc: str) -> ImprovedCVResult:
    """
    Menulis ulang CV agar sesuai dengan Job Description.
    Output: JSON terstruktur (ImprovedCVResult).
    """
    
    # Prompt sesuai permintaan Anda
    prompt_text = f"""
    You are a professional CV writer specializing in creating ATS-optimized, PDF-ready resumes. Your task is to completely rewrite this CV to perfectly match the job requirements while maintaining professional formatting suitable for PDF rendering.

    **STRICT PROHIBITIONS (DO NOT IGNORE):**
    1. **NO FABRICATION:** You are STRICTLY FORBIDDEN from inventing work experiences, skills, education, or certifications not present in the original CV.
    2. **IDENTITY PRESERVATION:** Do NOT change the candidate's Name, Phone, Email, or LinkedIn URL. Use the exact contact details provided in the input CV.
    3. **FACTUAL INTEGRITY:** Do NOT change the Degree type (e.g., do not change a Bachelor's to a PhD), University Name, or Company Names to match the job description.
    4. **HONEST OPTIMIZATION:** If the user lacks a specific requirement (e.g., "PhD"), do NOT add it. Instead, highlight their strongest existing relevant experience that compensates for it.
    
    **QUALITY ASSURANCE:**
    - CV must demonstrate clear career progression
    - Content must be achievement-oriented, not task-oriented
    - Ensure perfect grammar and professional language

    **JOB POSTING CONTENT:**
    {job_desc}

    **ORIGINAL CV CONTENT:**
    {cv_text}

    **CRITICAL REQUIREMENTS:**

    1. **Analyze Requirements:** Extract ALL skills, qualifications, keywords, and requirements from the job posting
    2. **Perfect Match:** Ensure the CV demonstrates 100% compatibility with job requirements
    3. **Keyword Optimization:** Naturally incorporate ALL relevant terms from the job posting
    4. **Professional Structure:** Use the exact CV structure and formatting specified in the JSON schema.
    5. **Action Oriented:** Rewrite bullet points in work experience to be result-oriented (STAR method) using strong action verbs.
    
    Finally, strictly organize the output into JSON matching the provided schema.
    """

    generate_config = types.GenerateContentConfig(
        response_mime_type="application/json",
        response_schema=ImprovedCVResult, # Menggunakan schema ImprovedCVResult
        temperature=0.2, # Sedikit lebih kreatif daripada analyze tapi tetap terkontrol
    )

    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=[
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_text(text=prompt_text)
                    ]
                )
            ],
            config=generate_config
        )

        if response.parsed:
            return response.parsed
        else:
            import json
            json_data = json.loads(response.text)
            return ImprovedCVResult(**json_data)

    except Exception as e:
        print(f"AI Improve CV Error: {e}")
        # Return object kosong/default jika error, agar API tidak crash 500
        # Idealnya handle error lebih baik di production
        raise e