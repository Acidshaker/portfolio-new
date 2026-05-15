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
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  Paper,
  Stack,
  Collapse,
  Chip,
} from "@mui/material";
import { required } from "../../utils/validations";
import { useForm, FormProvider, Controller } from "react-hook-form";
import Grid from "@mui/material/Grid";
import { useEffect, useRef, useState, useMemo } from "react";
import AsyncAutocomplete, { AsyncAutocompleteRef } from "./AsyncAutocomplete";
import { UnitForm } from "../units/UnitForm";
import RemoveIcon from "@mui/icons-material/Remove";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AddIcon from "@mui/icons-material/Add";

import { suppliers, supplies, units } from "@/services/endpoints";
import { SupplyForm } from "../supplies/SupplyForm";
import { SupplierForm } from "../suppliers/SupplierForm";

interface props {
  open: boolean;
  handleClose: () => void;
  data?: any;
  save: (data: any) => void;
  update?: (data: any) => void;
  isView?: boolean;
  type: "sale" | "purchase"; // Nueva prop para distinguir el modo
}

export const ProductForm = ({
  open,
  handleClose,
  data,
  save,
  update,
  isView,
  type,
}: props) => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openAddSupplyModal, setOpenAddSupplyModal] = useState(false);
  const [openAddSupplierModal, setOpenAddSupplierModal] = useState(false);
  const unitRef = useRef<AsyncAutocompleteRef>(null);
  const supplierRef = useRef<AsyncAutocompleteRef>(null);
  const supplyRef = useRef<AsyncAutocompleteRef>(null);

  const methods = useForm({
    mode: "onTouched",
    defaultValues: {
      product: "",
      costPrice: "",
      salePrice: "",
      unit: "",
      supplier: "",
      quantity: "1",
    },
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

  const watchedCost = watch("costPrice");
  const watchedPrice = watch("salePrice");
  const watchedQty = watch("quantity");

const balance = useMemo(() => {
  const cost = parseFloat(watchedCost) || 0;
  const price = parseFloat(watchedPrice) || 0;
  // Usamos el watchedQty directamente
  const qty = parseFloat(watchedQty) || 0;

  const totalProfit = (price - cost) * qty;
  const margin = price > 0 ? ((price - cost) / price) * 100 : 0;

  return { totalProfit, margin, show: price > 0 && cost > 0 && qty > 0 };
}, [watchedCost, watchedPrice, watchedQty]);

  const onSubmit = async (body: any) => {
    const newBody: any = {
      product: body.product,
      supplyImage: body.product?.image,
      unit_cost: body.costPrice,
      unit_price: type === "sale" ? body.salePrice : null,
      unit: body.unit,
      quantity: body.quantity,
      supplier: body.supplier,
    };


    if (data?.id) {
      update?.({ id: data.id, ...newBody });
    } else {
      save(newBody);
    }
    handleClose();
  };

  const closeModal = () => {
    setOpenAddModal(false);
    setOpenAddSupplyModal(false);
    setOpenAddSupplierModal(false);
  };

  useEffect(() => {
    if (open) {
      if (data) {
        reset({
          product: data.supply || data.product,
          costPrice: data.unit_cost,
          salePrice: data.unit_price || "",
          supplier: data.supplier || "",
          unit: data.unit,
          quantity: data.quantity?.toString() || "1",
        });
      } else {
        reset({
          product: "",
          costPrice: "",
          salePrice: "",
          supplier: "",
          unit: "",
          quantity: "1",
        });
      }
    }
  }, [open, data, reset]);

  useEffect(() => {
    if (openAddModal) {
      unitRef.current?.reload();
    }
    if (openAddSupplyModal) {
      supplyRef.current?.reload();
    }
    if (openAddSupplierModal) {
      supplierRef.current?.reload();
    }
  }, [openAddModal, openAddSupplyModal, openAddSupplierModal]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "95%", sm: 500 },
            bgcolor: "background.paper",
            borderRadius: 4,
            boxShadow: 24,
            p: 0,
            overflow: "hidden",
            outline: "none",
          }}
        >
          {/* Header con estilo de App Bar */}
          <Box sx={{ p: 3, bgcolor: "primary.main", color: "white" }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              {type === "sale" ? <PointOfSaleIcon /> : <ShoppingBagIcon />}
              <Typography variant="h6" fontWeight="bold">
                {isView ? "Visualizar" : data?.id ? "Editar" : "Nuevo"} producto
                de {type === "sale" ? "Venta" : "Compra"}
              </Typography>
            </Stack>
          </Box>

          <Box sx={{ p: 4 }}>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                  {/* Sección 1: Selección */}
                  <Box>
                    <Typography
                      variant="overline"
                      color="text.secondary"
                      fontWeight="bold"
                    >
                      Definición
                    </Typography>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                      <AsyncAutocomplete
                        disabled={isView}
                        ref={supplyRef}
                        name="product"
                        label="Producto"
                        control={control}
                        rules={{ required: required("Producto") }}
                        errors={errors}
                        fetchFn={(params) => supplies.getSupplies(params)}
                        onAddClick={() => setOpenAddSupplyModal(true)}
                      />
                      <AsyncAutocomplete
                        disabled={isView}
                        ref={unitRef}
                        name="unit"
                        label="Unidad de Medida"
                        control={control}
                        rules={{ required: required("Unidad") }}
                        errors={errors}
                        fetchFn={(params) => units.getUnits(params)}
                        onAddClick={() => setOpenAddModal(true)}
                      />
                      <AsyncAutocomplete
                        disabled={isView}
                        ref={supplierRef}
                        name="supplier"
                        label="Proveedor"
                        control={control}
                        rules={{ required: required("Proveedor") }}
                        errors={errors}
                        fetchFn={(params) => suppliers.getSuppliers(params)}
                        onAddClick={() => setOpenAddSupplierModal(true)}
                      />
                    </Stack>
                  </Box>

                  {/* Sección 2: Valores Numéricos */}
                  <Box>
                    <Typography
                      variant="overline"
                      color="text.secondary"
                      fontWeight="bold"
                    >
                      Valores
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid size={type === "sale" ? 6 : 12}>
                        <TextField
                          disabled={isView}
                          label="Precio de Compra"
                          fullWidth
                          {...register("costPrice")}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      {type === "sale" && (
                        <Grid size={6}>
                          <TextField
                            disabled={isView}
                            label="Precio Venta"
                            fullWidth
                            {...register("salePrice")}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                      )}
                    </Grid>
                  </Box>

                  {/* Sección de Balance con Animación */}
                  <Collapse in={balance.show}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor:
                          balance.totalProfit >= 0
                            ? "success.lighter"
                            : "error.lighter",
                        borderLeft: `4px solid`,
                        borderColor:
                          balance.totalProfit >= 0
                            ? "success.main"
                            : "error.main",
                        borderRadius: 2,
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          {balance.totalProfit >= 0 ? (
                            <TrendingUpIcon color="success" />
                          ) : (
                            <TrendingDownIcon color="error" />
                          )}
                          <Box>
                            <Typography
                              variant="caption"
                              display="block"
                              color="text.secondary"
                            >
                              Ganancia Total
                            </Typography>
                            <Typography
                              variant="h6"
                              fontWeight="bold"
                              color={
                                balance.totalProfit >= 0
                                  ? "success.dark"
                                  : "error.dark"
                              }
                            >
                              ${balance.totalProfit.toLocaleString()}
                            </Typography>
                          </Box>
                        </Stack>
                        <Box textAlign="right">
                          <Typography
                            variant="caption"
                            display="block"
                            color="text.secondary"
                          >
                            Margen
                          </Typography>
                          <Chip
                            label={`${balance.margin.toFixed(1)}%`}
                            size="small"
                            color={
                              balance.totalProfit >= 0 ? "success" : "error"
                            }
                            variant="filled"
                          />
                        </Box>
                      </Stack>
                    </Paper>
                  </Collapse>

                  {/* Cantidad con diseño más limpio */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1,
                      bgcolor: "action.hover",
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2" fontWeight="medium">
                      Cantidad:
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <IconButton
                        disabled={isView}
                        size="small"
                        onClick={() => {
                          const val = parseFloat(watch("quantity")) || 0;
                          setValue("quantity", String(Math.max(0, val - 1)));
                        }}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>

                      {/* Input editable para decimales */}
                      <TextField
                        disabled={isView}
                        variant="standard"
                        {...register("quantity")}
                        InputProps={{
                          disableUnderline: true,
                          sx: {
                            width: 60,
                            "& input": {
                              textAlign: "center",
                              fontWeight: "bold",
                              p: 0,
                            },
                          },
                        }}
                        // Permitir solo números y un punto decimal
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
                            setValue("quantity", val);
                          }
                        }}
                      />

                      <IconButton
                        disabled={isView}
                        size="small"
                        onClick={() => {
                          const val = parseFloat(watch("quantity")) || 0;
                          setValue("quantity", String(val + 1));
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>

                  <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                    {!isView ? (
                      <>
                        <Button
                          variant="text"
                          color="inherit"
                          fullWidth
                          onClick={handleClose}
                        >
                          Cancelar
                        </Button>
                        <Button
                          variant="contained"
                          size="large"
                          fullWidth
                          type="submit"
                          disableElevation
                        >
                          {data?.id ? "Guardar Cambios" : "Confirmar"}
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={handleClose}
                        disableElevation
                      >
                        Aceptar
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </form>
            </FormProvider>
          </Box>
        <SupplierForm
          open={openAddSupplierModal}
          handleClose={closeModal}
          data={null}
          isEdit={false}
        />
        <UnitForm
          open={openAddModal}
          handleClose={closeModal}
          data={null}
          isEdit={false}
        />
        <SupplyForm
          open={openAddSupplyModal}
          handleClose={closeModal}
          data={null}
          isEdit={false}
        />
        </Box>
      </Fade>
    </Modal>
  );
};
