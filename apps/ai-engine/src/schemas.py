from pydantic import BaseModel, Field
from typing import List, Optional

class CriticalGap(BaseModel):
    gap: str = Field(..., description="The specific missing skill or weakness (e.g., 'Docker', 'Leadership')")
    action: str = Field(..., description="A concrete, actionable recommendation on what the candidate should do (e.g., 'Build a containerized app', 'Lead a small team project')")

class AnalysisResponse(BaseModel):
    candidate_name: str = Field(..., description="Full name of the candidate")
    overall_score: int = Field(..., description="Overall score 1-100")
    overall_summary: str = Field(..., description="Detailed feedback summary")
    ats_score: int = Field(..., description="ATS compatibility score 0-100")
    ats_detail: str = Field(..., description="Feedback on formatting and structure")
    writing_score: int = Field(..., description="Writing style score 0-100")
    writing_detail: str = Field(..., description="Feedback on grammar and voice")
    skill_score: int = Field(..., description="Skill match score 0-100")
    skill_detail: str = Field(..., description="Feedback on hard/soft skills")
    experience_score: int = Field(..., description="Experience relevance score 0-100")
    experience_detail: str = Field(..., description="Feedback on seniority and projects")
    keyword_score: int = Field(..., description="Keyword relevance score 0-100")
    key_strengths: List[str] = Field(..., description="List of primary selling points")
    critical_gaps: List[CriticalGap] = Field(..., description="List of critical gaps with specific actionable advice")


class CVContactInfo(BaseModel):
    email: str
    phone: str
    location: str
    linkedin: Optional[str] = None
    portfolio: Optional[str] = None

class CVExperience(BaseModel):
    title: str
    company: str
    dates: str
    achievements: List[str]
    location: Optional[str] = None

class CVEducation(BaseModel):
    institution: str
    degree: str
    year: str
    location: Optional[str] = None

class CVProject(BaseModel):
    name: str
    description: str
    highlights: List[str]

class ImprovedCVResult(BaseModel):
    full_name: str
    professional_summary: str
    contact_info: CVContactInfo
    hard_skills: List[str]
    soft_skills: List[str]
    work_experience: List[CVExperience]
    education: List[CVEducation]
    projects: List[CVProject]
    certifications: Optional[List[str]] = None