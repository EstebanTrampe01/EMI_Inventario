import { API_BASE_URL } from "@/lib/config/env";

export async function fetchProducts(params?: {
  search?: string;
  limit?: number;
  page?: number;
  sort?: "ASC" | "DESC";
  sortBy?: string;
}) {
  const qp = new URLSearchParams({
    limit: String(params?.limit ?? 100),
    page: String(params?.page ?? 1),
    sort: String(params?.sort ?? "ASC"),
    sortBy: String(params?.sortBy ?? "name"),
  });
  if (params?.search) qp.set("search", params.search);
  const res = await fetch(`${API_BASE_URL}/products?${qp.toString()}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function updateProduct(
  id: string,
  body: Partial<{
    name: string
    description: string
    stock: number
    image: string
    categories: string[]
    minStock: number
  }>,
) {
  const res = await fetch(`${API_BASE_URL}/products/${id}` , {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function createProduct(body: { name: string; description: string; stock: number; image?: string; categories?: string[]; minStock?: number }) {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function deleteProduct(id: string) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
