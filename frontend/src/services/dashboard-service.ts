import axios from "@/lib/axios"

export const getDataDashboard = async () => {
  const res = await axios.get("/dashboard");
  console.log("res: ", res.data)
  return res.data;
};

