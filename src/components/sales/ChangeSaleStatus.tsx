import {
  Backdrop,
  Box,
  Button,
  Divider,
  Fade,
  Modal,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  Grid,
} from "@mui/material";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../store/uiSlice";
import { sales } from "../../services/endpoints";
import { toast } from "react-toastify";
import { useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentIcon from "@mui/icons-material/Payment";
import { required, isPhone, isVehiclePlate} from "../../utils/validations";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import BadgeIcon from "@mui/icons-material/Badge";
import PaletteIcon from "@mui/icons-material/Palette";

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", sm: 750 }, // <-- Más ancho para dar aire a los campos
  maxHeight: "90vh",
  bgcolor: "background.paper",
  borderRadius: 4, // Un poco más redondeado para un look moderno
  boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const PAYMENT_METHODS = [
  { label: "Efectivo", value: "cash" },
  { label: "Transferencia bancaria", value: "transfer" },
  { label: "Tarjeta de crédito", value: "credit_card" },
  { label: "Tarjeta de débito", value: "debit_card" },
  { label: "Cheque", value: "check" },
];

const BASIC_COLORS = [
  { label: "Amarillo", value: "#ffeb3b" },
  { label: "Azul", value: "#1976d2" },
  { label: "Beige / Arena", value: "#d7ccc8" },
  { label: "Blanco", value: "#ffffff" },
  { label: "Café / Marrón", value: "#5d4037" },
  { label: "Dorado", value: "#b8860b" },
  { label: "Gris / Plata", value: "#9e9e9e" },
  { label: "Morado", value: "#7b1fa2" },
  { label: "Naranja", value: "#f57c00" },
  { label: "Negro", value: "#000000" },
  { label: "Rojo", value: "#d32f2f" },
  { label: "Turquesa", value: "#00ced1" },
  { label: "Verde", value: "#388e3c" },
];

export const ChangeSaleStatus = ({ open, handleClose, data }: any) => {
  const methods = useForm({
    mode: "onTouched",
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = methods;
  const dispatch = useDispatch();
  const currentStatus = watch("status");
  const isFreightActive = watch("isFreight");

  useEffect(() => {
    if (open && data) reset({ status: data.status });
    console.log(data)
  }, [open, data, reset]);

  const onSubmit = async (body: any) => {
    const newData = {
      status: body.status,
      amount: body.status === "receipted" ? body.payment : null,
      payment_method: body.status === "receipted" ? body.paymentMethod : null,
      freight_details:
        body.status === "receipted"
          ? {
              driver_name: body.freightDriver || null,
              vehicle_plates: body.freightVehiclePlates || null,
              vehicle_mark: body.freightVehicleMark || null,
              vehicle_color: BASIC_COLORS.find((c) => c.value === body.freightVehicleColor)?.label || null,
              driver_phone: body.freightPhone || null,
            }
          : null,
    };

    console.log(newData)

    dispatch(showLoading());
    try {
      await sales.changeStatus(data.id, newData);
      toast.success(`Estado actualizado con éxito`);
      handleClose();
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
    >
      <Fade in={open}>
        <Box sx={modalStyle}>
          {/* HEADER CON ESTILO REFORZADO */}
          <Box
            sx={{
              p: 3,
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  p: 1,
                  borderRadius: 2,
                  display: "flex",
                }}
              >
                <ReceiptLongIcon fontSize="large" />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  fontWeight="800"
                  sx={{ lineHeight: 1.2 }}
                >
                  Actualizar Venta
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    bgcolor: "rgba(0,0,0,0.15)",
                    px: 1,
                    borderRadius: 1,
                    fontWeight: "500",
                  }}
                >
                  {`FOLIO: ${data?.folio}`}
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={handleClose}
              sx={{
                color: "white",
                bgcolor: "rgba(0,0,0,0.1)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.2)" },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ p: 4, overflowY: "auto" }}>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  {/* SELECTOR DE ESTADO */}
                  <Grid size={12}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      fontWeight="bold"
                      color="primary"
                    >
                      ESTADO DE LA VENTA
                    </Typography>
                    <FormControl fullWidth error={!!errors.status}>
                      <InputLabel>Nuevo Estado</InputLabel>
                      <Controller
                        name="status"
                        control={control}
                        rules={{ required: required("Estado") }}
                        render={({ field }) => (
                          <Select
                            label="Nuevo Estado"
                            {...field}
                            sx={{ borderRadius: 2 }}
                          >
                            <MenuItem disabled value="quoted">
                              Cotización
                            </MenuItem>
                            <MenuItem value="ordered">Orden de compra</MenuItem>
                            <MenuItem value="receipted">
                              Remisión de venta
                            </MenuItem>
                            <MenuItem value="cancelled">Cancelado</MenuItem>
                          </Select>
                        )}
                      />
                      <FormHelperText>
                        {(errors.status?.message as string) || " "}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {currentStatus === "receipted" && (
                    <>
                      <Grid size={12}>
                        <Divider sx={{ my: 1 }} />
                        {/* <Typography
                          variant="subtitle2"
                          gutterBottom
                          fontWeight="bold"
                          color="primary"
                        >
                          PAGO E INFORMACIÓN LOGÍSTICA
                        </Typography> */}
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          fontWeight="bold"
                          color="primary"
                        >
                          {`PAGO INICIAL (monto restante: $ ${(data?.payment?.amount_remaining - (Number(watch("payment")) || 0)).toFixed(2)})`}
                        </Typography>
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          label="Monto del Pago Inicial"
                          fullWidth
                          {...register("payment", {
                            required: required("Pago inicial"),
                            validate: (value) => {
                              const num = parseFloat(value);
                              if (num > data?.total)
                                return "No puede ser mayor al total";
                              if (num <= 0) return "Debe ser mayor a cero";
                              return true;
                            },
                          })}
                          error={!!errors.payment}
                          helperText={
                            (errors.payment?.message as string) || " "
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PaymentIcon color="action" sx={{ mr: 0.5 }} />{" "}
                                $
                              </InputAdornment>
                            ),
                            sx: { borderRadius: 2 },
                          }}
                        />
                      </Grid>

                      {/* SELECTOR DE MÉTODO DE PAGO */}
                      <Grid size={{ xs: 12, md: 6 }}>
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
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}
                                  >
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

                      {/* SECCIÓN DE FLETE TIPO CARD */}

                      <Grid size={12}>
                        <Box
                          sx={{
                            p: 0,
                            borderRadius: 3,
                            border: "1px solid",
                            // Usamos alpha para que el borde no sea tan agresivo
                            borderColor:
                              Number(isFreightActive) > 0
                                ? "primary.main"
                                : (theme) => theme.palette.divider,
                            overflow: "hidden",
                            transition: "all 0.3s ease",
                          }}
                        >
                          {/* <Box
                            sx={{
                              px: 2,
                              py: 1,
                              // Usamos el color de acción del tema o un fondo sutil
                              bgcolor: isFreightActive
                                ? "primary.main"
                                : (theme) =>
                                    theme.palette.mode === "dark"
                                      ? "rgba(255,255,255,0.05)"
                                      : "rgba(0,0,0,0.05)",
                              color: isFreightActive ? "white" : "text.primary",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <FormControlLabel
                              sx={{ m: 0 }}
                              control={
                                <Checkbox
                                  {...register("isFreight")}
                                  checked={!!isFreightActive}
                                  sx={{
                                    color: isFreightActive
                                      ? "white"
                                      : "inherit",
                                    "&.Mui-checked": { color: "white" },
                                  }}
                                />
                              }
                              label={
                                <Typography
                                  variant="subtitle2"
                                  fontWeight="bold"
                                >
                                  ¿Requiere servicio de flete?
                                </Typography>
                              }
                            />
                            <LocalShippingIcon
                              sx={{
                                opacity: 0.8,
                                color: isFreightActive
                                  ? "white"
                                  : "action.active",
                              }}
                            />
                          </Box> */}

                          {Number(data?.freight_fee) > 0 && (
                            <>
                              <Box
                                sx={{
                                  p: 3,
                                  // Un fondo apenas perceptible para separar los campos
                                  bgcolor: (theme) =>
                                    theme.palette.mode === "dark"
                                      ? "rgba(255,255,255,0.02)"
                                      : "rgba(0,0,0,0.01)",
                                }}
                              >
                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  fontWeight="bold"
                                  color="primary"
                                  sx={{ mb: 2 }}
                                >
                                  INFORMACIÓN LOGÍSTICA
                                </Typography>

                                <Grid container spacing={2}>
                                  <Grid container spacing={2}>
                                    <Grid size={12}>
                                      <TextField
                                        label="Nombre del Chofer"
                                        fullWidth
                                        {...register("freightDriver", {
                                          required: required("Nombre"),
                                        })}
                                        error={!!errors.freightDriver}
                                        helperText={
                                          (errors.freightDriver
                                            ?.message as string) || " "
                                        }
                                        InputProps={{
                                          startAdornment: (
                                            <InputAdornment position="start">
                                              <PersonIcon fontSize="small" />
                                            </InputAdornment>
                                          ),
                                        }}
                                      />
                                    </Grid>
                                    <Grid size={6}>
                                      <TextField
                                        label="Placas del Vehículo"
                                        fullWidth
                                        {...register("freightVehiclePlates", {
                                          required: required("Placas"),
                                          validate: isVehiclePlate,
                                        })}
                                        error={!!errors.freightVehiclePlates}
                                        helperText={
                                          (errors.freightVehiclePlates
                                            ?.message as string) || " "
                                        }
                                        InputProps={{
                                          startAdornment: (
                                            <InputAdornment position="start">
                                              <BadgeIcon fontSize="small" />
                                            </InputAdornment>
                                          ),
                                        }}
                                      />
                                    </Grid>
                                    <Grid size={6}>
                                      <TextField
                                        label="Teléfono Contacto (opcional)"
                                        fullWidth
                                        {...register("freightPhone", {
                                          validate: isPhone,
                                        })}
                                        error={!!errors.freightPhone}
                                        helperText={
                                          (errors.freightPhone
                                            ?.message as string) || " "
                                        }
                                        InputProps={{
                                          startAdornment: (
                                            <InputAdornment position="start">
                                              <PhoneIphoneIcon fontSize="small" />
                                            </InputAdornment>
                                          ),
                                        }}
                                      />
                                    </Grid>

                                    <Grid size={6}>
                                      <TextField
                                        label="Marca / Modelo (opcional)"
                                        fullWidth
                                        {...register("freightVehicleMark")}
                                        error={!!errors.freightVehicleMark}
                                        helperText={
                                          (errors.freightVehicleMark
                                            ?.message as string) || " "
                                        }
                                        InputProps={{
                                          startAdornment: (
                                            <InputAdornment position="start">
                                              <DirectionsCarIcon fontSize="small" />
                                            </InputAdornment>
                                          ),
                                        }}
                                      />
                                    </Grid>
                                    <Grid size={6}>
                                      <FormControl
                                        fullWidth
                                        error={!!errors.freightVehicleColor}
                                      >
                                        <InputLabel>
                                          Color (opcional)
                                        </InputLabel>
                                        <Controller
                                          name="freightVehicleColor"
                                          control={control}
                                          render={({ field }) => (
                                            <Select
                                              label="Color"
                                              {...field}
                                              startAdornment={
                                                <PaletteIcon
                                                  sx={{
                                                    mr: 1,
                                                    ml: -0.5,
                                                    color: "action.active",
                                                    fontSize: 20,
                                                  }}
                                                />
                                              }
                                            >
                                              {BASIC_COLORS.map((c) => (
                                                <MenuItem
                                                  key={c.value}
                                                  value={c.value}
                                                >
                                                  <Box
                                                    sx={{
                                                      display: "flex",
                                                      alignItems: "center",
                                                      gap: 1,
                                                    }}
                                                  >
                                                    <Box
                                                      sx={{
                                                        width: 14,
                                                        height: 14,
                                                        borderRadius: "50%",
                                                        bgcolor: c.value,
                                                        border:
                                                          "1px solid #ccc",
                                                      }}
                                                    />
                                                    {c.label}
                                                  </Box>
                                                </MenuItem>
                                              ))}
                                            </Select>
                                          )}
                                        />
                                        <FormHelperText>
                                          {(errors.freightVehicleColor
                                            ?.message as string) || " "}
                                        </FormHelperText>
                                      </FormControl>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Box>
                            </>
                          )}
                        </Box>
                      </Grid>
                    </>
                  )}
                </Grid>

                <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleClose}
                    sx={{ py: 1.5, borderRadius: 2, fontWeight: "bold" }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: "bold",
                      boxShadow: (theme) => theme.shadows[4],
                    }}
                  >
                    Actualizar Estado
                  </Button>
                </Box>
              </form>
            </FormProvider>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
