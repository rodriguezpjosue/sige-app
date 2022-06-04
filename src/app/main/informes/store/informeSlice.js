import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import history from '@history';
import InformeModel from '../model/InformeModel';
import StringOperations from '../../../shared-components/stringOperations';

export const getInforme = createAsyncThunk(
  'informesApp/task/getInforme',
  async (id, { dispatch, getState }) => {
    try {
      const response = await axios.post(
        'rest',
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
      history.push({ pathname: `/informes` });
      return null;
    }
  }
);

export const addInforme = createAsyncThunk(
  'informesApp/informes/addInforme',
  async (informe, { dispatch, getState }) => {
    informe.asistentes_ids = [[6, 0, informe.asistentes_ids]];
    if (informe.observaciones) {
      informe.observaciones = [[0, 0, { observaciones: informe.observaciones }]];
    }
    informe.fechareunion = informe.fechareunion.toISOString().replace('T', ' ').replace('Z', '');
    const response = await axios.post(
      'rest',
      {
        params: {
          endpoint: 'create',
          args: {
            sid: window.localStorage.getItem('session_id'), // session_id
            model: 'sige.informereunion',
            vals: informe,
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
    return data.result.data;
  }
);

export const updateInforme = createAsyncThunk(
  'informesApp/informes/updateInforme',
  async (informe, { dispatch, getState }) => {
    informe.asistentes_ids = [[6, 0, informe.asistentes_ids]];
    if (informe.observaciones) {
      informe.observaciones = [[0, 0, { observaciones: informe.observaciones }]];
    }
    if (informe.fechareunions) {
      informe.fechareunion = informe.fechareunion.toISOString().replace('T', ' ').replace('Z', '');
    }
    const response = await axios.post(
      'rest',
      {
        params: {
          endpoint: 'write',
          args: {
            sid: window.localStorage.getItem('session_id'), // session_id
            model: 'sige.informereunion',
            id: informe.id,
            vals: informe,
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
    const informeEdited = data.result.data;
    const asistentesIds = informeEdited.asistentes_ids;
    informeEdited.asistentes_ids = asistentesIds.map((asistente) => asistente.id);
    const fechareunion = StringOperations.getLocaleDateTime(informeEdited.fechareunion);
    informeEdited.fechareunion = StringOperations.setDateTimeString(fechareunion);
    return informeEdited;
  }
);

export const procesoOficinaInforme = createAsyncThunk(
  'informesApp/informes/procesoOficinaInforme',
  async (informeId, { dispatch, getState }) => {
    const response = await axios.post(
      'rest',
      {
        params: {
          endpoint: 'write',
          args: {
            sid: window.localStorage.getItem('session_id'), // session_id
            model: 'sige.informereunion',
            id: informeId,
            vals: {
              state: 'pendiente',
            },
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
    const informeEdited = data.result.data;
    const asistentesIds = informeEdited.asistentes_ids;
    informeEdited.asistentes_ids = asistentesIds.map((asistente) => asistente.id);
    const fechareunion = StringOperations.getLocaleDateTime(informeEdited.fechareunion);
    informeEdited.fechareunion = StringOperations.setDateTimeString(fechareunion);
    return informeEdited;
  }
);

export const removeInforme = createAsyncThunk(
  'contactsApp/informes/removeInforme',
  async (id, { dispatch, getState }) => {
    const response = await axios.delete(`/api/informes/${id}`);

    await response.data;

    return id;
  }
);

export const selectInforme = ({ informesApp }) => informesApp.informe;

const informeSlice = createSlice({
  name: 'informesApp/informe',
  initialState: null,
  reducers: {
    newInforme: (state, action) => InformeModel(),
    resetInforme: () => null,
  },
  extraReducers: {
    [getInforme.pending]: (state, action) => null,
    [getInforme.fulfilled]: (state, action) => action.payload,
    [updateInforme.fulfilled]: (state, action) => action.payload,
    [removeInforme.fulfilled]: (state, action) => null,
  },
});

export const { resetInforme, newInforme } = informeSlice.actions;

export default informeSlice.reducer;
