from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

# Import modul
from app.schemas import AnalysisResult, ImprovedCVResult
from app.services.extractor import extract_text_from_file
from app.services.ai_engine import analyze_cv, improve_cv
from app.services.scraper import scrape_job_with_jina 

app = FastAPI(title="CV Analyzer API", version="1.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/analyze", response_model=AnalysisResult)
async def analyze_endpoint(
    file: UploadFile = File(...),
    job_description: Optional[str] = Form(None),
    job_url: Optional[str] = Form(None)
):
    # --- STEP 1: Tentukan Sumber Job Description ---
    final_job_context = ""

    # Prioritas 1: User copy-paste teks langsung (lebih akurat & cepat)
    if job_description and job_description.strip():
        final_job_context = job_description
    
    # Prioritas 2: User kasih Link, kita fetch pakai Jina AI
    elif job_url and job_url.strip():
        print(f"Fetching job info from: {job_url} using Jina AI...") # Logging sederhana
        final_job_context = await scrape_job_with_jina(job_url)
    
    # Jika keduanya kosong
    else:
        raise HTTPException(
            status_code=400, 
            detail="Mohon sertakan Job Description (teks) atau Job URL."
        )

    # --- STEP 2: Ekstraksi CV ---
    cv_text = await extract_text_from_file(file)
    if len(cv_text) < 50:
        raise HTTPException(status_code=400, detail="File CV terbaca kosong atau terlalu pendek.")

    # --- STEP 3: Proses AI ---
    # Kita kirim hasil scrape Jina (markdown) langsung ke Gemini.
    # Gemini sangat pandai membaca markdown.
    result = await analyze_cv(cv_text, final_job_context)
    
    return result

@app.post("/api/improve", response_model=ImprovedCVResult)
async def improve_endpoint(
    file: UploadFile = File(...),
    job_description: Optional[str] = Form(None),
    job_url: Optional[str] = Form(None)
):
    """
    Endpoint untuk menulis ulang CV berdasarkan Job Description.
    Mengembalikan JSON terstruktur yang siap dirender menjadi PDF baru.
    """
    # --- STEP 1: Tentukan Sumber Job Description (Sama seperti analyze) ---
    final_job_context = ""

    if job_description and job_description.strip():
        final_job_context = job_description
    elif job_url and job_url.strip():
        print(f"Fetching job info from: {job_url} using Jina AI...")
        final_job_context = await scrape_job_with_jina(job_url)
    else:
        raise HTTPException(
            status_code=400, 
            detail="Mohon sertakan Job Description (teks) atau Job URL."
        )

    # --- STEP 2: Ekstraksi CV ---
    cv_text = await extract_text_from_file(file)
    if len(cv_text) < 50:
        raise HTTPException(status_code=400, detail="File CV terbaca kosong atau terlalu pendek.")

    # --- STEP 3: Proses AI (Improve CV) ---
    try:
        result = await improve_cv(cv_text, final_job_context)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal memproses perbaikan CV: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)