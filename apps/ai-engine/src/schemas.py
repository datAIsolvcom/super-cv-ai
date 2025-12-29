from pydantic import BaseModel, Field
from typing import List, Optional

class AnalysisResult(BaseModel):
    candidate_name: str = Field(..., description="Name of the candidate extracted from the CV"
    )
    overall_score: int = Field(..., description="Overall CV score (0-100) averaged from the 5 criteria")
    overall_detail: str = Field(..., description="Summary of overall CV strengths and weaknesses based on the job description for candidate improvement")
    
    # --- 1. Writing Style ---
    writing_score: int = Field(..., description="Score (0-100) for clarity, grammar, typos, and use of active voice"
    )
    writing_detail: str = Field(..., description="Feedback on grammar, typos, phrasing (passive vs active), and overall readability"
    )

    # --- 2. Format & ATS ---
    format_score: int = Field(..., description="Score (0-100) for ATS-friendliness and layout structure"
    )
    format_detail: str = Field(..., description="Feedback on file structure, parsing capability, and advice if the CV is too 'creative' for ATS"
    )

    # --- 3. Skill Match ---
    skill_score: int = Field(..., description="Score (0-100) indicating how well hard/soft skills match the job description"
    )
    skill_detail: str = Field(..., description="Details on matched skills and critical missing keywords"
    )

    # --- 4. Experience Relevance ---
    experience_score: int = Field(
        ..., 
        description="Score (0-100) for relevance of work history, projects, and portfolio"
    )
    experience_detail: str = Field(..., description="Analysis of whether the candidate's past experience aligns with the job requirements"
    )

    # --- 5. Key Strengths & Qualitative ---
    keyword_relevance_score: int = Field(..., description="Score (0-100) for relevance of the candidate's key strengths to the job")
    keyword_relevance: List[str] = Field(..., description="List of the candidate's primary strengths relevant to the role"
    )

class CVContactInfo(BaseModel):
    email: str = Field(..., description="Professional email address")
    phone: str = Field(..., description="Phone number")
    linkedin: Optional[str] = Field(None, description="LinkedIn URL")
    portfolio: Optional[str] = Field(None, description="Portfolio or Website URL")
    location: str = Field(..., description="City, Country")

class CVExperience(BaseModel):
    title: str = Field(..., description="Job Title")
    company: str = Field(..., description="Company Name")
    location: Optional[str] = Field(None, description="Company Location")
    dates: str = Field(..., description="Employment dates (e.g., Jan 2020 - Present)")
    achievements: List[str] = Field(..., description="List of bullet points using action verbs and metrics, optimized for the job description")

class CVEducation(BaseModel):
    degree: str = Field(..., description="Degree obtained")
    institution: str = Field(..., description="University or Institution name")
    location: str = Field(..., description="Location")
    year: str = Field(..., description="Graduation year or duration")

class CVProject(BaseModel):
    name: str = Field(..., description="Project Name")
    description: str = Field(..., description="Brief description of the project")
    technologies: List[str] = Field(..., description="List of technologies/tools used")
    achievements_project: List[str] = Field(..., description="List of bullet points using action verbs and metrics, optimized for the job description")


class ImprovedCVResult(BaseModel):
    full_name: str = Field(..., description="Candidate's full name")
    contact_info: CVContactInfo
    professional_summary: str = Field(..., description="A strong, keyword-rich professional summary tailored to the job")
    hard_skills: List[str] = Field(..., description="List of technical/hard skills matching the job requirements")
    soft_skills: List[str] = Field(..., description="List of soft skills relevant to the role")
    work_experience: List[CVExperience] = Field(..., description="Work history rewritten to highlight relevance to the new job")
    education: List[CVEducation]
    projects: Optional[List[CVProject]] = Field(default=[], description="Relevant projects")
    certifications: Optional[List[str]] = Field(default=[], description="Relevant certifications")
    