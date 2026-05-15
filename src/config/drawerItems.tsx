import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import HailIcon from "@mui/icons-material/Hail";
import AdUnitsIcon from "@mui/icons-material/AdUnits";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import InventoryIcon from "@mui/icons-material/Inventory";
import PaymentsIcon from "@mui/icons-material/Payments";

export const drawerItems = [
  // {
  //   label: "Inicio",
  //   path: "/home",
  //   icon: <HomeIcon />,
  // },
  {
    label: "Productos",
    path: "/supplies",
    icon: <InventoryIcon />,
    permissions: ["admin", "user", "superuser"],
  },
  // {
  //   label: "Compras",
  //   path: "/purchases",
  //   icon: <ShoppingCartIcon />,
  // },
  {
    label: "Proveedores",
    path: "/suppliers",
    icon: <EmojiPeopleIcon />,
    permissions: ["admin", "user", "superuser"],
  },
  {
    label: "Ventas",
    path: "/sales",
    icon: <PointOfSaleIcon />,
    permissions: ["admin", "user", "superuser"],
  },
  {
    label: "Clientes",
    path: "/clients",
    icon: <HailIcon />,
    permissions: ["admin", "user", "superuser"],
  },
  {
    label: "Pagos",
    path: "/payments",
    icon: <PaymentsIcon />,
    permissions: ["admin", "user", "superuser"],
  },
  {
    label: "Unidades",
    path: "/units",
    icon: <AdUnitsIcon />,
    permissions: ["admin", "user", "superuser"],
  },
];
