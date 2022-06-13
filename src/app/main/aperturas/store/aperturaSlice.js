import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import history from '@history';
import { showMessage } from 'app/store/fuse/messageSlice';
import AperturaModel from '../model/aperturaModel';
import StringOperations from '../../../shared-components/stringOperations';
import sigeServiceConfig from '../../../auth/services/sigeService/sigeServiceConfig';

export const getApertura = createAsyncThunk(
  'aperturasApp/task/getApertura',
  async (id, { dispatch, getState }) => {
    try {
      const response = await axios.post(
        sigeServiceConfig.uniqueEndpoint,
        {
          params: {
            endpoint: 'search_read',
            args: {
              sid: window.localStorage.getItem('session_id'), // session_id
              model: 'sige.informereunion',
              filter: `[('id', '=',  ${id})]`, // red_id
              fields:
                "['fechareunion', 'tema', 'total_asistentes', 'asistentes_ids', 'state', 'tiporeunion_id']",
            },
          },
        },
        {
          withCredentials: true,
        }
      );

      const data = await response.data;
      const informe = data.result.data[0];
      const asistentesIds = informe.asistentes_ids;
      informe.asistentes_ids = asistentesIds.map((asistente) => asistente.id);
      informe.tiporeunion_id = informe.tiporeunion_id[0].id;
      const fechareunion = new Date(informe.fechareunion);
      informe.fechareunion = new Date(
        Date.UTC(
          fechareunion.getFullYear(),
          fechareunion.getMonth(),
          fechareunion.getDate(),
          fechareunion.getHours(),
          fechareunion.getMinutes(),
          fechareunion.getSeconds()
        )
      );
      return informe;
    } catch (error) {
      history.push({ pathname: `/aperturas` });
      return null;
    }
  }
);

export const addApertura = createAsyncThunk(
  'aperturasApp/aperturas/addApertura',
  async (apertura, { dispatch, getState }) => {
    apertura.asistentes_ids = [[6, 0, apertura.asistentes_ids]];
    if (apertura.observaciones) {
      apertura.observaciones = [[0, 0, { observaciones: apertura.observaciones }]];
    }
    apertura.fechareunion = apertura.fechareunion.toISOString().replace('T', ' ').replace('Z', '');
    const response = await axios.post(
      sigeServiceConfig.uniqueEndpoint,
      {
        params: {
          endpoint: 'create',
          args: {
            sid: window.localStorage.getItem('session_id'), // session_id
            model: 'sige.informereunion',
            vals: apertura,
            fields:
              "['fechareunion', 'tema', 'total_asistentes', 'asistentes_ids', 'state', 'tiporeunion_id']",
          },
        },
      },
      {
        withCredentials: true,
      }
    );

    const informeData = await response.data;
    let mensaje = ``;
    let variante = ``;
    if (informeData.result.status === 200) {
      mensaje = 'Informe creado satisfactoriamente.';
      variante = 'success';
    } else {
      mensaje = 'Hubo un error al crear el informe.';
      variante = 'error';
    }
    dispatch(showMessage({ message: mensaje, variant: variante }));
    informeData.result.data.tiporeunion_id = informeData.result.data.tiporeunion_id[0].id;
    return informeData.result.data;
  }
);

export const updateApertura = createAsyncThunk(
  'aperturasApp/aperturas/updateApertura',
  async (apertura, { dispatch, getState }) => {
    apertura.asistentes_ids = [[6, 0, apertura.asistentes_ids]];
    if (apertura.observaciones) {
      apertura.observaciones = [[0, 0, { observaciones: apertura.observaciones }]];
    }
    if (apertura.fechareunions) {
      apertura.fechareunion = apertura.fechareunion
        .toISOString()
        .replace('T', ' ')
        .replace('Z', '');
    }
    const response = await axios.post(
      sigeServiceConfig.uniqueEndpoint,
      {
        params: {
          endpoint: 'write',
          args: {
            sid: window.localStorage.getItem('session_id'), // session_id
            model: 'sige.informereunion',
            id: apertura.id,
            vals: apertura,
            fields:
              "['fechareunion', 'tema', 'total_asistentes', 'asistentes_ids', 'state', 'tiporeunion_id']",
          },
        },
      },
      {
        withCredentials: true,
      }
    );

    const informeData = await response.data;
    const { status, data } = informeData.result;
    let mensaje = ``;
    let variante = ``;
    if (status === 200) {
      mensaje = 'Informe actualizado satisfactoriamente.';
      variante = 'success';
    } else {
      mensaje = 'Hubo un error al actualizar el informe.';
      variante = 'error';
    }
    const asistentesIds = data.asistentes_ids;
    data.asistentes_ids = asistentesIds.map((asistente) => asistente.id);
    const fechareunion = StringOperations.getLocaleDateTime(data.fechareunion);
    data.fechareunion = StringOperations.setDateTimeString(fechareunion);
    data.tiporeunion_id = data.tiporeunion_id[0].id;
    dispatch(showMessage({ message: mensaje, variant: variante }));
    return data;
  }
);

export const procesoOficinaApertura = createAsyncThunk(
  'aperturasApp/aperturas/procesoOficinaApertura',
  async (aperturaId, { dispatch, getState }) => {
    const response = await axios.post(
      sigeServiceConfig.uniqueEndpoint,
      {
        params: {
          endpoint: 'exec_workflow',
          args: {
            sid: window.localStorage.getItem('session_id'), // session_id
            model: 'sige.informereunion',
            id: aperturaId,
            method: 'boton_pendiente',
            fields:
              "['fechareunion', 'tema', 'total_asistentes', 'asistentes_ids', 'state', 'tiporeunion_id']",
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
    if (data.result.status === 200) {
      mensaje = 'El informe ha sido enviado para su proceso en la Oficina de Redes.';
      variante = 'success';
    } else {
      mensaje = 'Hubo un error al procesar el informe.';
      variante = 'error';
    }
    dispatch(showMessage({ message: mensaje, variant: variante }));
    const informeEdited = data.result.data;
    const asistentesIds = informeEdited.asistentes_ids;
    informeEdited.asistentes_ids = asistentesIds.map((asistente) => asistente.id);
    const fechareunion = StringOperations.getLocaleDateTime(informeEdited.fechareunion);
    informeEdited.fechareunion = StringOperations.setDateTimeString(fechareunion);
    return informeEdited;
  }
);

export const removeApertura = createAsyncThunk(
  'aperturasApp/aperturas/removeApertura',
  async (aperturaId, { dispatch, getState }) => {
    const response = await axios.post(
      sigeServiceConfig.uniqueEndpoint,
      {
        params: {
          endpoint: 'unlink',
          args: {
            sid: window.localStorage.getItem('session_id'), // session_id
            model: 'sige.informereunion',
            id: aperturaId,
          },
        },
      },
      {
        withCredentials: true,
      }
    );

    await response.data;

    return aperturaId;
  }
);

export const selectApertura = ({ aperturasApp }) => aperturasApp.apertura;

const aperturaSlice = createSlice({
  name: 'aperturasApp/apertura',
  initialState: null,
  reducers: {
    newApertura: (state, action) => AperturaModel(),
    resetApertura: () => null,
  },
  extraReducers: {
    [getApertura.pending]: (state, action) => null,
    [getApertura.fulfilled]: (state, action) => action.payload,
    [updateApertura.fulfilled]: (state, action) => action.payload,
    [removeApertura.fulfilled]: (state, action) => null,
  },
});

export const { resetApertura, newApertura } = aperturaSlice.actions;

export default aperturaSlice.reducer;
