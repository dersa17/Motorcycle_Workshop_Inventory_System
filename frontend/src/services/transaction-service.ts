import axios from "@/lib/axios"
import { transactionRequestSchema, transactionRequestUpdateSchema,  } from "@/schemas/transaction-schema";
import { z } from "zod";

export const getAllTransactions = async () => {
  const res = await axios.get("/transactions");
  return res.data.data;
};

export const createTransaction= async (data: z.infer<typeof transactionRequestSchema>) => {
    const res = await axios.post("/transactions", data )
    return res.data
}

export const updateTransaction = async (data: z.infer<typeof transactionRequestUpdateSchema>) => {
  const res = await axios.put(`/transactions/${data.id}`, data);
  return res.data;
};

