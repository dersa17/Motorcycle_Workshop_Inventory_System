package services

import (
	"errors"
	"os"
	"time"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/dto"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/models"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthService struct {
	DB *gorm.DB
}

type Claims struct {
	User dto.UserResponse
	jwt.RegisteredClaims
}

func NewAuthService(db *gorm.DB) *AuthService {
	return &AuthService{DB: db}
}

func (s *AuthService) Login(req *dto.LoginRequest) (*dto.LoginResponse, error) {
	user := &models.User{}

	err := s.DB.Where("username = ?", req.Username).First(user).Error
	if err != nil {
		return nil, errors.New("username atau password tidak valid")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		return nil, errors.New("username atau password tidak valid")
	}

	userData := dto.UserResponse{
		ID:       user.ID,
		Username: user.Username,
		Email:    user.Email,
	}

	claims := &Claims{
		User: userData,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)), 
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "Sistem_Inventaris_Bengkel",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte( os.Getenv("JWT_SECRET_KEY")))
	if err != nil {
		return nil, errors.New("gagal membuat token JWT")
	}

	response := &dto.LoginResponse{
		User:  userData,
		Token: tokenString,
	}

	return response, nil
}

func (s *AuthService) Me(tokenUser *dto.UserResponse) (*dto.UserResponse, error) {
	user := &models.User{}
	err := s.DB.Where("id = ?", tokenUser.ID).First(user).Error
	if err != nil {
		return nil, errors.New("user tidak ditemukan")
	}

	response := &dto.UserResponse{
		ID:       user.ID,
		Username: user.Username,
		Email:    user.Email,
	}

	return response, nil
}

func (s *AuthService) UpdateProfile(
	tokenUser *dto.UserResponse,
	req *dto.UserUpdateRequest,
) (*dto.UserResponse, error) {

	user := &models.User{}

	if err := s.DB.Where("id = ?", tokenUser.ID).First(user).Error; err != nil {
		return nil, errors.New("user tidak ditemukan")
	}

	// update username
	if req.Username != nil {
		user.Username = *req.Username
	}

	// update email
	if req.Email != nil {
		user.Email = *req.Email
	}

	// update password (hanya jika dikirim)
	if req.NewPassword != nil || req.ConfirmPassword != nil {
		if req.NewPassword == nil || req.ConfirmPassword == nil {
			return nil, errors.New("password dan konfirmasi wajib diisi")
		}

		if *req.NewPassword != *req.ConfirmPassword {
			return nil, errors.New("password confirmation tidak sesuai")
		}

		hashed, err := bcrypt.GenerateFromPassword([]byte(*req.NewPassword), bcrypt.DefaultCost)
		if err != nil {
			return nil, errors.New("gagal hash password")
		}

		user.Password = string(hashed)
	}

	// simpan ke database
	if err := s.DB.Save(user).Error; err != nil {
		return nil, err
	}

	return &dto.UserResponse{
		ID:       user.ID,
		Username: user.Username,
		Email:    user.Email,
	}, nil
}
