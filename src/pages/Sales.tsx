import { ClientForm } from "@/components/clients/ClientForm";
import { ChangeSaleStatus } from "@/components/sales/ChangeSaleStatus";
import { SaleForm } from "@/components/sales/SaleForm";
import { SaleStats } from "@/components/sales/SaleStats";
import BaseTable from "@/components/shared/Table";
import { Box } from "@mui/material";
import { useRef, useState } from "react";

export const Sales = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

  const tableRef = useRef<{ reloadData: () => void }>(null);
  const [item, setItem] = useState<Record<string, any> | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  const openModal = (data?: Record<string, any>) => {
    if (data) {
      setItem(data);
      setIsEdit(true);
    } else {
      setItem(null);
      setIsEdit(false);
    }
    setIsView(false);
    setIsModalOpen(true);
  };

  const openViewModal = (data: Record<string, any>) => {
    setItem(data);
    setIsEdit(false);
    setIsView(true);
    setIsModalOpen(true);
  }

  const openStatusModal = (data: Record<string, any>) => {
    setItem(data);
    setIsStatusModalOpen(true);
  };

  const openStatsModal = (data: Record<string, any>) => {
    setItem(data);
    setIsStatsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    tableRef.current?.reloadData();
  };

  const closeStatusModal = () => {
    setIsStatusModalOpen(false);
    tableRef.current?.reloadData();
  };

  const closeStatsModal = () => {
    setIsStatsModalOpen(false);
    tableRef.current?.reloadData();
  }


  return (
    <Box sx={{ height: "100%" }}>
      <BaseTable
        ref={tableRef}
        action="sales"
        title="Ventas"
        addLabel="Agregar venta"
        isView={true}
        isEdit={true}
        isDelete={true}
        isReactive={true}
        isStats={true}
        onAddClick={openModal}
        onViewClick={openViewModal}
        onStatsClick={openStatsModal}
        onStatusChange={openStatusModal}
      />
      <SaleForm
        open={isModalOpen}
        handleClose={closeModal}
        data={item}
        isEdit={isEdit}
        isView={isView}
      />
      <ChangeSaleStatus
        open={isStatusModalOpen}
        handleClose={closeStatusModal}
        data={item}
      />
      <SaleStats open={isStatsModalOpen} handleClose={closeStatsModal} data={item} />
    </Box>
  );
};
