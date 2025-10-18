package routes

import (
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/controllers"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/services"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/middlewares"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(router *gin.Engine, db *gorm.DB) {
	authService := services.NewAuthService(db)
	authController := controllers.NewAuthController(authService)
	categoryService := services.NewCategoryService(db)
	categoryController := controllers.NewCategoryController(categoryService)

	api := router.Group("/api")
	{
		api.GET("/test", func(c *gin.Context) {
			c.JSON(200, gin.H{"status": true})
		})

		auth := api.Group("/auth")
		{
			auth.GET("/me", middlewares.AuthMiddleware(), authController.Me)
			auth.POST("/logout", middlewares.AuthMiddleware(), authController.Logout)
			auth.POST("/login", authController.Login)
		}
		category  := api.Group("/categories") 
		{
			category.Use(middlewares.AuthMiddleware())
			category.POST("", categoryController.Create)
			category.GET("",categoryController.GetAll)
			category.GET("/active",categoryController.GetActive)
			category.PUT("/:id", categoryController.Update)
			category.DELETE("/:id", categoryController.Delete)
			category.PUT("restore/:id",categoryController.Restore)
		}


	}
}
