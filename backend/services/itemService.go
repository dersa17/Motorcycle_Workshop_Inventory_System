package services

import (
	"fmt"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/dto"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/helpers"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"time"
)

type ItemService struct {
	DB *gorm.DB
}

func NewItemService(db *gorm.DB) *ItemService {
	return &ItemService{DB: db}
}

func (s *ItemService) Create(req *dto.ItemRequest, file *multipart.FileHeader) (*dto.ItemResponse, error) {

	kategoriUUID, _ := uuid.Parse(req.KategoriID)
	item := &models.Barang{
		KategoriID:  kategoriUUID,
		Nama:        req.Nama,
		Harga:       req.Harga,
		Stok:        req.StokInitial,
		StokInitial: req.StokInitial,
		StokMinimum: req.StokMinimum,
	}

	if file != nil {

		err := os.MkdirAll("uploads", os.ModePerm)
		if err != nil {
			return nil, err
		}

		path := fmt.Sprintf("uploads/%d_%s%s", time.Now().Unix(), uuid.New().String(), filepath.Ext(file.Filename))
		src, err := file.Open()
		if err != nil {
			return nil, err
		}
		defer src.Close()

		dst, err := os.Create(path)
		if err != nil {
			return nil, err
		}
		defer dst.Close()

		if _, err := io.Copy(dst, src); err != nil {
			return nil, err
		}

		item.Gambar = path
	}

	if err := s.DB.Create(&item).Error; err != nil {
		return nil, helpers.ParseDBError(err)
	}

	if err := s.DB.Preload("Kategori").First(&item, item.ID).Error; err != nil {
		return nil, helpers.ParseDBError(err)
	}

	riwayat := &models.RiwayatAktivitas{
		Nama:      "Membuat data barang",
		Deskripsi: "barang baru berhasil dibuat dengan nama: " + item.Nama,
		Tanggal:   time.Now(),
	}

	_ = s.DB.Create(&riwayat)

	response := &dto.ItemResponse{
		ID:    item.ID,
		Nama:  item.Nama,
		Harga: item.Harga,
		Kategori: dto.CategoryResponse{
			ID:   item.Kategori.ID,
			Nama: item.Kategori.Nama,
		},
		Stok:        item.Stok,
		StokInitial: item.StokInitial,
		StokMinimum: item.StokMinimum,
		Gambar:      item.Gambar,
	}
	return response, nil
}

func (s *ItemService) GetAll() (*dto.ItemListResponse, error) {
	var items []models.Barang

	if err := s.DB.Preload("Kategori").Find(&items).Error; err != nil {
		return nil, helpers.ParseDBError(err)
	}

	var responses []dto.ItemResponse

	for _, item := range items {
		responses = append(responses, dto.ItemResponse{
			ID:    item.ID,
			Nama:  item.Nama,
			Harga: item.Harga,
			Kategori: dto.CategoryResponse{
				ID:   item.Kategori.ID,
				Nama: item.Kategori.Nama,
			},
			Stok:        item.Stok,
			StokInitial: item.StokInitial,
			StokMinimum: item.StokMinimum,
			Gambar:      item.Gambar,
		})
	}

	response := &dto.ItemListResponse{
		Items: responses,
	}

	return response, nil
}

func (s *ItemService) Update(id string, req *dto.ItemUpdateRequest, file *multipart.FileHeader) (*dto.ItemResponse, error) {
	item := &models.Barang{}

	if err := s.DB.First(item, "id = ?", id).Error; err != nil {
		return nil, helpers.ParseDBError(err)
	}

	kategoriUUID, _ := uuid.Parse(req.KategoriID)
	item.KategoriID = kategoriUUID

	item.Nama = req.Nama
	item.Harga = req.Harga
	item.StokMinimum = req.StokMinimum

	

	if file != nil {

		err := os.MkdirAll("uploads", os.ModePerm)
		if err != nil {
			return nil, err
		}

		if item.Gambar != "" {
		if err := os.Remove(item.Gambar); err != nil && !os.IsNotExist(err) {
			fmt.Println("gagal menghapus file:", err)
		}
		}

		path := fmt.Sprintf("uploads/%d_%s%s", time.Now().Unix(), uuid.New().String(), filepath.Ext(file.Filename))
		src, err := file.Open()
		if err != nil {
			return nil, err
		}
		defer src.Close()

		dst, err := os.Create(path)
		if err != nil {
			return nil, err
		}
		defer dst.Close()

		if _, err := io.Copy(dst, src); err != nil {
			return nil, err
		}

		item.Gambar = path
	}

	if err := s.DB.Save(item).Error; err != nil {
		return nil, helpers.ParseDBError(err)
	}

	if err := s.DB.Preload("Kategori").First(&item, item.ID).Error; err != nil {
		return nil, helpers.ParseDBError(err)
	}

	riwayat := &models.RiwayatAktivitas{
		Nama:      "Memperbarui data barang",
		Deskripsi: fmt.Sprintf("Memperbarui data barang '%s'", item.Nama),
		Tanggal:   time.Now(),
	}

	_ = s.DB.Create(&riwayat)

	response := &dto.ItemResponse{
		ID:    item.ID,
		Nama:  item.Nama,
		Harga: item.Harga,
		Kategori: dto.CategoryResponse{
			ID:   item.Kategori.ID,
			Nama: item.Kategori.Nama,
		},
		Stok:        item.Stok,
		StokInitial: item.StokInitial,
		StokMinimum: item.StokMinimum,
		Gambar:      item.Gambar,
	}

	return response, nil
}

func (s *ItemService) Delete(id string) (*dto.ItemResponse, error) {
	item := &models.Barang{}

	if err := s.DB.Preload("Kategori").First(item, "id = ?", id).Error; err != nil {
		return nil, helpers.ParseDBError(err)
	}

	if item.Gambar != "" {
		if err := os.Remove(item.Gambar); err != nil && !os.IsNotExist(err) {
			fmt.Println("gagal menghapus file:", err)
		}
	}

	if err := s.DB.Delete(item, "id = ?", id).Error; err != nil {
		return nil, helpers.ParseDBError(err)
	}

	riwayat := &models.RiwayatAktivitas{
		Nama:      "Menghapus data barang",
		Deskripsi: fmt.Sprintf("Menghapus barang '%s'", item.Nama),
		Tanggal:   time.Now(),
	}

	_ = s.DB.Create(&riwayat)

	response := &dto.ItemResponse{
		ID:    item.ID,
		Nama:  item.Nama,
		Harga: item.Harga,
		Kategori: dto.CategoryResponse{
			ID:   item.Kategori.ID,
			Nama: item.Kategori.Nama,
		},
		Stok:        item.Stok,
		StokInitial: item.StokInitial,
		StokMinimum: item.StokMinimum,
		Gambar:      item.Gambar,
	}

	return response, nil
}
