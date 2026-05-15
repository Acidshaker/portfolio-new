import { v4 as uuidv4 } from "uuid";

export const units = [
  {
    id: uuidv4(),
    name: "Kg",
    equivalence: 1,
    description: "Kg descripción",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: "Saco",
    equivalence: 20,
    description: "Saco descripción",
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: "Caja",
    equivalence: 10,
    description: "Caja descripción",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
