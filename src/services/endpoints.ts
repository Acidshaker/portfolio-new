import api from "./api";

export const auth = {
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  register: (data: { email: string; password: string }) =>
    api.post("/auth/register", data),
  logout: () => api.post("/logout"),
  refreshToken: () => api.post("/refresh"),
};

export const items = {
  getAll: () => api.get("/items"),
  getById: (id: string) => api.get(`/items/${id}`),
  create: (data: any) => api.post("/items", data),
  update: (id: string, data: any) => api.put(`/items/${id}`, data),
  delete: (id: string) => api.delete(`/items/${id}`),
};

// puedes seguir agregando módulos:
export const users = {
  getUsers: (params: Record<string, any>) => api.get("/auth/users", { params }),
  getUserById: (id: string) => api.get(`/auth/users/${id}`),
  createUser: (data: any) => api.post("/auth/users", data),
  // getProfile: () => api.get("/user/profile"),
  updateUser: (id: string, data: any) => api.patch(`/auth/users/${id}`, data),
  // updateProfile: (data: any) => api.put("/user/profile", data),
  deleteUser: (id: string) => api.delete(`/auth/users/${id}`),
  reactiveUser: (id: string) => api.post(`/auth/users/${id}/reactivate`),
};

export const units = {
  getUnits: (params: Record<string, any>) => api.get("/units", { params }),
  createUnit: (data: any) => api.post("/units", data),
  updateUnit: (id: string, data: any) => api.patch(`/units/${id}`, data),
  deleteUnit: (id: string) => api.delete(`/units/${id}`),
  reactiveUnit: (id: string) => api.post(`/units/${id}/reactivate`),
};

export const supplies = {
  getSupplies: (params: Record<string, any>) =>
    api.get("/supplies", { params }),
  createSupply: (data: any) => api.post("/supplies", data),
  updateSupply: (id: string, data: any) => api.patch(`/supplies/${id}`, data),
  deleteSupply: (id: string) => api.delete(`/supplies/${id}`),
  reactiveSupply: (id: string) => api.post(`/supplies/${id}/reactivate`),
};

export const suppliers = {
  getSuppliers: (params: Record<string, any>) =>
    api.get("/suppliers", { params }),
  createSupplier: (data: any) => api.post("/suppliers", data),
  updateSupplier: (id: string, data: any) =>
    api.patch(`/suppliers/${id}`, data),
  deleteSupplier: (id: string) => api.delete(`/suppliers/${id}`),
  reactiveSupplier: (id: string) => api.post(`/suppliers/${id}/reactivate`),
};

export const clients = {
  getClients: (params: Record<string, any>) => api.get("/clients", { params }),
  createClient: (data: any) => api.post("/clients", data),
  updateClient: (id: string, data: any) => api.patch(`/clients/${id}`, data),
  deleteClient: (id: string) => api.delete(`/clients/${id}`),
  reactiveClient: (id: string) => api.post(`/clients/${id}/reactivate`),
};

export const purchases = {
  getPurchases: (params: Record<string, any>) =>
    api.get("/purchases", { params }),
  createPurchase: (data: any) => api.post("/purchases", data),
  changeStatus: (id: string, data: any) =>
    api.patch(`/purchases/${id}/status`, data),
  updatePurchase: (id: string, data: any) =>
    api.patch(`/purchases/${id}`, data),
  deletePurchase: (id: string) => api.delete(`/purchases/${id}`),
  reactivePurchase: (id: string) => api.post(`/purchases/${id}/reactivate`),
};

export const sales = {
  getSales: (params: Record<string, any>) => api.get("/sales", { params }),
  generateReceipt: (id: string) => api.get(`/sale-receipts/${id}`, { responseType: "blob" }),
  downloadExcel: (id: string) => api.get(`/sales/${id}/report`, { responseType: "blob" }),
  createSale: (data: any) => api.post("/sales", data),
  changeStatus: (id: string, data: any) =>
    api.patch(`/sales/${id}/status`, data),
  updateSale: (id: string, data: any) => api.patch(`/sales/${id}`, data),
  deleteSale: (id: string) => api.delete(`/sales/${id}`),
  reactiveSale: (id: string) => api.post(`/sales/${id}/reactivate`),
};

export const payments = {
  getPayments: (params: Record<string, any>) =>
    api.get("/payments", { params }),
  getPaymentReceipt: (id: string) => api.get(`/payments/receipt/${id}`, { responseType: "blob" }),
  getPaymentSales: (params: Record<string, any>) =>
    api.get("/payments/sales", { params }),
  createPayment: (data: any) => api.post("/payments", data),
  updatePayment: (id: string, data: any) => api.patch(`/payments/${id}`, data),
  deletePayment: (id: string) => api.delete(`/payments/${id}`),
}
