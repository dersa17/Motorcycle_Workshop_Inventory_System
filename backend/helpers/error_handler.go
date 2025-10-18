package helpers

import(
	 "strings"
	 "errors"
)

func ParseDBError(err error) error {
	if err == nil {
		return nil
	}

	msg := err.Error()

	switch {
	case strings.Contains(msg, "Duplicate entry"):
		return errors.New("data sudah ada, gunakan nama lain")
	case strings.Contains(msg, "foreign key constraint"):
		return errors.New("data ini masih digunakan oleh entitas lain")
	case strings.Contains(msg, "record not found"):
		return errors.New("data tidak ditemukan")
	case strings.Contains(msg, "violates not-null constraint"):
		return errors.New("beberapa data wajib diisi")
	default:
		return errors.New("terjadi kesalahan pada server")
	}
}
