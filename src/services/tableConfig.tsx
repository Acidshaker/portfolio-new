import { Box, Chip } from "@mui/material";
import api from "./api";
import {
  units,
  users,
  clients,
  suppliers,
  supplies,
  sales,
  purchases,
  payments,
} from "./endpoints";

export interface TableHeader {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface TableConfigItem {
  getData: (params: Record<string, any>) => Promise<any>;
  headers: TableHeader[];
  deleteFunction?: (id: string) => Promise<any>;
  reactiveFunction?: (id: string) => Promise<any>;
}

const formattedDate = (date: string) => {
  const dateObj = new Date(date);
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
};

const getRole = (role: string) => {
  switch (role) {
    case "admin":
      return "Administrador";
    case "manager":
      return "Gerente";
    case "staff":
      return "Empleado";
    default:
      return "Usuario";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "complete":
      return "Completado";
    case "paid":
      return "Pagado";
    case "pending":
      return "Pendiente";
    default:
      return "Cancelado";
  }
};

const getSaleStatusLabel = (status: string) => {
  switch (status) {
    case "quoted":
      return "Cotización";
    case "ordered":
      return "Orden de compra";
    case "receipted":
      return "Remisión de pago";
    default:
      return "Cancelado";
  }
}

const chipColor = (value: string) => {
  switch (value) {
    case "complete":
      return "success";
    case "paid":
      return "info";
    case "pending":
      return "warning";
    default:
      return "error";
  }
};

const saleChipColor = (value: string) => {
  switch (value) {
    case "quoted":
      return "warning";
    case "ordered":
      return "info";
    case "receipted":
      return "success";
    default:
      return "error";
  }
}

function chipPaymentStatus (amountRemaining: number, total: number) {
  return (
    <Chip
      label={`$${(total - amountRemaining).toFixed(2)} / $${total.toFixed(2)}`}
      color={amountRemaining === 0 ? "success" : "warning"}
    />
  )
}

export const tableConfig: Record<string, TableConfigItem> = {
  users: {
    getData: (params) => users.getUsers(params),
    headers: [
      {
        key: "firstName",
        label: "Nombre(s)",
        align: "center",
        sortable: true,
        render: (value) => value,
      },
      {
        key: "lastName",
        label: "Apellido(s)",
        align: "center",
        sortable: true,
        render: (value) => value,
      },
      {
        key: "email",
        label: "Correo electrónico",
        align: "center",
        sortable: true,
        render: (value) => value,
      },
      {
        key: "role",
        label: "Rol",
        align: "center",
        sortable: true,
        render: (value) => getRole(value),
      },
    ],
    deleteFunction: (id) => users.deleteUser(id),
    reactiveFunction: (id) => users.reactiveUser(id),
  },

  units: {
    getData: (params) => units.getUnits(params),
    headers: [
      {
        key: "name",
        label: "Nombre",
        align: "center",
        sortable: true,
        render: (value) => value,
      },
      // {
      //   key: "equivalent",
      //   label: "Equivalencia",
      //   align: "center",
      //   sortable: true,
      //   render: (value) => value,
      // },
      {
        key: "description",
        label: "Descripción",
        align: "center",
        sortable: true,
        render: (value) => value,
      },
    ],
    deleteFunction: (id) => units.deleteUnit(id),
    reactiveFunction: (id) => units.reactiveUnit(id),
  },
  clients: {
    getData: (params) => clients.getClients(params),
    headers: [
      {
        key: "name",
        label: "Nombre o razón social",
        align: "center",
        sortable: true,
        render: (value) => value,
      },
      {
        key: "email",
        label: "Correo electrónico",
        align: "center",
        sortable: true,
        render: (value) => value,
      },
      {
        key: "phone",
        label: "Teléfono",
        align: "center",
        sortable: true,
        render: (value) => value,
      },
    ],
    deleteFunction: (id) => clients.deleteClient(id),
    reactiveFunction: (id) => clients.reactiveClient(id),
  },
  suppliers: {
    getData: (params) => suppliers.getSuppliers(params),
    headers: [
      {
        key: "name",
        label: "Nombre o razón social",
        align: "center",
        sortable: true,
        render: (value) => value,
      },
      {
        key: "email",
        label: "Correo electrónico",
        align: "center",
        sortable: true,
        render: (value) => value,
      },
      {
        key: "phone",
        label: "Teléfono",
        align: "center",
        sortable: true,
        render: (value) => value,
      },
    ],
  },
  supplies: {
    getData: (params) => supplies.getSupplies(params),
    headers: [
      {
        key: "image",
        label: "Imagen",
        align: "center",
        render: (value) => (
          <Box
            component="img"
            src={value}
            alt="imagen"
            sx={{
              width: 48,
              height: 48,
              objectFit: "cover",
              borderRadius: 1,
            }}
          />
        ),
      },
      {
        key: "name",
        label: "Nombre",
        align: "center",
        sortable: true,
        render: (value) => value,
      },
      {
        key: "unit",
        label: "Unidad",
        align: "center",
        sortable: true,
        render: (value) => " Kg",
      },
      // {
      //   key: "cost",
      //   label: "Costo",
      //   align: "center",
      //   sortable: true,
      //   render: (value) => "$ " + value,
      // },
      // {
      //   key: "price",
      //   label: "Precio de venta",
      //   align: "center",
      //   sortable: true,
      //   render: (value) => "$ " + value,
      // },
    ],
    deleteFunction: (id) => supplies.deleteSupply(id),
    reactiveFunction: (id) => supplies.reactiveSupply(id),
  },
  sales: {
    getData: (params) => sales.getSales(params),
    headers: [
      {
        key: "date",
        label: "Fecha",
        align: "center",
        sortable: true,
        render: (value) => formattedDate(value),
      },
      {
        key: "folio",
        label: "Folio",
        align: "center",
        sortable: true,
        render: (value) => value,
      },
      {
        key: "client",
        label: "Cliente",
        align: "center",
        sortable: true,
        render: (value) => value.name,
      },
      {
        key: "status",
        label: "Estado",
        align: "center",
        sortable: true,
        render: (value) => (
          <Chip
            label={getSaleStatusLabel(value)}
            color={saleChipColor(value)}
          />
        ),
      },
      {
        key: "total",
        label: "Total",
        align: "center",
        sortable: true,
        render: (value) => "$ " + value,
      },
    ],
    deleteFunction: (id) => sales.deleteSale(id),
    reactiveFunction: (id) => sales.reactiveSale(id),
  },
  purchases: {
    getData: (params) => purchases.getPurchases(params),
    headers: [
      {
        key: "date",
        label: "Fecha",
        align: "center",
        sortable: true,
        render: (value) => formattedDate(value),
      },
      {
        key: "folio",
        label: "Folio",
        align: "center",
        sortable: true,
        render: (value) => value,
      },
      {
        key: "supplier",
        label: "Proveedor",
        align: "center",
        sortable: true,
        render: (value) => value.name,
      },
      {
        key: "status",
        label: "Estado",
        align: "center",
        sortable: true,
        render: (value) => (
          <Chip label={getStatusLabel(value)} color={chipColor(value)} />
        ),
      },
      {
        key: "total",
        label: "Total",
        align: "center",
        sortable: true,
        render: (value) => "$ " + value,
      },
    ],
    deleteFunction: (id) => purchases.deletePurchase(id),
    reactiveFunction: (id) => purchases.reactivePurchase(id),
  },
  payments: {
    getData: (params) => payments.getPayments(params),
    headers: [
      {
        key: "createdAt",
        label: "Fecha",
        align: "center",
        sortable: true,
        render: (value) => formattedDate(value),
      },
      {
        key: "sale",
        label: "Venta",
        align: "center",
        sortable: true,
        render: (value) => value?.folio,
      },
      {
        key: "amount",
        label: "Monto",
        align: "center",
        sortable: true,
        render: (value) => "$ " + value,
      },
    ],
    deleteFunction: (id) => payments.deletePayment(id),
  },
  salePayments: {
    getData: (params) => payments.getPaymentSales(params),
    headers: [
      {
        key: "date",
        label: "Fecha",
        align: "center",
        sortable: true,
        render: (value) => formattedDate(value),
      },
      {
        key: "folio",
        label: "Venta",
        align: "center",
        sortable: true,
        render: (value) => value,
      },
      {
        key: "payments",
        label: "Pagos",
        align: "center",
        sortable: true,
        render: (value) => value?.length,
      },
      {
        key: "total",
        label: "Estado",
        align: "center",
        sortable: true,
        render: (_value, row) =>
          chipPaymentStatus(
            row.payment?.amount_remaining ?? 0,
            Number(row.total),
          ),
      },
    ],
    deleteFunction: (id) => payments.deletePayment(id),
  },
};
