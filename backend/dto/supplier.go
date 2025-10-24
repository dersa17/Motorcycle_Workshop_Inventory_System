package dto


import (
	"github.com/google/uuid"
)

type SupplierRequest struct {
	Nama string `json:"nama" binding:"required,max=100"`
	Alamat string `json:"alamat" binding:"required,max=255"`
	Kontak string `json:"kontak" binding:"required,max=15"`
}

type SupplierResponse struct {
	ID uuid.UUID `json:"id"`
	Nama string `json:"nama"`
	Alamat string `json:"alamat"`
	Kontak string `json:"kontak"`
}

type SupplierListResponse struct {
	Suppliers []SupplierResponse `json:"suppliers"`
}