import { v4 as uuidv4 } from "uuid";

export const generateSupplies = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: uuidv4(),
    name: `Materia primera ${i + 1}`,
    sku: `SKU-1234${i + 1}`,
    supplyImage: `https://picsum.photos/id/${i}/50`, // random image
    description: `Materia primera ${i + 1} descripción`,
    // cost: (i * 100).toFixed(2),
    // price: ((i + 1) * 100).toFixed(2),
    // stock: i * 10,
    isActive: i % 3 !== 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
};

export const allSupplies = generateSupplies(100);
