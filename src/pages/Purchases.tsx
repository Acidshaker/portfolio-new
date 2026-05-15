import { ClientForm } from "@/components/clients/ClientForm";
import { ChangeStatus } from "@/components/purchases/ChangeStatus";
import { PurchaseForm } from "@/components/purchases/PurchaseForm";
import BaseTable from "@/components/shared/Table";
import { Box } from "@mui/material";
import { useRef, useState } from "react";

export const Purchases = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const tableRef = useRef<{ reloadData: () => void }>(null);
  const [item, setItem] = useState<Record<string, any> | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  const openModal = (data?: Record<string, any>, view: boolean = false) => {
    if (data) {
      setItem(data);
      setIsEdit(true);
      setIsView(view);
    } else {
      setItem(null);
      setIsEdit(false);
      setIsView(false);
    }
    setIsModalOpen(true);
  };

  const openStatusModal = (data: Record<string, any>) => {
    setItem(data);
    setIsStatusModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    tableRef.current?.reloadData();
  };

  const closeStatusModal = () => {
    setIsStatusModalOpen(false);
    tableRef.current?.reloadData();
  };

  return (
    <Box sx={{ height: "100%" }}>
      <BaseTable
        ref={tableRef}
        action="purchases"
        title="Compras"
        addLabel="Agregar compra"
        isView={true}
        isEdit={true}
        isDelete={true}
        onAddClick={openModal}
        onStatusChange={openStatusModal}
      />
      <PurchaseForm
        open={isModalOpen}
        handleClose={closeModal}
        data={item}
        isEdit={isEdit}
        isView={isView}
      />
      <ChangeStatus
        open={isStatusModalOpen}
        handleClose={closeStatusModal}
        data={item}
      />
    </Box>
  );
};
