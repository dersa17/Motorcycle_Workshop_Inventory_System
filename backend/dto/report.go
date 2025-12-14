package dto

import ("time")

type ReportRequest struct {
    TanggalMulai   string `form:"tanggalMulai"`
    TanggalSelesai string `form:"tanggalSelesai"`
}

type ReportFilter struct {
    TanggalMulai   time.Time
    TanggalSelesai time.Time
}


type ReportPurchaseResponse struct {
	Tanggal string `json:"tanggal"`
	IdDetailTransaksi string `json:"idDetailTransaksi"`
	IdTransaksi string `json:"idTransaksi"`
	IdBarang string `json:"idBarang"`
	NamaSupplier string `json:"namaSupplier"`
	NamaBarang string `json:"namaBarang"`
	Jumlah int `json:"jumlah"`
	HargaSatuan float64 `json:"hargaSatuan"`
	Total float64 `json:"total"`
}

type ReportSalesResponse struct {
	Tanggal string `json:"tanggal"`
	IdDetailTransaksi string `json:"idDetailTransaksi"`
	IdTransaksi string `json:"idTransaksi"`
	IdBarang string `json:"idBarang"`
	NamaBarang string `json:"namaBarang"`
	Jumlah int `json:"jumlah"`
	HargaSatuan float64 `json:"hargaSatuan"`
	Total float64 `json:"total"`
}


type ReportInventoryResponse struct {
	IdBarang string `json:"idBarang"`
	NamaBarang string `json:"namaBarang"`
	StokAwal int `json:"stokAwal"`
	StokMasuk int `json:"stokMasuk"`
	StokKeluar int `json:"stokKeluar"`
	StokAkhir int `json:"stokAkhir"`
}


type ReportProfitLossResponse struct {
	TotalPembelian float64 `json:"totalPembelian"`
	TotalPenjualan float64 `json:"totalPenjualan"`
	LabaRugi float64 `json:"labaRugi"`
}
