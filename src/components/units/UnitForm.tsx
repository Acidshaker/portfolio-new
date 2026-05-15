import {
  Backdrop,
  Box,
  Button,
  Container,
  Divider,
  Fade,
  FilledInput,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  required,
  strongPassword,
  isEmail,
  minLength,
  samePassword,
  noTrimSpaces,
  noNegative,
  decimalsLength,
} from "../../utils/validations";
import Textarea from "@mui/joy/Textarea";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../store/uiSlice";
import { units, users } from "../../services/endpoints";
import { toast } from "react-toastify";
import Grid from "@mui/material/Grid";
import { useEffect } from "react";
import { ValidatedTextArea } from "../shared/ValidatedTextarea";

interface props {
  open: boolean;
  handleClose: () => void;
  data?: any;
  isEdit?: boolean;
}

export const UnitForm = ({
  open,
  handleClose,
  data,
  isEdit = false,
}: props) => {
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

  const methods = useForm<{
    name: string;
    equivalent: string;
    description: string;
  }>({
    mode: "onChange",
    defaultValues: {
      equivalent: "1",
    }
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
      if (!isEdit) {
        const res = await units.createUnit(body);
        console.log(res.data);
      } else {
        const res = await units.updateUnit(data.id, body);
        console.log(res.data);
      }
      toast.success(`Unidad ${isEdit ? "actualizada" : "creada"} con éxito`);
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
    if (open && isEdit && data) {
      reset({
        name: data.name,
        equivalent: data.equivalent,
        description: data.description,
      });
    } else if (open && !isEdit) {
      reset(
        {
          name: "",
          equivalent: "",
          description: "",
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
        <Box maxWidth="sm" sx={style}>
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            {isEdit ? "Editar Unidad" : "Crear Unidad"}
          </Typography>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid size={{ md: 12, xs: 12 }}>
                  <TextField
                    label="Nombre"
                    fullWidth
                    {...register("name", {
                      required: required("Nombre"),
                      validate: noTrimSpaces,
                    })}
                    error={!!errors.name}
                    helperText={errors.name?.message || " "}
                  />
                </Grid>
{/* 
                <Grid size={{ md: 6, xs: 12 }}>
                  <TextField
                    label="Equivalencia"
                    type="number"
                    fullWidth
                    {...register("equivalent", {
                      required: required("Equivalencia"),
                      validate: {
                        noNegative,
                        decimals: decimalsLength(2),
                      },
                    })}
                    error={!!errors.equivalent}
                    helperText={errors.equivalent?.message || " "}
                  />
                </Grid> */}
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ md: 12, xs: 12 }}>
                  <ValidatedTextArea
                    name="description"
                    label="Descripción"
                    rules={{
                      required: "La descripción es obligatoria",
                      validate: (value) =>
                        value.trim().length > 0 ||
                        "No se permiten solo espacios",
                    }}
                  />
                </Grid>
              </Grid>

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
