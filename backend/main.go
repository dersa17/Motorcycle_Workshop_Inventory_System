package main

import (
	"os"

	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/config"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/models"
)


func main () {
	db := config.InitDB()

	if (os.Getenv("APP_ENV") == "development") {
		db.AutoMigrate(
			&models.User{},
			&models.Kategori{},
			&models.Barang{},
			&models.RiwayatAktivitas{},
			&models.Transaksi{},
			&models.DetailTransaksi{},
			&models.Supplier{},
		)
	}

}