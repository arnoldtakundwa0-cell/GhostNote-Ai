from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="GHOSTNOTE AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "GHOSTNOTE AI Backend is running 👻"}

@app.post("/generate")
async def generate_cover(beat: UploadFile = File(...), vocals: UploadFile = File(...)):
    return {"status": "Files received", "message": "AI generation coming soon"}
