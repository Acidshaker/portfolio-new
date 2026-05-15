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
  Paper,
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
  sales,
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { SupplyForm } from "../supplies/SupplyForm";
import { ProductForm } from "../shared/productForm";
import { SupplierForm } from "../suppliers/SupplierForm";

interface props {
  open: boolean;
  handleClose: () => void;
  data?: any;
  isEdit?: boolean;
  isView?: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

interface Product {
  id: number;
  name: string;
  quantity: string;
  unit: any;
  supply: any;
  supplier: any;
  supplyImage?: string;
  supplyId: string;
  supplierId: string;
  unit_price: string;
  unit_cost: string;
  unitId: string;
}

export const SaleForm = ({
  open,
  handleClose,
  data,
  isEdit = false,
  isView = false,
}: props) => {
  const [openAddClientModal, setOpenAddClientModal] = useState(false);
  const [openAddProductModal, setOpenAddProductModal] = useState(false);
  const [isViewProduct, setIsViewProduct] = useState(false);
  const [listProducts, setListProducts] = useState<Product[]>([]);
  const clientRef = useRef<AsyncAutocompleteRef>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const { confirmationAlert } = useAlerts();

  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "calc(100% - 16px)",
    maxHeight: "95vh",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
  };

  const methods = useForm<{
    folio: string;
    date: Dayjs;
    products: any[] | null | undefined;
    client: string;
    isIva: boolean;
    isFreight: boolean;
    freightCost: string;
    freightDriver: string;
  }>({
    mode: "onTouched",
    defaultValues: {
      folio: "",
      date: dayjs(),
      products: null,
      client: "",
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

  const dispatch = useDispatch();

  const openProductModal = (product: any = null, isView: boolean = false) => {
    setIsViewProduct(isView);
    setSelectedProduct(product ? { ...product } : null);
    setOpenAddProductModal(true);
  };

  const handleUpdateQty = (index: number, newQty: number) => {
    const updated = [...listProducts];
    updated[index].quantity = newQty.toString();
    setListProducts(updated);
  };

  const handleCloseProductModal = () => setOpenAddProductModal(false);

  const getTotal = ({
    listProducts,
    isFreight,
    freightCost,
    isIVA,
  }: {
    listProducts: Product[];
    isFreight: boolean;
    freightCost: string;
    isIVA: boolean;
  }) => {
    const subtotal = listProducts.reduce(
      (sum, product) => sum + +product.quantity * (+product?.unit_price || 0),
      0,
    );

    const withFreight = isFreight ? subtotal + (+freightCost || 0) : subtotal;
    const withIVA = isIVA ? withFreight * 1.16 : withFreight;

    return withIVA.toFixed(2);
  };

  const addProduct = (product: any) => {
    const exists = listProducts.find((p) => p.supplyId === product.product.id);
    if (!exists) {
      setListProducts([
        ...listProducts,
        {
          id: listProducts.length + 1,
          name: product.product.name,
          quantity: product.quantity || 1,
          unit: product.unit,
          supplier: product.supplier,
          supply: product.product,
          unitId: product.unit.id,
          supplyId: product.product.id,
          supplyImage: product.supplyImage,
          unit_cost: product?.unit_cost,
          supplierId: product.supplier.id,
          unit_price: product?.unit_price,
        },
      ]);
      setValue("products", null);
      toast.success("Producto agregado");
    } else {
      toast.error("El producto ya está en la lista");
    }
  };

  const updateProduct = (product: any) => {
    console.log(product.id);
    const list = listProducts.filter((p: any) => p.id !== product.id);
    const p = listProducts.find((p: any) => p.id === product.id);
    if (!p) return;
    list.push({
      id: product.id,
      name: product?.product?.name ? product.product.name : p.name,
      quantity: product.quantity,
      unit: product.unit.name ? product.unit.name : p.unit,
      supplier: product.supplier.name ? product.supplier.name : p.supplier,
      supply: product.product.name ? product.product.name : p.supply,
      unitId: product.unit.id ? product.unit.id : p.unitId,
      supplyId: product.product.id ? product.product.id : p.supplyId,
      supplyImage: product.supplyImage ? product.supplyImage : p.supplyImage,
      supplierId: product.supplierId ? product.supplierId : p.supplierId,
      unit_cost: product?.unit_cost ? product.unit_cost : p.unit_cost,
      unit_price: product?.unit_price ? product.unit_price : p.unit_price,
    });
    setListProducts(list.sort((a, b) => a.id - b.id));
  };

  const deleteProduct = (productId: number) => {
    const foo = async () => {
      setListProducts(listProducts.filter((p) => p.id !== productId));
      toast.success("Producto eliminado");
    };

    confirmationAlert(foo, "¿Estás seguro de eliminar este producto?");
  };

  const onSubmit = async (body: any) => {
    dispatch(showLoading());
    if (listProducts.length === 0) {
      toast.error("Agrega al menos un producto a la venta");
      dispatch(hideLoading());
      return;
    }
    const newBody = {
      folio: body.folio,
      date: body.date,
      clientId: body.client.id,
      is_tax: body.isIva || false,
      freight_fee: body.isFreight ? (+body.freightCost).toFixed(2) : "0.00",
      freight_driver: body.isFreight ? body.freightDriver : "",
      status: "quoted",
      products: listProducts.map((p) => ({
        id: p.id || null,
        supplyId: p.supplyId,
        quantity: p.quantity,
        name: p.name,
        supplyImage: p.supplyImage,
        supplierId: p.supplier.id,
        unitId: p.unitId,
        unit_price: p.unit_price,
        unit_cost: p.unit_cost,
      })),
      total: getTotal({
        listProducts,
        isFreight: body.isFreight,
        freightCost: body.freightCost,
        isIVA: body.isIva,
      }),
    };
    try {
      if (!isEdit) {
        const res = await sales.createSale(newBody);
        console.log(res.data);
      } else {
        const res = await sales.updateSale(data.id, newBody);
        console.log(res.data);
      }
      console.log(newBody);
      toast.success(`Venta ${isEdit ? "actualizada" : "creada"} con éxito`);
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

  const getClients = (params: {
    search: string;
    offset: number;
    limit: number;
  }) => clients.getClients(params);

  const handleOpenAddClientModal = () => {
    setOpenAddClientModal(true);
  };

  const handleCloseAddClientModal = () => {
    setOpenAddClientModal(false);
    clientRef.current?.reload();
  };

  const handleQuantity = (index: number, delta: number) => {
    const updated = [...listProducts];
    // Convertimos a número, si no es válido usamos 0
    const currentQty = parseFloat(updated[index].quantity) || 0;

    // Calculamos la nueva cantidad
    const newQty = currentQty + delta;

    if (newQty > 0) {
      // .toFixed(2) para manejar hasta 2 decimales y lo volvemos a pasar a string
      // parseFloat de nuevo para quitar ceros a la derecha innecesarios (ej: 1.10 -> 1.1)
      updated[index].quantity = parseFloat(newQty.toFixed(2)).toString();
      setListProducts(updated);
    }
  };

  useEffect(() => {
    if (open && (isEdit || isView) && data) {
      reset({
        folio: data.folio,
        date: dayjs(data.date),
        client: data.client,
        isIva: data.is_tax,
        freightCost: data.freight_fee,
        isFreight: data.freight_fee > 0,
        freightDriver: data.freight_driver,
      });
      setListProducts(data.products);
    } else if (open && !isEdit) {
      reset(
        {
          folio: "",
          date: dayjs(),
          client: "",
        },
        { keepDirty: false },
      );
      setListProducts([]);
    }
  }, [open, isEdit, isView, data, reset]);

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
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            {isView ? "Ver venta" : isEdit ? "Editar venta" : "Agregar venta"}
          </Typography>
          <Box sx={{ overflowY: "auto", flex: 1, pr: 1, overflowX: "hidden" }}>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid size={{ md: 6, xs: 12 }} sx={{ mt: 2 }}>
                    <TextField
                      disabled={isView}
                      label="Folio"
                      {...register("folio", {
                        required: required("Folio"),
                        validate: noTrimSpaces,
                        maxLength: {
                          value: 20,
                          message: "Máximo 20 caracteres",
                        },
                      })}
                      error={!!errors.folio}
                      helperText={errors.folio?.message || " "}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ md: 6, xs: 12 }} sx={{ mt: 2 }}>
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
                            disabled={isView}
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
                  <Grid size={{ md: 6, xs: 12 }}>
                    <AsyncAutocomplete
                      ref={clientRef}
                      name="client"
                      label="Cliente"
                      disabled={isView}
                      control={control}
                      rules={{
                        required: required("Cliente"),
                      }}
                      errors={errors}
                      fetchFn={getClients}
                      onAddClick={handleOpenAddClientModal}
                    />
                  </Grid>
                  {isView ? (
                    // VISTA DE SOLO LECTURA
                    <Grid
                      size={{ md: 6, xs: 12 }}
                      sx={{ textAlign: "right", mt: 1 }}
                    >
                      <Typography variant="body1">
                        <strong>IVA:</strong>{" "}
                        {watch("isIva") ? "Incluido" : "No incluido"}
                      </Typography>
                      {watch("isFreight") && (
                        <Typography variant="body1">
                          <strong>Flete:</strong> ${watch("freightCost")}
                        </Typography>
                      )}
                    </Grid>
                  ) : (
                    <>
                      <Grid size={{ md: 6, xs: 12 }}>
                        <FormGroup
                          row
                          sx={{ mt: 1, justifyContent: "flex-end" }}
                        >
                          <FormControlLabel
                            control={<Checkbox disabled={isView} />}
                            label="Agregar iva"
                            checked={watch("isIva")}
                            onChange={(e) =>
                              setValue(
                                "isIva",
                                (e.target as HTMLInputElement).checked,
                              )
                            }
                          />
                          <FormControlLabel
                            control={<Checkbox disabled={isView} />}
                            label="Agregar flete"
                            checked={watch("isFreight")}
                            onChange={(e) =>
                              setValue(
                                "isFreight",
                                (e.target as HTMLInputElement).checked,
                              )
                            }
                          />
                        </FormGroup>
                      </Grid>
                      {watch("isFreight") && (
                        <>
                          <Grid
                            size={{ md: 6, xs: 12 }}
                            sx={{
                              ml: "auto",
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            <TextField
                              label="Costo del flete"
                              variant="standard"
                              disabled={isView}
                              size="small"
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
                              {...register("freightCost", {
                                required: required("Costo del flete"),
                                validate: (value) => {
                                  const number = parseFloat(value);
                                  const isPositive = number > 0;
                                  const hasTwoDecimals =
                                    /^\d+(\.\d{1,2})?$/.test(value);

                                  if (!isPositive)
                                    return "El costo debe ser mayor a cero";
                                  if (!hasTwoDecimals)
                                    return "Máximo dos decimales permitidos";
                                  return true;
                                },
                              })}
                              error={!!errors.freightCost}
                              helperText={errors.freightCost?.message || " "}
                              slotProps={{
                                input: {
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      $
                                    </InputAdornment>
                                  ),
                                },
                              }}
                            />
                          </Grid>
                          {/* <Grid size={{ md: 6, xs: 12 }}>
                        <TextField
                          label="Chofer"
                          variant="standard"
                          disabled={isView}
                          fullWidth
                          size="small"
                          {...register("freightDriver", {
                            required: required("Chofer"),
                            validate: noTrimSpaces,
                          })}
                          error={!!errors.freightDriver}
                          helperText={errors.freightDriver?.message || " "}
                        />
                      </Grid> */}
                        </>
                      )}
                    </>
                  )}
                </Grid>
                <Divider sx={{ my: 2 }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="button" gutterBottom sx={{ mb: 3 }}>
                    Carrito{" "}
                    <ShoppingCartIcon
                      fontSize="small"
                      sx={{ ml: 1, mb: -0.5 }}
                    />
                    {listProducts.length ? `(${listProducts.length})` : ""}
                  </Typography>
                  <Typography variant="button" gutterBottom sx={{ mb: 3 }}>
                    Total: ${" "}
                    {getTotal({
                      listProducts,
                      isFreight: watch("isFreight"),
                      freightCost: watch("freightCost"),
                      isIVA: watch("isIva"),
                    })}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    // 1. Aumentamos la altura para dar espacio al contenido y al efecto hover
                    minHeight: "300px",
                    height: "auto",
                    overflowX: "auto",
                    // 2. IMPORTANTE: Cambiamos hidden por visible o damos padding arriba/abajo
                    // para que la sombra y el movimiento no se corten
                    overflowY: "visible",
                    scrollBehavior: "smooth",
                    display: "flex",
                    flexDirection: "row",
                    gap: 2,
                    justifyContent:
                      listProducts.length === 0 ? "center" : "flex-start",
                    alignItems: "stretch",
                    borderRadius: 2,
                    border: "1px dashed",
                    borderColor: "divider",
                    p: 3,
                    pt: 4,
                    pb: 4,
                    mb: 3,
                    "&::-webkit-scrollbar": { height: 8 },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "divider",
                      borderRadius: 2,
                    },
                  }}
                >
                  {listProducts.length > 0 && !isView && (
                    <Box
                      sx={{
                        display: "flex",
                        alignSelf: "center",
                        mb: 2,
                      }}
                    >
                      <Tooltip title="Agregar producto">
                        <IconButton
                          color="primary"
                          onClick={openProductModal}
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            bgcolor: "primary.main",
                            color: "white",
                            ":hover": {
                              bgcolor: "primary.dark",
                            },
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                  {listProducts.length === 0 ? (
                    <Fade in unmountOnExit>
                      <Box sx={{ textAlign: "center", mt: 4 }}>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          No hay productos en el carrito
                        </Typography>

                        <Tooltip title="Agregar producto">
                          <IconButton
                            color="primary"
                            onClick={openProductModal}
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: "50%",
                              bgcolor: "primary.main",
                              color: "white",
                              ":hover": {
                                bgcolor: "primary.dark",
                              },
                            }}
                          >
                            <AddIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Fade>
                  ) : (
                    listProducts.map((product, index) => (
                      <Box
                        key={product.id}
                        sx={{
                          flexShrink: 0,
                          width: { xs: "240px", md: "280px" },
                          position: "relative",
                          bgcolor: "background.paper",
                          backgroundImage:
                            "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))",
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 3,
                          p: 2,
                          // display: "flex",
                          // flexDirection: "column",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          height: "100%",
                          gap: 1.5,
                          transition: "all 0.2s ease-in-out",
                          "&:hover": {
                            borderColor: "primary.main",
                            transform: "translateY(-4px)",
                            boxShadow: (theme) =>
                              `0 4px 20px ${theme.palette.mode === "dark" ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.1)"}`,
                          },
                          mr: 2,
                        }}
                      >
                        {!isView ? (
                          <Tooltip title="Editar">
                            <IconButton
                              disabled={isView}
                              size="small"
                              onClick={() => openProductModal(product)}
                              sx={{
                                position: "absolute",
                                top: 8,
                                left: 8,
                                color: "text.secondary",
                                "&:hover": { color: "primary.main" },
                              }}
                            >
                              <EditIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Visualizar">
                            <IconButton
                              size="small"
                              onClick={() => openProductModal(product, true)}
                              sx={{
                                position: "absolute",
                                top: 8,
                                left: 8,
                                color: "text.secondary",
                                "&:hover": { color: "primary.success" },
                              }}
                            >
                              <VisibilityIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                        )}

                        {!isView && (
                          <Tooltip title="Eliminar">
                            <IconButton
                              disabled={isView}
                              size="small"
                              onClick={() => deleteProduct(product.id)}
                              sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                color: "text.secondary",
                                "&:hover": { color: "error.main" },
                              }}
                            >
                              <DeleteOutlineIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                          </Tooltip>
                        )}

                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            mt: 1,
                          }}
                        >
                          <Avatar
                            alt={product.name}
                            src={product.supplyImage || ""}
                            sx={{
                              width: 64,
                              height: 64,
                              mb: 1,
                              border: "2px solid",
                              borderColor: "primary.main",
                              bgcolor: "background.default",
                            }}
                          />
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              textAlign: "center",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              height: "2.5em",
                              lineHeight: 1.2,
                            }}
                          >
                            {product.name}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              bgcolor: (theme) =>
                                theme.palette.mode === "dark"
                                  ? "rgba(255,255,255,0.03)"
                                  : "rgba(0,0,0,0.02)",
                              border: "1px solid",
                              borderColor: "divider",
                              borderRadius: 2,
                              px: 1,
                              transition: "all 0.2s",
                              "&:focus-within": {
                                borderColor: "primary.main",
                                bgcolor: "background.paper",
                                boxShadow: (theme) =>
                                  `0 0 0 2px ${theme.palette.primary.main}20`,
                              },
                            }}
                          >
                            <input
                              type="text"
                              disabled={isView}
                              value={product.quantity}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (/^\d*\.?\d*$/.test(val)) {
                                  const updated = [...listProducts];
                                  updated[index].quantity = val;
                                  setListProducts(updated);
                                }
                              }}
                              style={{
                                width: "60px", // Ancho fijo para que no baile el diseño
                                border: "none",
                                background: "transparent",
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: "1rem",
                                color: "inherit",
                                outline: "none",
                                padding: "4px 0",
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: "medium",
                                color: "text.secondary",
                                borderLeft: "1px solid",
                                borderColor: "divider",
                                pl: 1,
                                ml: 0.5,
                              }}
                            >
                              {product.unit?.name || "kg"}
                            </Typography>
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              opacity: 0.5,
                              fontSize: "0.65rem",
                              textTransform: "uppercase",
                            }}
                          >
                            Cantidad
                          </Typography>
                        </Box>

                        <Typography
                          variant="caption"
                          sx={{
                            textAlign: "center",
                            color: "primary.main",
                            fontWeight: "bold",
                          }}
                        >
                          Subtotal: $
                          {(
                            parseFloat(product.unit_price || "0") *
                            parseFloat(product.quantity || "0")
                          ).toFixed(2)}
                        </Typography>
                      </Box>
                    ))
                  )}
                </Box>
                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid size={{ md: 6, xs: 12 }}>
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

                  <Grid size={{ md: 6, xs: 12 }}>
                    <Button
                      color="primary"
                      variant="contained"
                      fullWidth
                      type="submit"
                    >
                      {isView ? "Aceptar" : "Guardar"}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </FormProvider>
          </Box>
          <SupplierForm
            open={openAddClientModal}
            handleClose={handleCloseAddClientModal}
          />
          <ProductForm
            type="sale"
            open={openAddProductModal}
            handleClose={handleCloseProductModal}
            data={selectedProduct}
            update={updateProduct}
            isView={isViewProduct}
            save={addProduct}
          />
        </Box>
      </Fade>
    </Modal>
  );
};
