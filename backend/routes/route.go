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
	supplierService := services.NewSupplierService(db)
	supplierController := controllers.NewSupplierController(supplierService)
	itemService := services.NewItemService(db)
	itemController := controllers.NewItemController(itemService)
	transactionService := services.NewTransactionService(db)
	transactionController := controllers.NewTransactionController(transactionService)	

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

		supplier := api.Group("/suppliers")
		{
			supplier.Use(middlewares.AuthMiddleware())
			supplier.POST("",supplierController.Create)
			supplier.GET("",supplierController.GetAll)
			supplier.PUT("/:id",supplierController.Update)
			supplier.DELETE("/:id",supplierController.Delete)
		}

		item := api.Group("/items")
		{
			item.Use(middlewares.AuthMiddleware())
			item.POST("",itemController.Create)
			item.GET("",itemController.GetAll)
			item.PUT("/:id",itemController.Update)
			item.DELETE("/:id",itemController.Delete)
		}

		transaction := api.Group("/transactions")
		{
			transaction.Use(middlewares.AuthMiddleware())
			transaction.POST("", transactionController.Create)
			transaction.GET("", transactionController.GetAll)
			transaction.PUT("/:id", transactionController.Update)
		}


	}
}
