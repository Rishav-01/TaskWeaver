from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from llm import call_chain
from models.Meeting import Meeting
from models.User import User
from schemas.index import Token, UserLoginModel
from services.index import create_meeting, get_meetings_by_user, get_meeting_by_id
from datetime import datetime, timedelta
from auth import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    create_access_token,
    get_current_user,
    get_user_by_email,
    verify_password, create_user
)

router = APIRouter()

@router.get('/')
async def root():
    return {"message": "Hello World"}

@router.post("/register", response_model=Token)
async def register_user(user: User):
    """Registers a new user."""
    # Call the service to create the user
    created_user_response = create_user(user)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": created_user_response["email"]}, expires_delta=access_token_expires
    )
    return {"token": access_token, "token_type": "bearer"}

# Token endpoint for OAuth2PasswordBearer swagger purpose
@router.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """Logs in a user and returns an access token."""
    user = get_user_by_email(form_data.username)
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login", response_model=Token)
async def login_user(user: UserLoginModel):
    """Logs in a user and returns an access token."""
    db_user = get_user_by_email(user.email)
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user["email"]}, expires_delta=access_token_expires
    )
    return {"token": access_token, "token_type": "bearer"}

@router.post('/upload-meeting')
async def upload_meeting(transcript_content: str, current_user: User = Depends(get_current_user)):
    """Accepts a meeting transcript and returns a structured summary."""
    summary_dict = call_chain(transcript_content) # Pass the plain string directly to call_chain

    try:
        # Create a Meeting model instance
        meeting_data = Meeting(
            summary=summary_dict.summary,
            action_items=summary_dict.action_items,
            key_points=summary_dict.key_points,
            participants=summary_dict.participants,
            date=datetime.now(),
            duration=summary_dict.duration,
            title=summary_dict.title,
            user_id=current_user.email, # Use authenticated user's email
            status='completed',
            start_time=summary_dict.start_time,
            end_time=summary_dict.end_time
        )

        # Save the meeting to the database
        created_meeting = create_meeting(meeting_data)

        if created_meeting:
            # Return the created meeting with a success message
            return {"message": "Meeting saved successfully", "success": True, "data": created_meeting}
        else:
            return {"error": "Failed to create and retrieve meeting", "success": False}
    except Exception as e:
        return {"error": str(e)}

@router.get('/users/me', response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """Retrieves the current authenticated user's information."""
    return current_user

@router.get('/meetings')
async def get_meetings(current_user: User = Depends(get_current_user)):
    """Retrieves all meetings for the authenticated user."""
    user_meetings = get_meetings_by_user(current_user.email)
    return {"message": "Meetings retrieved successfully", "success": True, "data": user_meetings}

@router.get('/meetings/{meeting_id}')
async def get_meeting(meeting_id: str, current_user: User = Depends(get_current_user)):
    """Retrieves a specific meeting by its ID."""
    meeting = get_meeting_by_id(meeting_id)
    if meeting:
        return {"message": "Meeting retrieved successfully", "success": True, "data": meeting}
    else:
        return {"error": "Meeting not found", "success": False, "data": None}