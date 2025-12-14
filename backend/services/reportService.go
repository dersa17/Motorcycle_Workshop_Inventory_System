package services

import (
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/dto"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/helpers"
	"gorm.io/gorm"
	"log"
)

type ReportService struct {
	DB *gorm.DB
}

func NewReportService(db *gorm.DB) *ReportService {
	return &ReportService{DB: db}
}

func (s *ReportService) GetPurchaseReport(req *dto.ReportFilter) ([]dto.ReportPurchaseResponse, error) {
	report := []dto.ReportPurchaseResponse{}

	err := s.DB.Raw(`
		SELECT
			t.tanggal,
			dt.id AS id_detail_transaksi,
			t.id AS id_transaksi,
			b.id AS id_barang,
			s.nama AS nama_supplier,
			b.nama AS nama_barang,
			dt.jumlah,
			dt.harga_satuan,
			dt.subtotal AS total
		FROM transaksis t
		JOIN detail_transaksis dt ON t.id = dt.transaksi_id
		JOIN barangs b ON dt.barang_id = b.id
		JOIN suppliers s ON t.supplier_id = s.id
		WHERE t.tanggal BETWEEN ? AND ?
	`, req.TanggalMulai, req.TanggalSelesai).Scan(&report).Error

	if err != nil {
		log.Println("DB ERROR:", err)
		return nil, err
		// return nil, helpers.ParseDBError(err)
	}

	return report, nil
}

func (s *ReportService) GetSalesReport(req *dto.ReportRequest) ([]dto.ReportSalesResponse, error) {
	report := []dto.ReportSalesResponse{}

	err := s.DB.Raw(`
		SELECT
			t.tanggal,
			dt.id AS id_detail_transaksi,	
			t.id AS id_transaksi,
			b.id AS id_barang,
			b.nama AS nama_barang,
			dt.jumlah,
			dt.harga_satuan,
			dt.subtotal AS total
		FROM transaksi t
		JOIN detail_transaksi dt ON t.id = dt.id_transaksi
		JOIN barang b ON dt.id_barang = b.id
		WHERE t.tanggal BETWEEN ? AND ?
	`, req.TanggalMulai, req.TanggalSelesai).Scan(&report).Error

	if err != nil {
		return nil, helpers.ParseDBError(err)
	}

	return report, nil
}

func (s *ReportService) GetInventoryReport(
	req *dto.ReportRequest,
) ([]dto.ReportInventoryResponse, error) {

	// struct internal untuk hasil raw SQL
	type rawInventory struct {
		IDBarang      string `gorm:"column:id_barang"`
		NamaBarang    string `gorm:"column:nama_barang"`
		StokInitial   int    `gorm:"column:stokInitial"`
		MasukSebelum  int    `gorm:"column:masuk_sebelum"`
		KeluarSebelum int    `gorm:"column:keluar_sebelum"`
		MasukPeriode  int    `gorm:"column:masuk_periode"`
		KeluarPeriode int    `gorm:"column:keluar_periode"`
	}

	var rawData []rawInventory

	// SQL hanya ambil KOMPONEN, tidak hitung stok
	err := s.DB.Raw(`
		SELECT
			b.id AS id_barang,
			b.nama AS nama_barang,
			b.stokInitial,

			COALESCE(SUM(CASE
				WHEN t.jenis = 'pembelian' AND t.tanggal < ?
				THEN dt.jumlah
			END), 0) AS masuk_sebelum,

			COALESCE(SUM(CASE
				WHEN t.jenis = 'penjualan' AND t.tanggal < ?
				THEN dt.jumlah
			END), 0) AS keluar_sebelum,

			COALESCE(SUM(CASE
				WHEN t.jenis = 'pembelian' AND t.tanggal BETWEEN ? AND ?
				THEN dt.jumlah
			END), 0) AS masuk_periode,

			COALESCE(SUM(CASE
				WHEN t.jenis = 'penjualan' AND t.tanggal BETWEEN ? AND ?
				THEN dt.jumlah
			END), 0) AS keluar_periode

		FROM barang b
		LEFT JOIN detail_transaksi dt ON b.id = dt.id_barang
		LEFT JOIN transaksi t ON dt.id_transaksi = t.id
		GROUP BY b.id, b.nama, b.stokInitial
	`,
		req.TanggalMulai,
		req.TanggalMulai,
		req.TanggalMulai, req.TanggalSelesai,
		req.TanggalMulai, req.TanggalSelesai,
	).Scan(&rawData).Error

	if err != nil {
		return nil, helpers.ParseDBError(err)
	}

	var result []dto.ReportInventoryResponse

	for _, r := range rawData {
		stokAwal := r.StokInitial + r.MasukSebelum - r.KeluarSebelum
		stokAkhir := stokAwal + r.MasukPeriode - r.KeluarPeriode

		result = append(result, dto.ReportInventoryResponse{
			IdBarang:   r.IDBarang,
			NamaBarang: r.NamaBarang,
			StokAwal:   stokAwal,
			StokMasuk:  r.MasukPeriode,
			StokKeluar: r.KeluarPeriode,
			StokAkhir:  stokAkhir,
		})
	}

	return result, nil
}

func (s *ReportService) GetProfitLossReport(
	req *dto.ReportRequest,
) (*dto.ReportProfitLossResponse, error) {

	var temp struct {
		TotalPembelian float64 `gorm:"column:total_pembelian"`
		TotalPenjualan float64 `gorm:"column:total_penjualan"`
	}

	err := s.DB.Raw(`
		SELECT
			COALESCE(SUM(CASE 
				WHEN t.jenis = 'pembelian' AND t.tanggal BETWEEN ? AND ?
				THEN t.total
			END), 0) AS total_pembelian,

			COALESCE(SUM(CASE 
				WHEN t.jenis = 'penjualan' AND t.tanggal BETWEEN ? AND ?
				THEN t.total
			END), 0) AS total_penjualan
		FROM transaksi t
	`, req.TanggalMulai, req.TanggalSelesai,
		req.TanggalMulai, req.TanggalSelesai,
	).Scan(&temp).Error

	if err != nil {
		return nil, helpers.ParseDBError(err)
	}

	result := &dto.ReportProfitLossResponse{
		TotalPembelian: temp.TotalPembelian,
		TotalPenjualan: temp.TotalPenjualan,
		LabaRugi:       temp.TotalPenjualan - temp.TotalPembelian,
	}

	return result, nil
}
