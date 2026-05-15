import {
  Backdrop,
  Box,
  Button,
  Divider,
  Fade,
  Modal,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import {
  required,
  isEmail,
  postalCode,
  noTrimSpaces,
} from "../../utils/validations";
import { useForm, FormProvider } from "react-hook-form";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../store/uiSlice";
import { suppliers } from "../../services/endpoints";
import { toast } from "react-toastify";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";

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

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => {
  return (
    <Fade in={value === index} timeout={300} unmountOnExit>
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        style={{ minHeight: "412px" }}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    </Fade>
  );
};

export const SupplierForm = ({
  open,
  handleClose,
  data,
  isEdit = false,
}: props) => {
  const [value, setValue] = useState(0);

  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "calc(100% - 16px)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const methods = useForm<{
    name: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    colony: string;
    zip: string;
    extNumber: string;
    intNumber: string;
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
  } = methods;

  const dispatch = useDispatch();

  const onSubmit = async (body: any) => {
    dispatch(showLoading());
    try {
      const newData = {
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: {
          street: body.street,
          city: body.city,
          state: body.state,
          colony: body.colony,
          zipCode: body.zip,
          extNumber: body.extNumber,
          intNumber: body.intNumber,
          country: "México",
        },
      };
      if (!isEdit) {
        const res = await suppliers.createSupplier(newData);
        console.log(res.data);
      } else {
        const res = await suppliers.updateSupplier(data.id, newData);
        console.log(res.data);
      }
      toast.success(`Proveedor ${isEdit ? "actualizado" : "creado"} con éxito`);
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
    setValue(0);
    if (open && isEdit && data) {
      reset({
        name: data.name,
        email: data.email,
        phone: data.phone,
        street: data.address.street,
        city: data.address.city,
        state: data.address.state,
        colony: data.address.colony,
        zip: data.address.zipCode,
        extNumber: data.address.extNumber,
        intNumber: data.address.intNumber,
      });
    } else if (open && !isEdit) {
      reset(
        {
          name: "",
          email: "",
          phone: "",
          street: "",
          city: "",
          state: "",
          colony: "",
          zip: "",
          extNumber: "",
          intNumber: "",
        },
        { keepDirty: false }
      );
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
            {isEdit ? "Editar Proveedor" : "Crear Proveedor"}
          </Typography>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs
              value={value}
              onChange={handleChangeTab}
              aria-label="tabs"
              variant="fullWidth"
            >
              <Tab label="Información general" {...a11yProps(0)} />
              <Tab label="Dirección" {...a11yProps(1)} />
              {/* <Tab label="Datos de facturación" disabled {...a11yProps(2)} /> */}
            </Tabs>
          </Box>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TabPanel value={value} index={0}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Nombre o razón social"
                      fullWidth
                      {...register("name", {
                        required: required("Nombre o razón social"),
                        validate: noTrimSpaces,
                      })}
                      error={!!errors.name}
                      helperText={errors.name?.message || " "}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Correo electrónico"
                      fullWidth
                      {...register("email", {
                        required: required("Correo electrónico"),
                        validate: isEmail,
                      })}
                      error={!!errors.email}
                      helperText={errors.email?.message || " "}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Teléfono"
                      fullWidth
                      {...register("phone", {
                        required: required("Teléfono"),
                      })}
                      error={!!errors.phone}
                      helperText={errors.phone?.message || " "}
                    />
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value={value} index={1}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Calle"
                      fullWidth
                      {...register("street", {
                        required: required("Calle"),
                      })}
                      error={!!errors.street}
                      helperText={errors.street?.message || " "}
                    />
                  </Grid>

                  <Grid size={{ md: 6, xs: 12 }}>
                    <TextField
                      label="Número exterior"
                      fullWidth
                      {...register("extNumber", {
                        required: required("Número exterior"),
                      })}
                      error={!!errors.extNumber}
                      helperText={errors.extNumber?.message || " "}
                    />
                  </Grid>

                  <Grid size={{ md: 6, xs: 12 }}>
                    <TextField
                      label="Número interior (opcional)"
                      fullWidth
                      {...register("intNumber")}
                      error={!!errors.intNumber}
                      helperText={errors.intNumber?.message || " "}
                    />
                  </Grid>

                  <Grid size={{ md: 6, xs: 12 }}>
                    <TextField
                      label="Colonia"
                      fullWidth
                      {...register("colony", {
                        required: required("Colonia"),
                      })}
                      error={!!errors.colony}
                      helperText={errors.colony?.message || " "}
                    />
                  </Grid>

                  <Grid size={{ md: 6, xs: 12 }}>
                    <TextField
                      label="Ciudad"
                      fullWidth
                      {...register("city", {
                        required: required("Ciudad"),
                      })}
                      error={!!errors.city}
                      helperText={errors.city?.message || " "}
                    />
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <TextField
                      label="Estado"
                      fullWidth
                      {...register("state", {
                        required: required("Estado"),
                      })}
                      error={!!errors.state}
                      helperText={errors.state?.message || " "}
                    />
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <TextField
                      label="Código postal"
                      fullWidth
                      {...register("zip", {
                        required: required("Código postal"),
                        validate: postalCode,
                      })}
                      error={!!errors.zip}
                      helperText={errors.zip?.message || " "}
                    />
                  </Grid>
                </Grid>
              </TabPanel>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid size={{ md: 6, xs: 12 }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={handleCancel}
                  >
                    Cancelar
                  </Button>
                </Grid>

                <Grid size={{ md: 6, xs: 12 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    type="submit"
                  >
                    Guardar
                  </Button>
                </Grid>
              </Grid>
            </form>
          </FormProvider>
        </Box>
      </Fade>
    </Modal>
  );
};
