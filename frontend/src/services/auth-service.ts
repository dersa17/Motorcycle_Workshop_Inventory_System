import axios from "@/lib/axios"
import { loginSchema } from "@/schemas/auth-schema";
import { z } from "zod";

export const me = async () => {
  const res = await axios.get("/auth/me");
  return res.data;
};

export const login = async (data: z.infer<typeof loginSchema>) => {
  const res = await axios.post("/auth/login", data);
  return res.data;
};

export const logout = async () => {
  const res = await axios.post("/auth/logout");
  return res.data;
};

