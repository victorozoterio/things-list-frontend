import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const path = Array.isArray(req.query.path)
    ? `/${req.query.path.join("/")}`
    : req.query.path
    ? `/${req.query.path}`
    : "";

  const apiUrl = `https://api-thingslist.vercel.app/tasks${path}`;

  const headers: Record<string, string> = {
    "x-api-key": process.env.X_API_KEY || "",
  };

  if (["POST", "PUT"].includes(req.method || "")) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(apiUrl, {
    method: req.method,
    headers,
    body: ["POST", "PUT"].includes(req.method || "")
      ? JSON.stringify(req.body)
      : undefined,
  });

  let data: string | object = "";
  try {
    data = await response.json();
  } catch (_error) {
    data = { success: response.ok };
  }

  res.status(response.status).json(data);
}
