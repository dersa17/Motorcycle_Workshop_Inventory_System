package dto

import (
	"github.com/google/uuid"
)

type TransactionRequest struct {
	SupplierID uuid.UUID `json:"supplierID" binding:"required,uuid"`
	Jenis      string    `json:"jenis" binding:"required,oneof=pembelian penjualan"`
	Tanggal    string    `json:"tanggal"`
	DetailTransaksi     []DetailTransactionRequest `json:"detail" binding:"required,dive"`
}

type TransactionUpdateRequest struct {
	SupplierID uuid.UUID `json:"supplierID" binding:"required,uuid"`
	Jenis      string    `json:"jenis" binding:"required,oneof=pembelian penjualan"`
	Tanggal    string    `json:"tanggal"`
	DetailTransaksi     []DetailTransactionUpdateRequest `json:"detail" binding:"required,dive"`
}

type TransactionResponse struct {
	ID          uuid.UUID                 `json:"id"`
	NamaSupplier string                    `json:"namaSupplier"`
	Jenis       string                    `json:"jenis"`
	Tanggal     string                    `json:"tanggal"`
	Total       float64                   `json:"total"`
	DetailTransaksi []DetailTransactionResponse `json:"detailTransaksi"`
}


type TransactionListResponse struct {
	Transactions []TransactionResponse `json:"transactions"`
}