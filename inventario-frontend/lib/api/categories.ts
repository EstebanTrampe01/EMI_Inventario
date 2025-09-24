import { API_BASE_URL } from "@/lib/config/env";

export async function fetchCategories() {
  const res = await fetch(`${API_BASE_URL}/categories`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function createCategory(body: { name: string; products?: string[] }) {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      msg = data?.message || msg;
    } catch {
      try {
        msg = await res.text();
      } catch {}
    }
    throw new Error(msg);
  }
  return res.json();
}

export async function updateCategory(id: string, body: { name?: string; products?: string[] }) {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      msg = data?.message || msg;
    } catch {
      try {
        msg = await res.text();
      } catch {}
    }
    throw new Error(msg);
  }
  return res.json();
}

export async function deleteCategory(id: string) {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
