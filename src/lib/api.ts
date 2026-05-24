function camelize(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

function camelizeKeys<T>(obj: any): T {
  if (Array.isArray(obj)) return obj.map(camelizeKeys) as T
  if (obj && typeof obj === "object" && obj.constructor === Object) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, val]) => [camelize(key), camelizeKeys(val)])
    ) as T
  }
  return obj
}

const BASE = "/api"

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }))
    throw new Error(err.error ?? "Request failed")
  }
  const data = await res.json()
  return camelizeKeys<T>(data)
}

// Items
export async function getItems(params?: Record<string, string>) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : ""
  return fetcher<any[]>(`/items${qs}`)
}

export async function getItem(id: string) {
  return fetcher<any>(`/items/${id}`)
}

export async function createItem(data: Record<string, any>) {
  return fetcher<any>("/items", { method: "POST", body: JSON.stringify(data) })
}

export async function updateItem(id: string, data: Record<string, any>) {
  return fetcher<any>(`/items/${id}`, { method: "PATCH", body: JSON.stringify(data) })
}

export async function deleteItem(id: string) {
  return fetcher<any>(`/items/${id}`, { method: "DELETE" })
}

// Requests
export async function getRequests(type?: string) {
  return fetcher<any[]>(`/requests${type ? `?type=${type}` : ""}`)
}

export async function createRequest(itemId: string) {
  return fetcher<any>("/requests", { method: "POST", body: JSON.stringify({ itemId }) })
}

export async function updateRequest(id: string, status: string) {
  return fetcher<any>(`/requests/${id}`, { method: "PATCH", body: JSON.stringify({ status }) })
}

// Favorites
export async function getFavorites() {
  return fetcher<string[]>("/favorites")
}

export async function addFavorite(itemId: string) {
  return fetcher<any>("/favorites", { method: "POST", body: JSON.stringify({ itemId }) })
}

export async function removeFavorite(itemId: string) {
  return fetcher<any>(`/favorites?itemId=${itemId}`, { method: "DELETE" })
}

// Conversations
export async function getConversations() {
  return fetcher<any[]>("/conversations")
}

export async function getConversation(id: string) {
  return fetcher<any>(`/conversations/${id}`)
}

export async function startConversation(otherUserId: string, otherUserName: string, itemId?: string, itemTitle?: string) {
  return fetcher<any>("/conversations", {
    method: "POST",
    body: JSON.stringify({ otherUserId, otherUserName, itemId, itemTitle }),
  })
}

// Messages
export async function getMessages(conversationId: string) {
  return fetcher<any[]>(`/messages?conversationId=${conversationId}`)
}

export async function sendMessage(conversationId: string, text: string) {
  return fetcher<any>("/messages", {
    method: "POST",
    body: JSON.stringify({ conversationId, text }),
  })
}

// Upload
export async function uploadImage(file: File) {
  const formData = new FormData()
  formData.append("file", file)
  const res = await fetch(`${BASE}/upload`, { method: "POST", body: formData })
  if (!res.ok) throw new Error("Upload failed")
  const data = await res.json()
  return camelizeKeys<{ url: string }>(data)
}

// Ratings
export async function getRatings(userId: string) {
  return fetcher<any[]>(`/ratings?userId=${userId}`)
}

export async function createRating(targetId: string, score: number, comment?: string, itemId?: string) {
  return fetcher<any>("/ratings", {
    method: "POST",
    body: JSON.stringify({ targetId, score, comment, itemId }),
  })
}

// Users
export async function getUser(id: string) {
  return fetcher<any>(`/users/${id}`)
}
