from fastapi import HTTPException, status, UploadFile
import fitz  # PyMuPDF
import docx
import io
from datetime import datetime, timedelta

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

def get_date_ranges(time_range: str):
    """
    Calculates the start and end dates for the current and previous periods
    based on a given time range.
    """
    today = datetime.now()

    if time_range == "week":
        start_of_period = today - timedelta(days=today.weekday())
        end_of_period = start_of_period + timedelta(days=6)
        start_of_previous_period = start_of_period - timedelta(weeks=1)
        end_of_previous_period = end_of_period - timedelta(weeks=1)
    elif time_range == "month":
        start_of_period = today.replace(day=1)
        next_month = start_of_period.replace(day=28) + timedelta(days=4)
        end_of_period = next_month - timedelta(days=next_month.day)
        
        end_of_previous_month = start_of_period - timedelta(days=1)
        start_of_previous_period = end_of_previous_month.replace(day=1)
        end_of_previous_period = end_of_previous_month
    elif time_range == "quarter":
        current_quarter = (today.month - 1) // 3 + 1
        start_of_quarter_month = 3 * current_quarter - 2
        start_of_period = today.replace(month=start_of_quarter_month, day=1)
        
        end_of_quarter_month = start_of_quarter_month + 2
        end_of_period_month_start = today.replace(month=end_of_quarter_month, day=28) + timedelta(days=4)
        end_of_period = end_of_period_month_start - timedelta(days=end_of_period_month_start.day)

        end_of_previous_quarter = start_of_period - timedelta(days=1)
        previous_quarter_month_num = (end_of_previous_quarter.month - 1) // 3 + 1
        start_of_previous_quarter_month = 3 * previous_quarter_month_num - 2
        start_of_previous_period = end_of_previous_quarter.replace(month=start_of_previous_quarter_month, day=1)
        end_of_previous_period = end_of_previous_quarter
    elif time_range == "year":
        start_of_period = today.replace(month=1, day=1)
        end_of_period = today.replace(month=12, day=31)
        start_of_previous_period = start_of_period.replace(year=today.year - 1)
        end_of_previous_period = end_of_period.replace(year=today.year - 1)
    else:
        raise HTTPException(status_code=400, detail="Invalid time range specified. Use 'week', 'month', 'quarter', or 'year'.")

    return start_of_period, end_of_period, start_of_previous_period, end_of_previous_period
