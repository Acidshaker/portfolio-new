import { v4 as uuidv4 } from "uuid";

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const statuses = ["Pendiente", "Pagado", "Cancelado", "Completado"];

const generateProducts = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: uuidv4(),
    name: `Materia primera ${i + 1}`,
    productImage: `https://picsum.photos/id/${i}/50`, // random image
    price: ((i + 1) * 100).toFixed(2),
    unit: "kg",
    quantity: randomInt(1, 10),
    // sku: `SKU-1234${i + 1}`,
    // description: `Materia primera ${i + 1} descripción`,
    // cost: (i * 100).toFixed(2),
    // stock: i * 10,
    // isActive: i % 3 !== 0,
    // createdAt: new Date().toISOString(),
    // updatedAt: new Date().toISOString(),
  }));
};

export const generateSales = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const products = generateProducts(randomInt(1, 5));

    const total = products.reduce((sum, product) => {
      const price = parseFloat(product.price);
      return sum + (isNaN(price) ? 0 : price);
    }, 0);

    return {
      id: uuidv4(),
      folio: `Folio-V00${i + 1}`,
      date: new Date().toISOString(),
      products,
      total: total.toFixed(2),
      client: `Cliente ${randomInt(1, 10)}`,
      status: statuses[randomInt(0, 3)],
      isBilled: i % 2 === 0,
      isActive: i % 3 !== 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
};

export const allSales = generateSales(100);
