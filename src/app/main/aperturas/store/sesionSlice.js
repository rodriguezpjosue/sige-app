import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import history from '@history';
import { showMessage } from 'app/store/fuse/messageSlice';
import StringOperations from '../../../shared-components/stringOperations';
import sigeServiceConfig from '../../../auth/services/sigeService/sigeServiceConfig';

export const getSesion = createAsyncThunk(
  'aperturasApp/task/getSesion',
  async (id, { dispatch, getState }) => {
    try {
      const response = await axios.post(
        sigeServiceConfig.uniqueEndpoint,
        {
          params: {
            endpoint: 'search_read',
            args: {
              sid: window.localStorage.getItem('session_id'), // session_id
              model: 'sige.apertura.sesiones',
              filter: `[('id', '=',  ${id})]`, // red_id
              fields:
                "['id', 'name', 'tema_programacion', 'state', 'fecha', 'sesion_recuperacion', 'alumno_asistencia']",
            },
          },
        },
        {
          withCredentials: true,
        }
      );
      const data = await response.data;
      const sesion = data.result.data[0];
      return sesion;
    } catch (error) {
      history.push({ pathname: `/aperturas/sesiones/${id}` });
      return null;
    }
  }
);

export const getSesiones = createAsyncThunk(
  'aperturasApp/task/getSesiones',
  async (ids, { dispatch, getState }) => {
    const filtro = [['id', 'in', ids]];
    try {
      const response = await axios.post(
        sigeServiceConfig.uniqueEndpoint,
        {
          params: {
            endpoint: 'search_read',
            args: {
              sid: window.localStorage.getItem('session_id'),
              model: 'sige.apertura.sesiones',
              filter: JSON.stringify(filtro),
              fields:
                "['id', 'name', 'tema_programacion', 'state', 'fecha', 'sesion_recuperacion', 'alumno_asistencia']",
            },
          },
        },
        {
          withCredentials: true,
        }
      );

      const data = await response.data;
      const sesiones = data.result.data;
      return sesiones;
    } catch (error) {
      history.push({ pathname: `/aperturas` });
      return null;
    }
  }
);

export const cerrarSesion = createAsyncThunk(
  'aperturasApp/aperturas/cerrarSesion',
  async (sesionId, { dispatch, getState }) => {
    const response = await axios.post(
      sigeServiceConfig.uniqueEndpoint,
      {
        params: {
          endpoint: 'exec_workflow',
          args: {
            sid: window.localStorage.getItem('session_id'), // session_id
            model: 'sige.apertura.sesiones',
            id: sesionId,
            method: 'boton_cerrar_sesion_apertura',
            fields:
              "['id', 'name', 'tema_programacion', 'state', 'fecha', 'sesion_recuperacion', 'alumno_asistencia', 'apertura_id']",
          },
        },
      },
      {
        withCredentials: true,
      }
    );

    const data = await response.data;
    let mensaje = ``;
    let variante = ``;
    const sesion = data.result.data[0];
    if (data.result.status === 200) {
      mensaje = 'La sesión ha sido cerrada. No será posible modificar la asistencia.';
      variante = 'success';
    } else {
      mensaje = 'Hubo un error al procesar el cierre de sesión.';
      variante = 'error';
    }
    dispatch(showMessage({ message: mensaje, variant: variante }));
    // history.push({ pathname: `/aperturas/${sesion.apertura_id}` });
    history.push({ pathname: `/aperturas` });
    return sesion;
  }
);

export const selectSesion = ({ aperturasApp }) => aperturasApp.sesion;

const sesionSlice = createSlice({
  name: 'aperturasApp/sesion',
  initialState: null,
  reducers: {
    resetSesion: () => null,
  },
  extraReducers: {
    [getSesion.pending]: (state, action) => null,
    [getSesion.fulfilled]: (state, action) => action.payload,
    [cerrarSesion.pending]: (state, action) => null,
    [cerrarSesion.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetSesion } = sesionSlice.actions;

export default sesionSlice.reducer;
