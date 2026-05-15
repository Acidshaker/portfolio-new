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
  Select,
  MenuItem,
} from "@mui/material";
import {
  required,
} from "../../utils/validations";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import Grid from "@mui/material/Grid";
import { useEffect, useRef, useState } from "react";
import { payments, sales, supplies, units } from "@/services/endpoints";
import AsyncAutocomplete, { AsyncAutocompleteRef } from "../shared/AsyncAutocomplete";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { hideLoading, showLoading } from "@/store/uiSlice";
import { toast } from "react-toastify";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";

const PAYMENT_METHODS = [
  { label: "Efectivo", value: "cash" },
  { label: "Transferencia bancaria", value: "transfer" },
  { label: "Tarjeta de crédito", value: "credit_card" },
  { label: "Tarjeta de débito", value: "debit_card" },
  { label: "Cheque", value: "check" },
];


interface props {
  open: boolean;
  handleClose: () => void;
  data?: any;
  isEdit?: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

export const PaymentForm = ({
  open,
  handleClose,
  data,
  isEdit,
}: props) => {
  const saleRef = useRef<AsyncAutocompleteRef>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [replaceReceipt, setReplaceReceipt] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  const methods = useForm<{
    sale: any;
    date: Dayjs;
    amount: string;
    receipt: string;
    paymentMethod: string;
  }>({
    mode: "onTouched",
    defaultValues: {
      date: dayjs(),
      paymentMethod: "cash",
    }
  });
  

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = methods;

  const originalAmount = isEdit ? parseFloat(data?.amount || 0) : 0;
  const selectedSale = watch("sale");
  const remaining = selectedSale ? selectedSale.total - selectedSale.payments.reduce((sum: number, p: any) => sum + p.amount, 0) : 0;
  const realLimit = remaining + originalAmount - Number(watch("amount"));
  const amountLabel = selectedSale
  ? `Pago (Restante: $${realLimit.toFixed(2)})`
  : "Pago";

  const currentReceipt = watch("receipt");

  const dispatch = useDispatch();

  const getSales = (params: {
    search: string;
    offset: number;
    limit: number;
  }) => sales.getSales({ ...params, isPaid: false });

const onSubmit = async (body: any) => {
  const formData = new FormData();
  formData.append("paymentDate", body.date.format("YYYY-MM-DD"));
  formData.append("amount", body.amount);
  formData.append("saleId", body.sale.id);
  formData.append("payment_method", body.paymentMethod);

  if (receiptFile) {
    formData.append("receipt", receiptFile);
  }

  if (isEdit) {
    formData.append("replace_receipt", String(replaceReceipt));
  }

  dispatch(showLoading());
  try {
    if (!isEdit) {
      await payments.createPayment(formData);
    } else {
      await payments.updatePayment(data.id, formData);
    }
    toast.success(`Pago ${isEdit ? "actualizado" : "creado"} con éxito`);
    handleClose();
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Error al procesar el pago");
  } finally {
    dispatch(hideLoading());
  }
};

  const handleCancel = () => {
    reset();
    handleClose();
  };

  const cleanFileStates = () => {
    setReceiptFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

useEffect(() => {
  cleanFileStates();
  setReplaceReceipt(false);
  if (open && data) {
    reset({
      date: dayjs(data.paymentDate || data.createdAt),
      amount: data.amount,
      sale: data.sale,
      receipt: data.receipt,
      paymentMethod: data.payment_method
    });
  } else {
    reset({
      date: dayjs(),
      amount: "",
      sale: null,
      receipt: "",
    });
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [open, data, reset]);


const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setReceiptFile(file);
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  }
};

const renderAttachmentArea = () => {
  if (isEdit && currentReceipt && !replaceReceipt) {
    return (
      <Box
        sx={{
          p: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          bgcolor: "grey.50",
          textAlign: "center",
        }}
      >
        <Typography variant="overline" color="text.secondary">
          Comprobante Actual
        </Typography>
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          sx={{ mt: 1 }}
        >
          <Button
            size="small"
            variant="contained"
            startIcon={<VisibilityIcon />}
            href={currentReceipt}
            target="_blank"
          >
            Ver
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => setReplaceReceipt(true)}
          >
            Reemplazar
          </Button>
        </Stack>
      </Box>
    );
  }

  return (
    <Box>
      <input
        type="file"
        ref={fileInputRef}
        hidden
        accept="image/*,application/pdf"
        onChange={handleFileChange}
      />

      {!receiptFile ? (
        <Box
          onClick={() => fileInputRef.current?.click()}
          sx={{
            border: "2px dashed",
            borderColor: errors.receipt ? "error.main" : "primary.main",
            borderRadius: 2,
            p: 3,
            textAlign: "center",
            cursor: "pointer",
            transition: "0.3s",
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <CloudUploadIcon
            sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
          />
          <Typography variant="body2">
            Haga clic para adjuntar comprobante
          </Typography>
          <Typography variant="caption" color="text.secondary">
            PNG, JPG o PDF
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            position: "relative",
            p: 1,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <IconButton
            size="small"
            onClick={cleanFileStates}
            sx={{
              position: "absolute",
              right: 5,
              top: 5,
              bgcolor: "background.paper",
              boxShadow: 1,
            }}
          >
            <CloseIcon fontSize="small" color="error" />
          </IconButton>

          <Stack direction="row" spacing={2} alignItems="center">
            {previewUrl ? (
              <Box
                component="img"
                src={previewUrl}
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 1,
                  objectFit: "cover",
                }}
              />
            ) : (
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 1,
                  bgcolor: "grey.200",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <InsertDriveFileIcon color="primary" />
              </Box>
            )}
            <Box sx={{ overflow: "hidden" }}>
              <Typography variant="body2" noWrap sx={{ fontWeight: "bold" }}>
                {receiptFile.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {(receiptFile.size / 1024).toFixed(2)} KB
              </Typography>
            </Box>
          </Stack>
        </Box>
      )}

      {isEdit && replaceReceipt && !receiptFile && (
        <Button
          size="small"
          fullWidth
          sx={{ mt: 1 }}
          onClick={() => setReplaceReceipt(false)}
        >
          Cancelar cambio
        </Button>
      )}
    </Box>
  );
};

  function subtitleOption (item:any) {
    return (
      <Typography sx={{padding: 1}} variant="caption" component="p" color="text.secondary">
        {`monto restante: $${item.payment.amount_remaining.toFixed(2)}`}
      </Typography>
    );
  }

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
        <Box maxWidth="400px" sx={style}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Detalles del pago
          </Typography>
          <Box sx={{ overflowY: "auto", flex: 1, pr: 1, overflowX: "hidden" }}>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid size={12} sx={{ mt: 2 }}>
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      adapterLocale="es"
                    >
                      <Controller
                        name="date"
                        control={control}
                        rules={{ required: required("Fecha") }}
                        render={({ field, fieldState }) => (
                          <DatePicker
                            label="Fecha"
                            value={field.value ?? dayjs()}
                            onChange={field.onChange}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error: !!fieldState.error,
                                helperText: fieldState.error?.message || " ",
                              },
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid size={12}>
                    <AsyncAutocomplete
                      ref={saleRef}
                      name="sale"
                      label="Venta"
                      control={control}
                      optionLabelKey="folio"
                      subtitleChildren={subtitleOption}
                      rules={{
                        required: required("Venta"),
                      }}
                      errors={errors}
                      fetchFn={getSales}
                    />
                  </Grid>

                  <Grid size={12}>
                    <FormControl fullWidth error={!!errors.paymentMethod}>
                      <InputLabel>Método de Pago</InputLabel>
                      <Controller
                        {...register("paymentMethod")}
                        name="paymentMethod"
                        control={control}
                        rules={{ required: required("Método de Pago") }}
                        render={({ field }) => (
                          <Select
                            label="Método de Pago"
                            {...field}
                            sx={{ borderRadius: 2 }}
                          >
                            {PAYMENT_METHODS.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                      <FormHelperText>
                        {(errors.paymentMethod?.message as string) || " "}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      label={amountLabel}
                      onKeyDown={(e) => {
                        const allowedKeys = [
                          "Backspace",
                          "Tab",
                          "ArrowLeft",
                          "ArrowRight",
                          "Delete",
                          ".",
                        ];
                        const isNumber = /^[0-9]$/.test(e.key);
                        if (!isNumber && !allowedKeys.includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      {...register("amount", {
                        required: required("Pago"),
                        validate: (value) => {
                          const number = parseFloat(value);
                          const isPositive = number > 0;
                          const hasTwoDecimals = /^\d+(\.\d{1,2})?$/.test(
                            value,
                          );

                          // 1. Validaciones básicas
                          if (!isPositive)
                            return "El costo debe ser mayor a cero";
                          if (!hasTwoDecimals)
                            return "Máximo dos decimales permitidos";

                          // 2. Lógica de validación de saldo (Venta)
                          const saleData = watch("sale");
                          if (saleData) {
                            const remaining =
                              saleData.payment?.amount_remaining || 0;

                            // Si estamos editando, el "límite real" es el saldo restante + el monto original del pago
                            // Si es nuevo, el monto original es 0.
                            const originalAmount = isEdit
                              ? parseFloat(data?.amount || 0)
                              : 0;
                            const realLimit = remaining + originalAmount;

                            // Usamos un pequeño margen para evitar errores de precisión de punto flotante
                            if (number > realLimit + 0.001) {
                              return `El pago excede el disponible ($${realLimit.toFixed(2)})`;
                            }
                          }

                          return true;
                        },
                      })}
                      error={!!errors.amount}
                      helperText={errors.amount?.message || " "}
                      fullWidth
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        },
                        inputLabel: { shrink: true },
                      }}
                    />
                  </Grid>
                  <Grid size={12} sx={{ mt: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 1, fontWeight: "bold" }}
                    >
                      Comprobante de pago
                    </Typography>
                    {renderAttachmentArea()}
                  </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid size={{ sm: 6, xs: 12 }}>
                    <Button color="secondary" fullWidth onClick={handleCancel}>
                      Cancelar
                    </Button>
                  </Grid>

                  <Grid size={{ sm: 6, xs: 12 }}>
                    <Button color="primary" fullWidth type="submit">
                      {data?.id ? "Actualizar" : "Agregar"}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </FormProvider>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
