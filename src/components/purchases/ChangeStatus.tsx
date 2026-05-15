import {
  Backdrop,
  Box,
  Button,
  Divider,
  Fade,
  Modal,
  TextField,
  Typography,
  Avatar,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormHelperText,
} from "@mui/material";
import {
  required,
  decimalsLength,
  isNumber,
  minValue,
  noTrimSpaces,
  noNegative,
} from "../../utils/validations";
import { useForm, FormProvider, set } from "react-hook-form";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../store/uiSlice";
import {
  clients,
  purchases,
  suppliers,
  supplies,
  units,
} from "../../services/endpoints";
import { toast } from "react-toastify";
import { useAlerts } from "../../utils/alerts";
import Grid from "@mui/material/Grid";
import { useEffect, useRef, useState } from "react";
import AsyncAutocomplete, {
  AsyncAutocompleteRef,
} from "../shared/AsyncAutocomplete";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import "dayjs/locale/es";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { Controller } from "react-hook-form";
import { ClientForm } from "../clients/ClientForm";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { SupplyForm } from "../supplies/SupplyForm";
import { ProductForm } from "../shared/productForm";
import { SupplierForm } from "../suppliers/SupplierForm";

interface props {
  open: boolean;
  handleClose: () => void;
  data: any;
}

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

export const ChangeStatus = ({ open, handleClose, data }: props) => {
  const { confirmationAlert } = useAlerts();

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
    status: string;
  }>({
    mode: "onTouched",
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
  const dispatch = useDispatch();

  const onSubmit = async (body: any) => {
    dispatch(showLoading());
    try {
      const res = await purchases.changeStatus(data.id, body);
      toast.success(`Estado actualizado con éxito`);
      handleClose();
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleCancel = () => {
    reset();
    handleClose();
  };

  useEffect(() => {
    if (open && data) {
      reset({
        status: data.status,
      });
    }
  }, [open, data, reset]);

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
        <Box maxWidth="sm" sx={style}>
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            Cambiar estado de la compra
          </Typography>
          <Box sx={{ overflowY: "auto", flex: 1, pr: 1, overflowX: "hidden" }}>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid size={{ md: 12, xs: 12 }} sx={{ mt: 2 }}>
                    <FormControl fullWidth error={!!errors.status}>
                      <InputLabel id="select-label">Estado</InputLabel>
                      <Controller
                        name="status"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: required("Estado"),
                          validate: noTrimSpaces,
                        }}
                        render={({ field }) => (
                          <Select
                            labelId="select-label"
                            label="Estado"
                            {...field}
                          >
                            <MenuItem disabled value={"pending"}>
                              Pendiente
                            </MenuItem>
                            <MenuItem
                              disabled={
                                data.status === "paid" ||
                                data.status === "complete" ||
                                data.status === "cancelled"
                              }
                              value={"paid"}
                            >
                              Pagado
                            </MenuItem>
                            <MenuItem
                              disabled={
                                data.status === "complete" ||
                                data.status === "cancelled"
                              }
                              value={"complete"}
                            >
                              Completado
                            </MenuItem>
                            <MenuItem
                              disabled={data.status === "cancelled"}
                              value={"cancelled"}
                            >
                              Cancelado
                            </MenuItem>
                          </Select>
                        )}
                      />
                      <FormHelperText>
                        {errors.status?.message || " "}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid size={{ md: 12, xs: 12 }}>
                    <Button
                      color="secondary"
                      variant="contained"
                      fullWidth
                      onClick={handleCancel}
                      sx={{ ":hover": { bgcolor: "secondary.dark" } }}
                    >
                      Cancelar
                    </Button>
                  </Grid>

                  <Grid size={{ md: 12, xs: 12 }}>
                    <Button
                      color="primary"
                      variant="contained"
                      fullWidth
                      type="submit"
                    >
                      Actualizar
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
