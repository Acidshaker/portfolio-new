import { unitsHandler } from "./handlers/unitsHandlers";
import { usersHandler } from "./handlers/usersHandlers";
import { clientsHandler } from "./handlers/clientsHandlers";
import { suppliersHandler } from "./handlers/suppliersHandlers";
import { suppliesHandler } from "./handlers/suppliesHandlers";
import { purchasesHandler } from "./handlers/purchasesHandlers";
import { salesHandler } from "./handlers/salesHandlers";

export const handlers = [usersHandler, unitsHandler, clientsHandler, suppliersHandler, suppliesHandler, purchasesHandler, salesHandler];
