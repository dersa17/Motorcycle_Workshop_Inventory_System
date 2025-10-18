package dto

import (
	"github.com/google/uuid"
)

type CategoryRequest struct {
	Nama string `json:"nama" binding:"required,max=100"`
}


type CategoryResponse struct {
	ID       uuid.UUID   `json:"id"`
	Nama string `json:"nama"`
	DeletedAt    *string `json:"deletedAt"`
}

type CategoryListResponse struct {
	Categories []CategoryResponse `json:"categories"`
}
