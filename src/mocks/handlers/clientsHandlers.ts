// mocks/handlers/usersHandler.ts
import { http, HttpResponse } from "msw";
import { allClients } from "../data/clients";

export const clientsHandler = http.get("api/clients", ({ request }) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") || "1");
  const limit = Number(url.searchParams.get("limit") || "10");
  const offset = Number(url.searchParams.get("offset") || "0");
  const search = url.searchParams.get("search")?.toLowerCase() || "";
  const isActive = url.searchParams.get("isActive");

  // console.log("Interceptando /api/users");

  let filtered = allClients;
  // console.log(filtered)

  if (search) {
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        u.phone.toLowerCase().includes(search)
    );
  }

  if (isActive !== null) {
    filtered = filtered.filter((u) => u.isActive === (isActive === "true"));
  }

  const results = filtered.slice(offset, offset + limit);

  return HttpResponse.json({
    error: false,
    status: 200,
    message: "Clientes obtenidos correctamente",
    data: {
      count: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
      page,
      results,
    },
  });
});
