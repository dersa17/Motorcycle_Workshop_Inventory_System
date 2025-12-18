package controllers

import (
	"net/http"

	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/dto"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/services"
	"github.com/gin-gonic/gin"
)

type AuthController struct {
	Service *services.AuthService
}

func NewAuthController(service *services.AuthService) *AuthController {
	return &AuthController{
		Service: service,
	}
}

func (c *AuthController) Login(ctx *gin.Context) {
	request := &dto.LoginRequest{}

	err := ctx.ShouldBindJSON(request)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "data login tidak valid",
			"detail": err.Error(),
		})
		return
	}

	res, err := c.Service.Login(request)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"error": err.Error(),
		})
		return
	}

	ctx.SetCookie("token", res.Token, 3600*24, "/", "localhost", false, true)
	ctx.JSON(http.StatusOK, gin.H{
		"message": "login berhasil",
		"data":    res,
	})

}


func (c *AuthController) Logout(ctx *gin.Context) {
	ctx.SetCookie("token", "", -1, "/", "localhost", false, true)
	ctx.JSON(http.StatusOK, gin.H{
		"message": "logout berhasil",
	})
}


func (c *AuthController) Me(ctx *gin.Context) {
	userAny, ok := ctx.Get("currentUser")
	if !ok {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "user tidak ditemukan"})
			return
	}

	currentUser, ok := userAny.(*dto.UserResponse)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "format user tidak valid"})
		return
	}

	res, err := c.Service.Me(currentUser)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"error": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "success",
		"data":    res,
	})
}


func (c *AuthController) UpdateProfile(ctx *gin.Context) {
	request := &dto.UserUpdateRequest{}

	if err := ctx.ShouldBindJSON(request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	userAny, ok := ctx.Get("currentUser")
	if !ok {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "user tidak ditemukan"})
			return
	}

	currentUser, ok := userAny.(*dto.UserResponse)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "format user tidak valid"})
		return
	}

	res, err := c.Service.UpdateProfile(currentUser, request)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"error": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "berhasil memperbarui profile",
		"data":    res,
	})
}