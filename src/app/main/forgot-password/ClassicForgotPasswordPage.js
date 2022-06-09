import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as yup from 'yup';
import _ from '@lodash';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import sigeService from '../../auth/services/sigeService';
 
/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  username: yup.string().required('Debe ingresar su usuario'),
});

const defaultValues = {
  username: '',
};

function ClassicForgotPasswordPage() {
  const { control, formState, handleSubmit, reset, setError } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  function onSubmit({ username }) {
    sigeService
      .requestResetPassword(username)
      .then((data) => {
        console.log(data);
      })
      .catch((_errors) => {
        console.log(_errors);
      });
  }

  return (
    <div className="flex flex-col flex-auto items-center sm:justify-center min-w-0">
      <Paper className="w-full sm:w-auto min-h-full sm:min-h-auto rounded-0 py-32 px-16 sm:p-48 sm:rounded-2xl sm:shadow">
        <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
          <img
            className="w-48"
            src="assets/images/logo/isotipo_emmanuel_small_black.svg"
            alt="logo"
          />

          <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
            ¿Olvidaste tu contraseña?
          </Typography>
          <div className="flex items-baseline mt-2 font-medium">
            <Typography>
              Completa el formulario para restablecer tu contraseña. Enviaremos las instrucciones de
              restablecimiento a tu correo electrónico registrado.
            </Typography>
          </div>

          <form
            name="registerForm"
            noValidate
            className="flex flex-col justify-center w-full mt-32"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Usuario"
                  type="text"
                  error={!!errors.username}
                  helperText={errors?.username?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />

            <Button
              variant="contained"
              color="secondary"
              className=" w-full mt-4"
              aria-label="Register"
              disabled={_.isEmpty(dirtyFields) || !isValid}
              type="submit"
              size="large"
            >
              Restablecer contraseña
            </Button>

            <Typography className="mt-32 text-md font-medium" color="text.secondary">
              <span>Regresar al</span>
              <Link className="ml-4" to="/sign-in">
                inicio
              </Link>
            </Typography>
          </form>
        </div>
      </Paper>
    </div>
  );
}

export default ClassicForgotPasswordPage;
