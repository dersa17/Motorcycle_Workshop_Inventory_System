import axios from "@/lib/axios"
import { itemRequestSchema } from "@/schemas/item-schema";
import { z } from "zod";

export const getAllItem = async () => {
    const res = await axios.get("/items")
    return res.data.data
}

export const createItem = async (data: FormData) => {
    const res = await axios.post("/items", data)
    return res.data
}

export const updateItem = async (id: string, data: FormData) => {
    const res = await axios.put(`/items/${id}`,data)
    return res.data
}

export const deleteItem = async (id: string) => {
    const res = await axios.delete(`/items/${id}`)
    return res.data
}   