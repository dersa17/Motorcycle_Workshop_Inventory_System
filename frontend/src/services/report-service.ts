import axios from "@/lib/axios"

export const getPurchaseReport = async (startDate?: Date, endDate?: Date, ) => {
  const res = await axios.get("/reports/purchase", {
    params: {
      tanggalMulai: startDate,
      tanggalSelesai: endDate
    }
  });
  return res.data;
};

export const getSalesReport = async (startDate?: Date , endDate?: Date) => {
  const res = await axios.get("/reports/sales",{
    params: {
      tanggalMulai: startDate,
      tanggalSelesai: endDate
    }
  });
  return res.data;
}

export const getItemsReport = async (startDate?: Date, endDate?: Date) => {
  const res = await axios.get("/reports/items", {
    params: {
      tanggalMulai: startDate,
      tanggalSelesai: endDate
    }
  });
  return res.data;
}

export const getProfitLossReport = async (startDate?: Date, endDate?: Date ) => {
  const res = await axios.get("/reports/profit-loss", {
    params: {
      tanggalMulai: startDate,
      tanggalSelesai: endDate
    }
  });
  const data = res.data;
  return Array.isArray(data) ? data : [data];
}