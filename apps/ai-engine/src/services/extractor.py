import io
from fastapi import UploadFile, HTTPException
import pypdf
import docx

async def extract_text_from_file(file: UploadFile) -> str:
    content = await file.read()
    file_stream = io.BytesIO(content)
    text = ""

    try:
        if file.content_type == "application/pdf":
            reader = pypdf.PdfReader(file_stream)
            for page in reader.pages:
                text += page.extract_text() + "\n"
        
        elif file.content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            doc = docx.Document(file_stream)
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
        
        else:
            raise HTTPException(status_code=400, detail="Format file tidak didukung. Gunakan PDF atau DOCX.")

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Gagal mengekstrak teks: {str(e)}")

    # Bersihkan teks sedikit agar hemat token
    return text.strip()