import { http, HttpResponse } from "msw";
import { allPurchases } from "../data/purchases";

export const purchasesHandler = http.get("api/purchases", ({ request }) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") || "1");
  const limit = Number(url.searchParams.get("limit") || "10");
  const offset = Number(url.searchParams.get("offset") || "0");
  const search = url.searchParams.get("search")?.toLowerCase() || "";
  const isActive = url.searchParams.get("isActive");

  let filtered = allPurchases;

  if (search) {
    filtered = filtered.filter(
      (u) =>
        u.status.toLowerCase().includes(search) ||
        u.supplier.toLowerCase().includes(search) ||
        u.folio.toLowerCase().includes(search)
    );
  }

  if (isActive !== null) {
    filtered = filtered.filter((u) => u.isActive === (isActive === "true"));
  }

  const results = filtered.slice(offset, offset + limit);

  return HttpResponse.json({
    error: false,
    status: 200,
    message: "Compras obtenidas correctamente",
    data: {
      count: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
      page,
      results,
    },
  });
});
