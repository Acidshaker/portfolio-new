import BaseTable from "@/components/shared/Table";
import { UserForm } from "@/components/users/UserForm";
import { users } from "@/services/endpoints";
import { RootState } from "@/store";
import { hideLoading, showLoading } from "@/store/uiSlice";
import { isEmail, noTrimSpaces, required } from "@/utils/validations";
import { Box, Button, Divider, Fade, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export const Account = () => {
  const [currentUser, setCurrentUser] = useState<Record<string, any> | null>(null);
  const user = useSelector((state: RootState) => state.session.user);

  const methods = useForm<{
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      password: string;
      confirm_password: string;
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

    const getData = async () => {
      dispatch(showLoading());
      try {
        const res = await users.getUserById(user.id)
        setCurrentUser({
          first_name: res.data.firstName,
          last_name: res.data.lastName,
          email: res.data.email,
        })
        reset({
          first_name: res.data.firstName,
          last_name: res.data.lastName,
          email: res.data.email,});
        console.log(res.data)
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(hideLoading());
      }
    };

      const onSubmit = async (body: any) => {
        dispatch(showLoading());
        const data = {
          firstName: body.first_name,
          lastName: body.last_name,
        }
        try {
          const res = await users.updateUser( user.id, data);
          console.log(res.data)
          toast.success('Datos actualizados con exito');
          await getData();
        } catch (err) {
          console.log(err);
        } finally {
          dispatch(hideLoading());
        }
      };

      const handleCancel = () => {
        reset({
          first_name: currentUser?.first_name || "",
          last_name: currentUser?.last_name || "",
          email: currentUser?.email || "",
        });
      }

      useEffect(() => {
        getData();
      }, []);

  return (
    <Box sx={{ height: "100%" }}>
      <Fade in={true}>
        <Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            Mi cuenta
          </Typography>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Nombre(s)"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    {...register("first_name", {
                      required: required("Nombre(s)"),
                      validate: noTrimSpaces,
                    })}
                    error={!!errors.first_name}
                    helperText={errors.first_name?.message || " "}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Apellidos"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    {...register("last_name", {
                      required: required("Apellidos"),
                      validate: noTrimSpaces,
                    })}
                    error={!!errors.last_name}
                    helperText={errors.last_name?.message || " "}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Correo electrónico"
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    {...register("email", {
                      required: required("Correo electrónico"),
                      validate: isEmail,
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message || " "}
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
    </Box>
  );
};
