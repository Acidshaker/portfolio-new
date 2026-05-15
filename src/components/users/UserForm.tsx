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
} from "../../utils/validations";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../store/uiSlice";
import { users } from "../../services/endpoints";
import { toast } from "react-toastify";
import Grid from "@mui/material/Grid";
import { useEffect } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useState } from "react";

interface props {
  open: boolean;
  handleClose: () => void;
  data?: any;
  isEdit?: boolean;
}

export const UserForm = ({
  open,
  handleClose,
  data,
  isEdit = false,
}: props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleClickShowConfirm = () => setShowConfirm((show) => !show);

  const handleMouseDownConfirm = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

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

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
  }>({
    mode: "onChange",
  });

  const dispatch = useDispatch();

  const onSubmit = async (body: any) => {
    dispatch(showLoading());
    try {
      if (!isEdit) {
        const res = await users.createUser(body);
        console.log(res.data);
      } else {
        const res = await users.updateUser(data.id, body);
        console.log(res.data);
      }
      toast.success(`Usuario ${isEdit ? "actualizado" : "creado"} con éxito`);
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
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        password: "",
        confirmPassword: "",
        role: data.role || "",
      });
    } else if (open && !isEdit) {
      reset(
        {
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "",
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
            {isEdit ? "Editar Usuario" : "Crear Usuario"}
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid size={{ md: 6, xs: 12 }}>
                <TextField
                  label="Nombre(s)"
                  fullWidth
                  {...register("firstName", {
                    required: required("Nombre"),
                    validate: noTrimSpaces,
                  })}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message || " "}
                />
              </Grid>

              <Grid size={{ md: 6, xs: 12 }}>
                <TextField
                  label="Apellido(s)"
                  fullWidth
                  {...register("lastName", {
                    required: required("Apellido"),
                    validate: noTrimSpaces,
                  })}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message || " "}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Correo electrónico"
                  fullWidth
                  disabled={isEdit}
                  {...register("email", {
                    required: required("Correo electrónico"),
                    validate: (value) => isEmail(value) || noTrimSpaces(value),
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message || " "}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth error={!!errors.role}>
                  <InputLabel id="select-label">Rol</InputLabel>
                  <Controller
                    name="role"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: required("Rol"),
                      validate: noTrimSpaces,
                    }}
                    render={({ field }) => (
                      <Select labelId="select-label" label="Rol" {...field}>
                        <MenuItem value={"admin"}>Admin</MenuItem>
                        <MenuItem value={"user"}>Usuario</MenuItem>
                      </Select>
                    )}
                  />
                  <FormHelperText>{errors.role?.message || " "}</FormHelperText>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  error={!!errors.password}
                >
                  <InputLabel htmlFor="password">Contraseña</InputLabel>
                  <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: required("Contraseña"),
                      validate: noTrimSpaces,
                    }}
                    render={({ field }) => (
                      <OutlinedInput
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              onMouseUp={handleMouseUpPassword}
                              edge="end"
                              sx={{
                                "&:hover": {
                                  backgroundColor: "transparent",
                                  color: "inherit",
                                },
                              }}
                            >
                              {showPassword ? (
                                <VisibilityIcon />
                              ) : (
                                <VisibilityOffIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Password"
                      />
                    )}
                  />
                  <FormHelperText>
                    {errors.password?.message || " "}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  error={!!errors.confirmPassword}
                >
                  <InputLabel htmlFor="confirm">
                    Confirmar contraseña
                  </InputLabel>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: required("Contraseña"),
                      validate: samePassword(watch("password")),
                    }}
                    render={({ field }) => (
                      <OutlinedInput
                        id="confirm"
                        type={showConfirm ? "text" : "password"}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowConfirm}
                              onMouseDown={handleMouseDownConfirm}
                              onMouseUp={handleMouseUpConfirm}
                              edge="end"
                              sx={{
                                "&:hover": {
                                  backgroundColor: "transparent",
                                  color: "inherit",
                                },
                              }}
                            >
                              {showConfirm ? (
                                <VisibilityIcon />
                              ) : (
                                <VisibilityOffIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Password"
                      />
                    )}
                  />
                  <FormHelperText>
                    {errors.confirmPassword?.message || " "}
                  </FormHelperText>
                </FormControl>
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
        </Box>
      </Fade>
    </Modal>
  );
};
