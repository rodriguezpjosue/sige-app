import Button from '@mui/material/Button';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import Box from '@mui/system/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete from '@mui/material/Autocomplete/Autocomplete';
import Checkbox from '@mui/material/Checkbox/Checkbox';
import DateTimePicker from '@mui/lab/DateTimePicker';
import {
  addInforme,
  getInforme,
  newInforme,
  removeInforme,
  selectInforme,
  updateInforme,
} from '../store/informeSlice';
import { selectIntegrantes } from '../store/integrantesSlice';
import { selectTiposreunion } from '../store/tiposreunionSlice';
import { getInformes } from '../store/informesSlice';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  tema: yup.string().required('Debes colocar el tema de tu reunión RED.'),
});

const InformeForm = (props) => {
  const informe = useSelector(selectInforme);
  const integrantes = useSelector(selectIntegrantes);
  const tiposreunion = useSelector(selectTiposreunion);
  const routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const form = watch();

  useEffect(() => {
    if (routeParams.id === 'new') {
      dispatch(newInforme());
    } else {
      dispatch(getInforme(routeParams.id));
    }
  }, [dispatch, routeParams]);

  useEffect(() => {
    reset({ ...informe });
  }, [informe, reset]);

  function getIntegranteById(id) {
    return integrantes.find((integrante) => integrante.id === id);
  }

  function getTiporeunionById(id) {
    return tiposreunion.find((tiporeunion) => tiporeunion.id === id);
  }

  /**
   * Form Submit
   */
  function onSubmit(data) {
    if (routeParams.id === 'new') {
      dispatch(addInforme(data)).then(({ payload }) => {
        dispatch(getInformes()).then(() => {
          navigate(`/informes/${payload.id}`);
        });
      });
    } else {
      dispatch(updateInforme(data));
    }
  }

  function handleRemoveInforme() {
    dispatch(removeInforme(informe.id)).then(() => {
      navigate('/informes');
    });
  }

  if (_.isEmpty(form) || !informe || !integrantes) {
    return <FuseLoading />;
  }

  return (
    <>
      <div className="relative flex flex-col flex-auto items-center px-24 sm:px-48">
        <Controller
          control={control}
          name="fechareunion"
          render={({ field }) => (
            <DateTimePicker
              {...field}
              className="mt-8 mb-16 w-full"
              clearable
              showTodayButton
              required
              inputFormat="dd/MM/yyyy hh:mm a"
              mask="__/__/____ __:__ _M"
              maxDateTime={new Date()}
              renderInput={(_props) => (
                <TextField
                  {..._props}
                  className="mt-32"
                  id="fechareunion"
                  label="Fecha de reunión"
                  type="datetime"
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FuseSvgIcon size={20}>heroicons-solid:calendar</FuseSvgIcon>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          )}
        />
        <Controller
          control={control}
          name="tema"
          render={({ field }) => (
            <TextField
              className="mt-32"
              {...field}
              label="Tema"
              placeholder="Tema"
              id="tema"
              error={!!errors.tema}
              helperText={errors?.tema?.message}
              variant="outlined"
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>heroicons-solid:user-circle</FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        {tiposreunion.length > 0 && (
          <Controller
            control={control}
            name="tiporeunion_id"
            render={({ field: { onChange, value } }) => (
              <Autocomplete
                id="tiporeunion_id"
                className="mt-32"
                options={tiposreunion}
                disableCloseOnSelect
                getOptionLabel={(option) => (option ? option.name : '')}
                renderOption={(_props, option, { selected }) => (
                  <li {..._props} key={option.id}>
                    <Checkbox style={{ marginRight: 8 }} checked={selected} />
                    {option.name}
                  </li>
                )}
                value={value ? getTiporeunionById(value) : ``}
                onChange={(event, newValue) => {
                  onChange(newValue.id);
                }}
                fullWidth
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    label="Tipo de reunión"
                    placeholder="Tipo de reunión"
                  />
                )}
              />
            )}
          />
        )}

        {integrantes.length > 0 && (
          <Controller
            control={control}
            name="asistentes_ids"
            render={({ field: { onChange, value } }) => (
              <Autocomplete
                multiple
                id="asistentes_ids"
                className="mt-32"
                options={integrantes}
                disableCloseOnSelect
                getOptionLabel={(option) =>
                  option ? `${option.nombre1}${' '}${option.apellido_paterno}` : ''
                }
                renderOption={(_props, option, { selected }) => (
                  <li {..._props} key={option.id}>
                    <Checkbox style={{ marginRight: 8 }} checked={selected} />
                    {option.nombre1} {option.apellido_paterno}
                  </li>
                )}
                value={value ? value.map((id) => _.find(integrantes, { id })) : []}
                onChange={(event, newValue) => {
                  onChange(newValue.map((item) => item.id));
                }}
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} required label="Asistieron" placeholder="Asistieron" />
                )}
              />
            )}
          />
        )}

        <Controller
          control={control}
          name="observaciones"
          render={({ field }) => (
            <TextField
              className="mt-32"
              {...field}
              label="Observaciones"
              placeholder="Observaciones"
              id="observaciones"
              error={!!errors.observaciones}
              helperText={errors?.observaciones?.message}
              variant="outlined"
              fullWidth
              multiline
              minRows={5}
              maxRows={10}
              InputProps={{
                className: 'max-h-min h-min items-start',
                startAdornment: (
                  <InputAdornment className="mt-16" position="start">
                    <FuseSvgIcon size={20}>heroicons-solid:menu-alt-2</FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </div>

      <Box
        className="flex items-center mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t"
        sx={{ backgroundColor: 'background.default' }}
      >
        {routeParams.id !== 'new' && (
          <Button color="error" onClick={handleRemoveInforme}>
            Eliminar
          </Button>
        )}
        <Button className="ml-auto" component={NavLinkAdapter} to={-1}>
          Cancelar
        </Button>
        <Button
          className="ml-8"
          variant="contained"
          color="secondary"
          disabled={_.isEmpty(dirtyFields) || !isValid}
          onClick={handleSubmit(onSubmit)}
        >
          Guardar
        </Button>
      </Box>
    </>
  );
};

export default InformeForm;
