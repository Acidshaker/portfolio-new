import BaseTable from "@/components/shared/Table";
import { SupplyForm } from "@/components/supplies/SupplyForm";
import { Box } from "@mui/material";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

export const Supplies = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tableRef = useRef<{ reloadData: () => void }>(null);
  const [item, setItem] = useState<Record<string, any> | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const openModal = (data?: Record<string, any>) => {
    // toast.info("Funcionalidad en desarrollo");
    if (data) {
      setItem(data);
      setIsEdit(true);
    } else {
      setItem(null);
      setIsEdit(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    tableRef.current?.reloadData();
  };

  return (
    <Box sx={{ height: "100%" }}>
      <BaseTable
        ref={tableRef}
        action="supplies"
        title="Productos"
        addLabel="Agregar producto"
        isView={true}
        isEdit={true}
        isDelete={true}
        onAddClick={openModal}
      />
      <SupplyForm
        open={isModalOpen}
        handleClose={closeModal}
        data={item}
        isEdit={isEdit}
      />
    </Box>
  );
};
