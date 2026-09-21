from typing import Optional, Literal
from datetime import date

from pydantic import BaseModel, ConfigDict, Field


# =========================================================
# AUTH SCHEMAS
# =========================================================

class RegisterRequest(BaseModel):
    name: str = Field(
        ...,
        min_length=1,
        max_length=100
    )

    email: str = Field(
        ...,
        min_length=5,
        max_length=150
    )

    password: str = Field(
        ...,
        min_length=6,
        max_length=100
    )


class LoginRequest(BaseModel):
    email: str = Field(
        ...,
        min_length=5,
        max_length=150
    )

    password: str = Field(
        ...,
        min_length=6,
        max_length=100
    )


class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    name: str
    email: str


# =========================================================
# USER SCHEMAS
# =========================================================

class UserCreate(BaseModel):
    name: str = Field(
        ...,
        min_length=1,
        max_length=100
    )

    email: str = Field(
        ...,
        min_length=5,
        max_length=150
    )


class UserResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True
    )

    id: int
    name: str
    email: str


# =========================================================
# PROJECT SCHEMAS
# =========================================================

class ProjectCreate(BaseModel):
    name: str = Field(
        ...,
        min_length=1,
        max_length=150
    )

    description: Optional[str] = Field(
        default="",
        max_length=500
    )

    user_id: int


class ProjectResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True
    )

    id: int
    name: str
    description: Optional[str]
    user_id: int


# =========================================================
# TASK SCHEMAS
# =========================================================

class TaskCreate(BaseModel):
    title: str = Field(
        ...,
        min_length=1,
        max_length=200
    )

    project_id: int

    status: Literal[
        "todo",
        "in-progress",
        "done"
    ] = "todo"

    priority: Literal[
        "low",
        "medium",
        "high"
    ] = "medium"

    due_date: Optional[date] = None


class TaskResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True
    )

    id: int
    title: str
    project_id: int
    status: str
    priority: str
    due_date: Optional[date]