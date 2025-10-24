import axios from "@/lib/axios"
import { supplierSchema } from "@/schemas/supplier-schema";
import { z } from "zod";

export const getAllSupplier = async () => {
  const res = await axios.get("/suppliers");
  return res.data.data;
};

export const createSupplier= async (data: z.infer<typeof supplierSchema>) => {
    const res = await axios.post("/suppliers", data )
    return res.data
}

export const updateSupplier = async (data: z.infer<typeof supplierSchema>) => {
  const res = await axios.put(`/suppliers/${data.id}`, data);
  return res.data;
};

export const deleteSupplier = async (id: string) => {
    const res = await axios.delete(`/suppliers/${id}`)
    return res.data
}
