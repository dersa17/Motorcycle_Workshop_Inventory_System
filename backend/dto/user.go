package dto

import (
	"github.com/google/uuid"
)

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type UserResponse struct {
	ID       uuid.UUID   `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
}

type LoginResponse struct {
	User  UserResponse `json:"user"`
	Token string       `json:"token"`
}

type UserUpdateRequest struct {
	Username *string  `json:"username"`
	Email *string `json:"email"`
	NewPassword *string `json:"newPassword"`
	ConfirmPassword *string `json:"confirmPassword"`
}
