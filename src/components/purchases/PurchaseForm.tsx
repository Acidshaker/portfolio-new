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
  supplyImage?: string;
  supplyId: string;
  unit_cost: string;
  unitId: string;
}

export const PurchaseForm = ({
  open,
  handleClose,
  data,
  isEdit = false,
  isView = false,
}: props) => {
  const [openAddSupplierModal, setOpenAddSupplierModal] = useState(false);
  const [openAddProductModal, setOpenAddProductModal] = useState(false);
  const [listProducts, setListProducts] = useState<Product[]>([]);
  const supplierRef = useRef<AsyncAutocompleteRef>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

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
    folio: string;
    date: Dayjs;
    products: any[];
    supplier: string;
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
      supplier: "",
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

  const openProductModal = (product: any = null) => {
    if (product) {
      setSelectedProduct(product);
    } else {
      setSelectedProduct(null);
    }
    setOpenAddProductModal(true);
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
      (sum, product) => sum + +product.quantity * (+product?.unit_cost || 0),
      0
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
          unitId: product.unit.id,
          supplyId: product.product.id,
          supplyImage: product.supplyImage,
          unit_cost: product?.unit_cost,
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
    const list = listProducts.filter((p) => p.id !== product.id);
    const p = listProducts.find((p) => p.id === product.id);
    list.push({
      id: product.id,
      name: product.product.name ? product.product.name : p.name,
      quantity: product.quantity,
      unit: product.unit.name ? product.unit.name : p.unit,
      unitId: product.unit.id ? product.unit.id : p.unitId,
      supplyId: product.product.id ? product.product.id : p.supplyId,
      supplyImage: product.supplyImage ? product.supplyImage : p.supplyImage,
      unit_cost: product?.unit_cost ? product.unit_cost : p.unit_cost,
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
      toast.error("Agrega al menos un producto a la compra");
      dispatch(hideLoading());
      return;
    }
    const newBody = {
      folio: body.folio,
      date: body.date,
      supplierId: body.supplier.id,
      is_tax: body.isIva || false,
      freight_fee: body.isFreight ? (+body.freightCost).toFixed(2) : "0.00",
      freight_driver: body.isFreight ? body.freightDriver : "",
      status: "pending",
      products: listProducts.map((p) => ({
        id: p.id || null,
        supplyId: p.supplyId,
        quantity: p.quantity,
        name: p.name,
        supplyImage: p.supplyImage,
        unitId: p.unitId,
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
        const res = await purchases.createPurchase(newBody);
        console.log(res.data);
      } else {
        const res = await purchases.updatePurchase(data.id, newBody);
        console.log(res.data);
      }
      console.log(newBody);
      toast.success(`Compra ${isEdit ? "actualizada" : "creada"} con éxito`);
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

  const getSuppliers = (params: {
    search: string;
    offset: number;
    limit: number;
  }) => suppliers.getSuppliers(params);

  const handleOpenAddSupplierModal = () => {
    setOpenAddSupplierModal(true);
  };

  const handleCloseAddSupplierModal = () => {
    setOpenAddSupplierModal(false);
    supplierRef.current?.reload();
  };

  useEffect(() => {
    if (open && (isEdit || isView) && data) {
      console.log(isView);
      reset({
        folio: data.folio,
        date: dayjs(data.date),
        supplier: data.supplier,
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
          supplier: "",
        },
        { keepDirty: false }
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
            {isView
              ? "Ver compra"
              : isEdit
              ? "Editar compra"
              : "Agregar compra"}
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
                      ref={supplierRef}
                      name="supplier"
                      label="Proveedor"
                      disabled={isView}
                      control={control}
                      rules={{
                        required: required("Proveedor"),
                      }}
                      errors={errors}
                      fetchFn={getSuppliers}
                      onAddClick={handleOpenAddSupplierModal}
                    />
                  </Grid>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <FormGroup row sx={{ mt: 1, justifyContent: "flex-end" }}>
                      <FormControlLabel
                        control={<Checkbox disabled={isView} />}
                        label="Agregar iva"
                        checked={watch("isIva")}
                        onChange={(e) =>
                          setValue(
                            "isIva",
                            (e.target as HTMLInputElement).checked
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
                            (e.target as HTMLInputElement).checked
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
                              const hasTwoDecimals = /^\d+(\.\d{1,2})?$/.test(
                                value
                              );

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
                      <Grid size={{ md: 6, xs: 12 }}>
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
                      </Grid>
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
                    height: "260px",
                    overflowX: "auto",
                    overflowY: "hidden",
                    scrollBehavior: "smooth",
                    display: "flex",
                    flexDirection: "row",
                    gap: 2,
                    justifyContent:
                      listProducts.length === 0 ? "center" : "flex-start",
                    alignItems:
                      listProducts.length === 0 ? "center" : "flex-start",
                    borderRadius: 2,
                    border: "1px dashed",
                    borderColor: "divider",
                    p: 2,
                    pr: 4,
                    mb: 3,
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
                          width: {
                            xs: "100%",
                            sm: "48%",
                            md: "30%",
                          },
                          position: "relative",
                          minWidth: 200,
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 2,
                          p: 2,
                          display: "flex",
                          flexDirection: "column",
                          mr: index === listProducts.length - 1 ? 2 : 0,
                        }}
                      >
                        <Tooltip title="Editar producto">
                          <IconButton
                            disabled={isView}
                            size="small"
                            onClick={() => openProductModal(product)}
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              color: "primary.main",
                              ":hover": {
                                color: "white",
                                bgcolor: "primary.main",
                              },
                              width: 28,
                              height: 28,
                              borderRadius: "50%",
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Avatar
                          alt={product.name}
                          src={product.supplyImage || ""}
                          sx={{
                            width: 56,
                            height: 56,
                            mb: 2,
                            alignSelf: "center",
                          }}
                        />
                        <Typography
                          variant="body1"
                          gutterBottom
                          sx={{ alignSelf: "center" }}
                        >
                          {product.name}
                        </Typography>
                        <FormControl
                          fullWidth
                          variant="outlined"
                          sx={{ mt: 1 }}
                        >
                          <InputLabel shrink htmlFor={`quantity-${product.id}`}>
                            Cantidad
                          </InputLabel>
                          <OutlinedInput
                            disabled={isView}
                            id={`quantity-${product.id}`}
                            type="number"
                            value={product.quantity}
                            sx={{
                              "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                                {
                                  display: "none",
                                },
                              "& input[type=number]": {
                                MozAppearance: "textfield",
                              },
                              input: {
                                textAlign: "center",
                              },
                            }}
                            onChange={(e) => {
                              const newQuantity = Math.max(
                                0,
                                Number(e.target.value)
                              );
                              // Actualiza el producto en tu estado
                              const updated = [...listProducts];
                              updated[index].quantity = newQuantity.toString();
                              setListProducts(updated);
                            }}
                            startAdornment={
                              <InputAdornment position="start">
                                <IconButton
                                  size="small"
                                  disabled={+product.quantity <= 1 || isView}
                                  onClick={() => {
                                    const current = parseFloat(
                                      product.quantity || "0"
                                    );
                                    const updatedQuantity = Math.max(
                                      0,
                                      current - 1
                                    ).toFixed(2);

                                    const updated = [...listProducts];
                                    updated[index].quantity = updatedQuantity;
                                    setListProducts(updated);
                                  }}
                                >
                                  <RemoveIcon fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            }
                            endAdornment={
                              <InputAdornment position="end">
                                <Typography variant="body2" sx={{ mr: 1 }}>
                                  {product.unit.name || "kg"}
                                </Typography>
                                <IconButton
                                  size="small"
                                  disabled={isView}
                                  onClick={() => {
                                    const current = parseFloat(
                                      product.quantity || "0"
                                    );
                                    const updatedQuantity = (
                                      current + 1
                                    ).toFixed(2);

                                    const updated = [...listProducts];
                                    updated[index].quantity = updatedQuantity;
                                    setListProducts(updated);
                                  }}
                                >
                                  <AddIcon fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            }
                            inputProps={{
                              min: 0,
                              step: "any",
                              style: { textAlign: "center" },
                            }}
                            label="Cantidad"
                          />
                        </FormControl>

                        <Button
                          disabled={isView}
                          color="secondary"
                          variant="contained"
                          sx={{ ":hover": { bgcolor: "error.dark" } }}
                          fullWidth
                          size="small"
                          onClick={() => deleteProduct(product.id)}
                        >
                          Eliminar
                        </Button>
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
            open={openAddSupplierModal}
            handleClose={handleCloseAddSupplierModal} // Puedes pasar la función handleClose aquí si es necesariotModal}
          />
          <ProductForm
            open={openAddProductModal}
            handleClose={handleCloseProductModal}
            data={selectedProduct}
            update={updateProduct}
            save={addProduct}
          />
        </Box>
      </Fade>
    </Modal>
  );
};
