from fastapi import HTTPException, status, UploadFile
import fitz  # PyMuPDF
import docx
import io

async def extract_text_from_file(file: UploadFile) -> str:
    """
    Extracts text content from an uploaded file (TXT, PDF, DOCX).
    """
    transcript_content = await file.read()
    transcript_str = ""

    # Determine file type and process accordingly
    if file.content_type == "text/plain":
        try:
            # Attempt to decode as UTF-8, replace problematic characters
            transcript_str = transcript_content.decode(encoding='utf-8', errors='replace')
        except UnicodeDecodeError:
            # Fallback to latin-1 if UTF-8 completely fails
            transcript_str = transcript_content.decode(encoding='latin-1', errors='replace')
            print(f"Warning: Text file {file.filename} could not be fully decoded as UTF-8, used latin-1 fallback.")
    elif file.content_type == "application/pdf":
        try:
            pdf_document = fitz.open(stream=transcript_content, filetype="pdf")
            transcript_str = "".join(page.get_text() for page in pdf_document)
            pdf_document.close()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error processing PDF file: {e}")
    elif file.content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        try:
            doc = docx.Document(io.BytesIO(transcript_content))
            transcript_str = "\n".join([para.text for para in doc.paragraphs])
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error processing DOCX file: {e}")
    else:
        # Handles .doc and any other unsupported types
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported file type: {file.content_type}. Please upload a plain text, PDF, or DOCX file."
        )
    
    return transcript_str
