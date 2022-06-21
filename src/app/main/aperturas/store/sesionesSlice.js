import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import sigeServiceConfig from 'src/app/auth/services/sigeService/sigeServiceConfig';

export const getSesiones = createAsyncThunk(
  'aperturasApp/sesiones/getSesiones',
  async (aperturaId, { getState }) => {
    if (aperturaId) {
      const response = await axios.post(
        sigeServiceConfig.uniqueEndpoint,
        {
          params: {
            endpoint: 'search_read',
            args: {
              sid: window.localStorage.getItem('session_id'),
              model: 'sige.apertura.sesiones',
              filter: `[('apertura_id', '=',  ${aperturaId})]`,
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

      return data.result.data;
    }
    return [];
  }
);

const sesionesAdapter = createEntityAdapter({});

export const { selectAll: selectSesiones, selectById: selectTagsById } =
  sesionesAdapter.getSelectors((state) => state.aperturasApp.sesiones);

const sesionesSlice = createSlice({
  name: 'aperturasApp/sesiones',
  initialState: sesionesAdapter.getInitialState([]),
  reducers: {},
  extraReducers: {
    [getSesiones.fulfilled]: sesionesAdapter.setAll,
  },
});

export default sesionesSlice.reducer;
