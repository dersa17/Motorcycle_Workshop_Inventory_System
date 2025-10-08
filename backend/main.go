package main

import (
	// "os"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/config"
	// "github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/models"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/routes"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/seeders"
	"github.com/gin-gonic/gin"
)


func main () {
	db := config.InitDB()

	// if (os.Getenv("APP_ENV") == "development") {
	// 	db.AutoMigrate(
	// 		&models.User{},
	// 		&models.Kategori{},
	// 		&models.Barang{},
	// 		&models.RiwayatAktivitas{},
	// 		&models.Transaksi{},
	// 		&models.DetailTransaksi{},
	// 		&models.Supplier{},
	// 	)
	// }

	seeders.SeedAdmin(db)
	r := gin.Default()
    routes.SetupRoutes(r)
    r.Run(":8080")

}