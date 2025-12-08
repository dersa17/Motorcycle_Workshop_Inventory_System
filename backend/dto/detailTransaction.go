package dto

import(
	"github.com/google/uuid"
)


type DetailTransactionRequest struct {
	BarangID uuid.UUID `json:"barangID" binding:"required,uuid"`
	Jumlah   int       `json:"jumlah" binding:"required,gt=0"`
	HargaSatuan float64 `json:"hargaSatuan" binding:"required,gt=0"`
}	

type DetailTransactionUpdateRequest struct {
	BarangID uuid.UUID `json:"barangID" binding:"required,uuid"`
	Jumlah   int       `json:"jumlah" binding:"gte=0"`
	HargaSatuan float64 `json:"hargaSatuan" binding:"gte=0"`
}

type DetailTransactionResponse struct {
	ID          uuid.UUID `json:"id"`
	Barang  	ItemResponse    `json:"barang"`
	Jumlah      int       `json:"jumlah"`
	HargaSatuan float64   `json:"hargaSatuan"`
	Subtotal    float64   `json:"subtotal"`
}

