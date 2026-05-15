import BaseTable from "@/components/shared/Table";
import { UserForm } from "@/components/users/UserForm";
import { Box } from "@mui/material";
import { useRef, useState } from "react";

export const Users = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tableRef = useRef<{ reloadData: () => void }>(null);
  const [item, setItem] = useState<Record<string, any> | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const openModal = (data?: Record<string, any>) => {
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
        action="users"
        title="Usuarios"
        addLabel="Agregar usuario"
        isView={true}
        isEdit={true}
        isDelete={true}
        onAddClick={openModal}
      />
      <UserForm
        open={isModalOpen}
        handleClose={closeModal}
        data={item}
        isEdit={isEdit}
      />
    </Box>
  );
};
