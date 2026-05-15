// mocks/data/users.ts
import { v4 as uuidv4 } from "uuid";

export const generateUsers = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: uuidv4(),
    firstName: `Usuario${i + 1}`,
    lastName: `Apellido${i + 1}`,
    email: `usuario${i + 1}@example.com`,
    profileImage: null,
    role: i % 2 === 0 ? "admin" : "user",
    isActive: i % 3 !== 0,
    isSuperuser: i % 5 === 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
};

export const allUsers = generateUsers(20);
