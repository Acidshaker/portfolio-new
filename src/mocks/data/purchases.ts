import { v4 as uuidv4 } from "uuid";

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const statuses = ["Pendiente", "Pagado", "Cancelado", "Completado"];

const generateProducts = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: uuidv4(),
    name: `Materia primera ${i + 1}`,
    cost: (i * 100).toFixed(2),
    productImage: `https://picsum.photos/id/${i}/50`, // random image
    unit: "kg",
    quantity: randomInt(1, 10),
    // sku: `SKU-1234${i + 1}`,
    // description: `Materia primera ${i + 1} descripción`,
    // price: ((i + 1) * 100).toFixed(2),
    // stock: i * 10,
    // isActive: i % 3 !== 0,
    // createdAt: new Date().toISOString(),
    // updatedAt: new Date().toISOString(),
  }));
};

export const generatePurchases = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const products = generateProducts(randomInt(1, 5));

    const total = products.reduce((sum, product) => {
      const cost = parseFloat(product.cost);
      return sum + (isNaN(cost) ? 0 : cost);
    }, 0);

    return {
      id: uuidv4(),
      folio: `Folio-C00${i + 1}`,
      date: new Date().toISOString(),
      products,
      total: total.toFixed(2),
      supplier: `Proveedor ${randomInt(1, 10)}`,
      billFile: null,
      status: statuses[randomInt(0, 3)],
      isActive: i % 3 !== 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
};

export const allPurchases = generatePurchases(50);
