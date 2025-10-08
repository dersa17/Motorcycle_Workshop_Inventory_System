package routes

import (
	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		api.GET("/test", func(c *gin.Context) {
			c.JSON(200, gin.H{"status": true})
		})
	}
}
