package main

import (
	"os"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/config"
	// "github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/models"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/routes"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/seeders"
	"github.com/gin-contrib/cors"
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
	r.Use(cors.New(cors.Config{
    AllowOrigins:     []string{os.Getenv("FRONTEND_ORIGINS")},
    AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
    AllowHeaders:     []string{"Origin", "Content-Type"},
    AllowCredentials: true,
	}))


    routes.SetupRoutes(r, db)
	r.Static("/uploads", "./uploads")
    r.Run(":8080")

}