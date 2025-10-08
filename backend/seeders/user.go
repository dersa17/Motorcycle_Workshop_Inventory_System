package seeders

import (
    "fmt"
    "log"
    "github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/models"
    "gorm.io/gorm"
    "golang.org/x/crypto/bcrypt"
)

func SeedAdmin(db *gorm.DB) {
    var count int64
    db.Model(&models.User{}).Count(&count)

    if count == 0 {
        hashedPassword, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
        if err != nil {
            log.Fatal("Gagal membuat hash password:", err)
        }

        admin := models.User{
            Username: "admin",
            Email:    "admin@example.com",
            Password: string(hashedPassword),
        }

        if err := db.Create(&admin).Error; err != nil {
            log.Fatal("Gagal membuat akun admin:", err)
        }

        fmt.Println("✅ Seeder: Akun admin berhasil dibuat (username: admin, password: admin123)")
    } else {
        fmt.Println("ℹ️ Seeder: Akun admin sudah ada, tidak dibuat ulang.")
    }
}
