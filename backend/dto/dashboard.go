package dto


type DashbordResponse struct {
	JumlahBarang int64 `json:"jumlahBarang"` 
	JumlahTransaksi int64 `json:"jumlahTransaksi"`
	JumlahSupplier int64 `json:"jumlahSupplier"`
 	JumlahKategori int64 `json:"jumlahKategori"`
	StokBarangMenipisList []struct {
			Nama string `json:"nama"`
			Harga float64 `json:"harga"`
			Stok int `json:"stok"`
			StokInitial int `json:"stokInitial"`
			StokMinimum int `json:"stokMinimum"`
			Gambar string `json:"gambar"`
	} `json:"stokBarangMenipisList"`
	RiwayatAktivitas []struct {
		Nama string `json:"nama"`
		Deskripsi string `json:"deskripsi"`
		Tanggal string `json:"tanggal"`
	}
}

