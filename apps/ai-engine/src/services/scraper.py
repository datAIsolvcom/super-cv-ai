import httpx
from fastapi import HTTPException

async def scrape_job_with_jina(url: str) -> str:
    """
    Mengambil konten website menggunakan Jina AI Reader API.
    Outputnya adalah teks format Markdown yang bersih.
    """
    jina_url = f"https://r.jina.ai/{url}"
    
    # Header opsional: Jika punya API Key Jina, tambahkan di sini
    # headers = {"Authorization": "Bearer YOUR_JINA_API_KEY"} 
    # headers = {} # Kosongkan jika pakai free tier (tanpa key)

    async with httpx.AsyncClient() as client:
        try:
            # Timeout 30 detik agar tidak hanging jika website target lambat
            response = await client.get(jina_url, timeout=60.0)
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Jina AI gagal mengambil URL. Status: {response.status_code}"
                )
            
            # Jina mengembalikan teks markdown
            return response.text

        except httpx.RequestError as e:
            raise HTTPException(status_code=400, detail=f"Gagal koneksi ke URL: {str(e)}")