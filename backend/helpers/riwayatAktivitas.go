package helpers

import 
(
	"time"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/models"
	"gorm.io/gorm"

)


func LogRiwayatAsync(db * gorm.DB, nama, deskripsi string) {
	go func() {
		riwayat := &models.RiwayatAktivitas{
			Nama: nama,
			Deskripsi: deskripsi,
			Tanggal: time.Now(),
		}

		_ = db.Create(&riwayat)
	}()
}