package dto

import (
	"github.com/google/uuid"
)

type TransactionRequest struct {
	SupplierID *string `json:"supplierID" binding:"omitempty,uuid"`
	Jenis      string    `json:"jenis" binding:"required,oneof=pembelian penjualan"`
	Tanggal    string    `json:"tanggal"`
	DetailTransaksi     []DetailTransactionRequest `json:"detailTransaksi" binding:"required,dive"`
}

type TransactionUpdateRequest struct {
	SupplierID *string `json:"supplierID" binding:"omitempty,uuid"`
	Jenis      string    `json:"jenis" binding:"required,oneof=pembelian penjualan"`
	Tanggal    string    `json:"tanggal"`
	DetailTransaksi     []DetailTransactionUpdateRequest `json:"detailTransaksi" binding:"required,dive"`
}

type TransactionResponse struct {
	ID          uuid.UUID                 `json:"id"`
	Supplier SupplierResponse             `json:"supplier"`
	Jenis       string                    `json:"jenis"`
	Tanggal     string                    `json:"tanggal"`
	Total       float64                   `json:"total"`
	DetailTransaksi []DetailTransactionResponse `json:"detailTransaksi"`
}


type TransactionListResponse struct {
	Transactions []TransactionResponse `json:"transactions"`
}