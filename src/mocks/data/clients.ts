import { v4 as uuidv4 } from "uuid";

export const generateClients = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: uuidv4(),
    name: `Cliente${i + 1}`,
    email: `cliente${i + 1}@example.com`,
    phone: `99012345${i + 1}`,
    profileImage: null,
    address: {
      street: "123 Main St",
      city: "Mexico",
      state: "Yucatán",
      colony: "Colonia",
      zip: "12345",
      intNumber: "123",
      extNumber: "456",
    },
    isActive: i % 3 !== 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
};

export const allClients = generateClients(20);
