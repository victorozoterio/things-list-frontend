import axios from "axios";

export const api = axios.create({
  baseURL: "/api/tasks",
  headers: { "Content-Type": "application/json" },
});
