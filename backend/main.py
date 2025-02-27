from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import base64
import google.generativeai as genai
import requests
import logging
from fastapi.responses import HTMLResponse
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

app = FastAPI()

# --- Configure Logging ---
logging.basicConfig(level=logging.INFO)

# --- Configuration ---
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyA-tAJWZDUcDpMEo8IfT3wEI9D39KMKVV8")
DEEPGRAM_API_KEY = os.environ.get("DEEPGRAM_API_KEY", "a65103cb8d6ac60157ec483b0b439d91d040e426")

CONVERSATION_HISTORY = {}  # In-memory storage (replace with a database!)
DEFAULT_PROMPT = """You are an AI self-introduction rephraser and enhancer. Your task is to take my self-introduction speech, refine it, and make it more impactful, engaging, and professional while maintaining my original intent. Ensure it sounds confident, polished, and compelling. Additionally, at the end of your response, provide constructive feedback on any mistakes I made, areas for improvement, and suggestions on what I could add to make it stronger."""
try:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')  # Or 'gemini-pro' if not using audio
except Exception as e:
    logging.error(f"Error initializing Gemini API: {e}")
    raise

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Models ---
class DebateTurnResponse(BaseModel):
    ai_response_text: str
    ai_response_audio_base64: str
    conversation_id: str

class AudioUploadForm(BaseModel):
    audio_data: str
    conversation_id: str

# --- Utility Functions ---
def load_conversation_history(conversation_id: str) -> list:
    return CONVERSATION_HISTORY.get(conversation_id, [])

def save_conversation_history(conversation_id: str, user_audio_base64: str, ai_response_text: str) -> None:
    if conversation_id not in CONVERSATION_HISTORY:
        CONVERSATION_HISTORY[conversation_id] = []
    CONVERSATION_HISTORY[conversation_id].append({
        "user_audio": user_audio_base64,
        "ai_response": ai_response_text,
    })

def generate_gemini_response(audio_base64: str, conversation_history: list) -> str:
    history_summary = "\n".join([f"AI: {turn['ai_response']}" for turn in conversation_history])
    prompt = DEFAULT_PROMPT + "\n" + history_summary + "\nNow, respond to the following audio clip:"

    try:
        contents = [
            prompt,
            {
                "mime_type": "audio/webm",  # Correct MIME type for WebM
                "data": base64.b64decode(audio_base64)
            }
        ]
        response = model.generate_content(contents=contents)

        if response.prompt_feedback and response.prompt_feedback.block_reason:
            raise HTTPException(status_code=400,
                                detail=f"Gemini API blocked the request: {response.prompt_feedback.block_reason}")

        return response.text
    except Exception as e:
        logging.error(f"Error generating Gemini response: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating response from Gemini API: {str(e)}")

# Deepgram Text-to-Speech function (using requests)
def text_to_speech(text: str) -> str:
    try:
        voice_model = "aura-asteria-en"
        # Truncate text to 1990 characters to be safe.
        truncated_text = text[:1990]  # Leave some buffer
        url = f"https://api.deepgram.com/v1/speak?model={voice_model}"
        headers = {
            "Authorization": f"Token {DEEPGRAM_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "text": truncated_text
        }
        response = requests.post(url, headers=headers, json=payload, timeout=10)  # Added timeout

        if response.status_code == 200:
            audio_bytes = response.content
            audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")
            return audio_base64
        else:
            logging.error(f"Deepgram API Error: {response.status_code} - {response.text}")
            raise HTTPException(status_code=response.status_code,
                                detail=f"Deepgram API Error: {response.status_code} - {response.text}")

    except Exception as e:
        logging.error(f"Error during Text-to-Speech conversion with Deepgram: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error during Text-to-Speech conversion with Deepgram: {str(e)}")

# --- API Endpoints ---
@app.post("/debate-turn/", response_model=DebateTurnResponse)
async def debate_turn(form_data: AudioUploadForm):
    try:
        conversation_id = form_data.conversation_id
        audio_base64 = form_data.audio_data

        conversation_history = load_conversation_history(conversation_id)
        ai_response_text = generate_gemini_response(audio_base64, conversation_history)
        ai_response_audio_base64 = text_to_speech(ai_response_text)

        save_conversation_history(conversation_id, audio_base64, ai_response_text)

        return DebateTurnResponse(
            ai_response_text=ai_response_text,
            ai_response_audio_base64=ai_response_audio_base64,
            conversation_id=conversation_id
        )
    except Exception as e:
        logging.error(f"Error processing /debate-turn/: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

@app.get("/conversation_history/{conversation_id}")
async def get_conversation_history(conversation_id: str):
    history = load_conversation_history(conversation_id)
    if not history:  # Correctly checks for empty list or None
        raise HTTPException(status_code=404, detail="Conversation not found")
    return history