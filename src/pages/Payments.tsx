import { ClientForm } from "@/components/clients/ClientForm";
import { PaymentForm } from "@/components/payments/PaymentForm";
import { PaymentView } from "@/components/payments/PaymentView";
import { ChangeStatus } from "@/components/purchases/ChangeStatus";
import { PurchaseForm } from "@/components/purchases/PurchaseForm";
import BaseTable from "@/components/shared/Table";
import { Box, Tab, Tabs } from "@mui/material";
import { useRef, useState } from "react";



export const Payments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalViewOpen, setIsModalViewOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const tableRef = useRef<{ reloadData: () => void }>(null);
  const [item, setItem] = useState<Record<string, any> | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  const [value, setValue] = useState(0);

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
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

  const openViewModal = (data: Record<string, any>) => {
    setItem(data);
    setIsModalViewOpen(true);
  }
  const closeModal = () => {
    setIsModalOpen(false);
    tableRef.current?.reloadData();
  };

  const closeViewModal = () => {
    setIsModalViewOpen(false);
    tableRef.current?.reloadData();
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ height: "100%" }}>
      <BaseTable
        key={value}
        ref={tableRef}
        action={value === 1 ? "salePayments" : "payments"}
        title="Pagos"
        addLabel="Agregar pago"
        isView={true}
        isEdit={true}
        isDelete={true}
        onAddClick={openModal}
        onViewClick={openViewModal}
        isTabs={true}
        tabsChild={
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Ver por abono" {...a11yProps(0)} />
            <Tab label="Ver por venta" {...a11yProps(1)} />
          </Tabs>
        }
      />
      <PaymentForm
        open={isModalOpen}
        handleClose={closeModal}
        data={item}
        isEdit={isEdit}

      />
      <PaymentView open={isModalViewOpen} handleClose={closeViewModal} data={item} />
    </Box>
  );
};
