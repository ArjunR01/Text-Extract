from fastapi import FastAPI, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil,os
import fitz

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "FastAPI backend is up and running!"}


app.add_middleware(
  CORSMiddleware,
  allow_origins = ['*'],
  allow_credentials = True,
  allow_methods = ['*'],
  allow_headers = ['*'],
)

UPLOAD_DIR = "uploaded_files"

os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
  if not file.filename.endswith(".pdf"):
    return {"error" : "Only PDF files are allowed."}
  
  file_location = f"{UPLOAD_DIR}/{file.filename}"

  with open(file_location, "wb") as buffer:
    shutil.copyfileobj(file.file, buffer)

  return {"message": "PDF uploaded successfully", "filename":file.filename}


class ReadRequest(BaseModel):
  filename: str
  start_page: int
  end_page: int


@app.post("/read")
async def read_pdf(data: ReadRequest):
  file_path = os.path.join(UPLOAD_DIR, data.filename)

  if not os.path.exists(file_path):
    return {"error": "File not found"}
  
  try:
    doc = fitz.open(file_path)
    text = ""

    for i in range(data.start_page-1, data.end_page):
      if i<0 or i>=len(doc):
        continue
      page = doc.load_page(i)
      text += page.get_text()
    
    return {"text":text.strip()}
  
  except Exception as e:
    return {"error": str(e)}