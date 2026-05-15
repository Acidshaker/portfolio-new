import {
  Backdrop,
  Box,
  Button,
  Divider,
  Fade,
  FormControlLabel,
  Modal,
  Checkbox,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  Chip,
  Tooltip,
} from "@mui/material";
import { required } from "../../utils/validations";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import Grid from "@mui/material/Grid";
import { useEffect, useRef, useState } from "react";
import { payments, sales, supplies, units } from "@/services/endpoints";
import AsyncAutocomplete, {
  AsyncAutocompleteRef,
} from "../shared/AsyncAutocomplete";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { hideLoading, showLoading } from "@/store/uiSlice";
import { toast } from "react-toastify";
import LocalBaseTable from "../shared/LocalTable";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import { useAlerts } from "@/utils/alerts";
import { Payment } from "@mui/icons-material";
import { PaymentForm } from "./PaymentForm";

interface props {
  open: boolean;
  handleClose: () => void;
  data?: any;
}

export const PaymentView = ({ open, handleClose, data,}: props) => {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [item, setItem] = useState<Record<string, any> | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  const { confirmationAlert } = useAlerts();
  const dispatch = useDispatch();

  const edit = (row?: Record<string, any>) => {
    if (row) {
      setItem({...row, sale: data });
      setIsEdit(true);
    } else {
      setItem(null);
      setIsEdit(false);
    }
    setIsModalOpen(true);
  }

    const closeModal = () => {
      setIsModalOpen(false);
      handleClose();
    };

  const remove = (row: any) => {
    const foo = async () => {
      showLoading();
      try {
        await payments.deletePayment(row.id);
        toast.success("Pago eliminado");
        handleClose();
      } catch (error) {
        toast.error("Error al eliminar el pago");
      } finally {
        hideLoading();
      }
    }
    confirmationAlert(foo, "¿Seguro que deseas eliminar este pago?");
  }

  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "calc(100% - 16px)",
    maxHeight: "90vh", // altura máxima del modal
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
  };

  const generateReceipt = async (id: string) => {
      dispatch(showLoading());
      try {
          const res = await payments.getPaymentReceipt(id);

          const blob = new Blob([res.data], { type: "application/pdf" });
          const fileURL = window.URL.createObjectURL(blob);
          window.open(fileURL, "_blank");

        // Download PDF
        // const url = window.URL.createObjectURL(new Blob([res.data]));
        // const link = document.createElement("a");
        // link.href = url;
        // link.setAttribute("download", `${id}.pdf`);
        // document.body.appendChild(link);
        // link.click();
      } catch (err) {
        console.log(err);
        // toast.error("Error al generar el recibo");
      } finally {
        dispatch(hideLoading());
      }
  }


  useEffect(() => {
  }, [open, data]);


  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box maxWidth="md" sx={style}>
          {/* <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Pagos de la venta {data?.folio}
          </Typography> */}
          <Box sx={{ overflowY: "auto", flex: 1, pr: 1, overflowX: "hidden" }}>
            {data && (
              <LocalBaseTable
                title={"Folio: " + data?.folio}
                subtitleChildren={
                  <Chip
                    label={`$${(+data.total - data?.payment?.amount_remaining).toFixed(2)} / $${Number(data?.total).toFixed(2)}`}
                    color={
                      data?.payment?.amount_remaining === 0
                        ? "success"
                        : "warning"
                    }
                  />
                }
                data={data?.payments || []}
                headers={[
                  {
                    key: "index",
                    label: "#",
                    render: (_, __, index) => index,
                  },
                  {
                    key: "paymentDate",
                    label: "Fecha",
                    render: (v) => dayjs(v).format("DD/MM/YYYY"),
                  },
                  { key: "amount", label: "Monto", sortable: true },
                ]}
                searchValue={search}
                onSearchChange={setSearch}
                filterFn={(data) =>
                  data.filter((p) =>
                    p?.paymentDate
                      ?.toLowerCase()
                      .includes(search.toLowerCase()),
                  )
                }
                actionsRender={(row: any) => (
                  <>
                    <Tooltip title="Editar">
                    <IconButton color="info" onClick={() => edit(row)}>
                      <EditIcon />
                    </IconButton>
                    </Tooltip>
                    <Tooltip title="Generar recibo">
                      <IconButton
                        onClick={() => generateReceipt(row.id)}
                        color="warning"
                      >
                        <RequestQuoteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                    <IconButton color="error" onClick={() => remove(data.id)}>
                      <DeleteIcon />
                    </IconButton>
                    </Tooltip>
                  </>
                )}
              />
            )}
          </Box>
          <PaymentForm
            open={isModalOpen}
            handleClose={() => closeModal()}
            data={item}
            isEdit={isEdit}
          />
        </Box>
      </Fade>
    </Modal>
  );
};
