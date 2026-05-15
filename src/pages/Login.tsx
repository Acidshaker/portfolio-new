// src/pages/LoginPage.tsx
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography,
  Grid,
  Paper,
  Switch,
  Divider,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@mui/material";
import curvedImage from "../assets/curved14.jpg";
import { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { hideLoading, showLoading } from "@/store/uiSlice";
import { setToken, setUser } from "@/store/sessionsSlice";
import { jwtDecode } from "jwt-decode";
import { auth } from "@/services/endpoints";
import { useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  required,
  strongPassword,
  isEmail,
  minLength,
  noTrimSpaces,
} from "@/utils/validations";

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<{
    email: string;
    password: string;
  }>({
    mode: "onChange",
  });
  const [showPassword, setShowPassword] = useState(false);

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

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (body: any) => {
    dispatch(showLoading());
    const data = {
      email: body.email,
      password: body.password,
    };
    try {
      const res = await auth.login(data);
      const token = res.data.accessToken
      const decoded: TokenPayload = jwtDecode(token);
      console.log(decoded)
      dispatch(setToken(token));
      dispatch(setUser(decoded));
      toast.success(`Bienvenido ${decoded?.email}`);
      navigate("/sales");
      reset();
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    dispatch(setToken(null));
  }, []);

  return (
    <Paper sx={{ height: "100vh", width: "100%" }}>
      <Grid container sx={{ height: "100vh", width: "100%" }}>
        {/* Formulario */}
        <Grid size={{ md: 6, xs: 12 }}>
          <Container
            maxWidth="sm"
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Bienvenido
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Inicia sesión con tu cuenta
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Correo electrónico"
                    fullWidth
                    {...register("email", {
                      required: required("Correo electrónico"),
                      validate: (value) =>
                        isEmail(value) || noTrimSpaces(value),
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message || " "}
                  />
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
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid size={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    type="submit"
                  >
                    Iniciar sesión
                  </Button>
                  </Grid>
                </Grid>
            </form>
          </Container>
        </Grid>

        {/* Imagen decorativa */}
        <Grid size={{ md: 6, xs: false }}>
          <Paper
            sx={{
              height: "100%",
              width: "100%",
              backgroundImage: `url(${curvedImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              clipPath: "polygon(30% 0%, 100% 0%, 100% 100%, 0% 100%)",
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};
