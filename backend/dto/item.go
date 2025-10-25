package dto

import (
	"github.com/google/uuid"
	"mime/multipart"
)

type ItemRequest struct {
	KategoriID string `form:"kategoriID" binding:"required,uuid"`
	Nama string `form:"nama" binding:"required"`
	Harga float64 `form:"harga" binding:"required,gt=0"`
	Stok int `form:"stok" binding:"required,gte=0"`
	StokMinimum int `form:"stokMinimum" binding:"required,gte=0"`
	Gambar *multipart.FileHeader `form:"gambar"`
}


type ItemResponse struct {
	ID uuid.UUID `json:"id"`
	Nama string `json:"nama"`
	Harga float64 `json:"harga"`
	Kategori CategoryResponse `json:"kategori"`
	Stok int `json:"stok"`
	StokMinimum int `json:"stokMinimum"`
	Gambar string `json:"gambar"`
}

type ItemListResponse struct {
	Items []ItemResponse `json:"items"`
}