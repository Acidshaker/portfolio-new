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
} from "@mui/material";
import {
  required,
  decimalsLength,
  isNumber,
  minValue,
  noTrimSpaces,
} from "../../utils/validations";
import { useForm, FormProvider } from "react-hook-form";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../store/uiSlice";
import { suppliers, supplies, units } from "../../services/endpoints";
import { toast } from "react-toastify";
import Grid from "@mui/material/Grid";
import { useEffect, useRef, useState } from "react";
import { DragAndDrop } from "../shared/DragAndDrop";
import { BarcodeGenerator } from "../shared/BarcodeGeneratos";
import { FileUpload } from "../shared/FileUpload";
import AsyncAutocomplete, {
  AsyncAutocompleteRef,
} from "../shared/AsyncAutocomplete";
import { UnitForm } from "../units/UnitForm";

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

export const SupplyForm = ({
  open,
  handleClose,
  data,
  isEdit = false,
}: props) => {
  const [productImage, setProductImage] = useState<File | null>(null);
  const [imageDeleted, setImageDeleted] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const unitRef = useRef<AsyncAutocompleteRef>(null);

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
    name: string;
    // cost: string;
    // price: string;
    // stockAlert: boolean;
    // minStock: string;
    sku: string;
    productImage: File | string;
    unit: string;
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
      const newBody = new FormData();
      newBody.append("name", body.name);
      newBody.append("sku", body.sku);
      newBody.append("unitId", body.unit.id);
      if (productImage instanceof File) {
        newBody.append("image", productImage);
      }
      if (!isEdit) {
        const res = await supplies.createSupply(newBody);
        console.log(res.data);
      } else {
        if (imageDeleted) {
          newBody.append("image", ""); // Indicar que la imagen fue eliminada
          newBody.append("replace_image", "true");
        } else if (productImage !== data?.image) {
          newBody.append("replace_image", "true");
        }
        const res = await supplies.updateSupply(data.id, newBody);
        console.log(res.data);
      }
      toast.success(
        `Materia prima ${isEdit ? "actualizada" : "creada"} con éxito`
      );
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

  const getUnits = (params: {
    search: string;
    offset: number;
    limit: number;
  }) => units.getUnits(params);

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    unitRef.current?.reload();
  };

  // const handleAdjustMinStock = (type: "sumar" | "restar") => {
  //   const current = watch("minStock") || 0;
  //   const newValue =
  //     type === "sumar" ? +current + 1 : Math.max(0, +current - 1);
  //   setValue("minStock", String(newValue));
  // };

  useEffect(() => {
    if (open && isEdit && data) {
      reset({
        name: data.name,
        // cost: data.cost,
        // price: data.price,
        // stockAlert: data.stockAlert,
        // minStock: data.minStock,
        sku: data.sku,
        productImage: data.image,
        unit: data.unit,
      });
    } else if (open && !isEdit) {
      reset(
        {
          name: "",
          // cost: "",
          // price: "",
          // stockAlert: false,
          // minStock: "",
          sku: "",
          productImage: "",
          unit: "",
        },
        { keepDirty: false }
      );
      setProductImage(null);
    }
  }, [open, isEdit, data, reset]);

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
            {isEdit ? "Editar producto" : "Crear nuevo producto"}
          </Typography>
          <Box sx={{ overflowY: "auto", flex: 1, pr: 1, overflowX: "hidden" }}>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  {/* Columna izquierda: inputs */}
                  <Grid size={{ md: 7, xs: 12 }}>
                    <Stack spacing={1}>
                      <TextField
                        label="SKU"
                        fullWidth
                        {...register("sku", {
                          required: required("SKU"),
                          validate: noTrimSpaces,
                        })}
                        error={!!errors.sku}
                        helperText={errors.sku?.message || " "}
                      />

                      <TextField
                        label="Nombre"
                        fullWidth
                        {...register("name", {
                          required: required("nombre"),
                          validate: noTrimSpaces,
                        })}
                        error={!!errors.name}
                        helperText={errors.name?.message || " "}
                      />

                      <AsyncAutocomplete
                        ref={unitRef}
                        name="unit"
                        label="Unidad"
                        control={control}
                        rules={{
                          required: required("Unidad"),
                        }}
                        errors={errors}
                        fetchFn={getUnits}
                        onAddClick={handleOpenAddModal}
                      />
                    </Stack>
                  </Grid>

                  {/* Columna derecha: imagen */}
                  <Grid size={{ md: 5, xs: 12 }}>
                    <FileUpload
                      value={productImage}
                      onChange={(file) => {
                        setProductImage(file);
                        if (file) setImageDeleted(false); // imagen nueva
                      }}
                      onDelete={() => {
                        setProductImage(null);
                        setImageDeleted(true); // imagen eliminada
                      }}
                      initialUrl={data?.image}
                    />
                  </Grid>
                </Grid>

                {/* <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <TextField
                      label="Costo de compra"
                      fullWidth
                      {...register("cost", {
                        required: required("Costo de compra"),
                        validate: {
                          isNumber: isNumber,
                          minValue: minValue(1),
                          decimalsLength: decimalsLength(2),
                        },
                      })}
                      error={!!errors.cost}
                      helperText={errors.cost?.message || " "}
                    />
                  </Grid>

                  <Grid size={{ md: 6, xs: 12 }}>
                    <TextField
                      label="Precio de venta"
                      fullWidth
                      {...register("price", {
                        required: required("Precio de venta"),
                        validate: {
                          isNumber: isNumber,
                          minValue: minValue(1),
                          decimalsLength: decimalsLength(2),
                        },
                      })}
                      error={!!errors.price}
                      helperText={errors.price?.message || " "}
                    />
                  </Grid>

                  <FormControlLabel
                    control={<Checkbox {...register("stockAlert")} />}
                    label="Alerta de stock"
                  />
                </Grid>

                {watch("stockAlert") && (
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid size={{ md: 6, xs: 12 }}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Button
                          variant="outlined"
                          onClick={() => handleAdjustMinStock("restar")}
                          sx={{ minWidth: 40, px: 0 }}
                        >
                          -
                        </Button>

                        <TextField
                          label="Cantidad"
                          type="number"
                          focused
                      {...register("minStock", {
                        validate: {
                          isNumber: isNumber,
                          minValue: minValue(1),
                          decimalsLength: decimalsLength(2),
                        },
                      })}
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
                          fullWidth
                        />

                        <Button
                          variant="outlined"
                          onClick={() => handleAdjustMinStock("sumar")}
                          sx={{ minWidth: 40, px: 0 }}
                        >
                          +
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                )} */}

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <Button color="secondary" fullWidth onClick={handleCancel}>
                      Cancelar
                    </Button>
                  </Grid>

                  <Grid size={{ md: 6, xs: 12 }}>
                    <Button color="primary" fullWidth type="submit">
                      Guardar
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </FormProvider>
          </Box>
          <UnitForm open={openAddModal} handleClose={handleCloseAddModal} />
        </Box>
      </Fade>
    </Modal>
  );
};
