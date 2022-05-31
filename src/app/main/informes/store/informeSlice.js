import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import history from '@history';
import InformeModel from '../model/InformeModel';

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
      return data.result.data[0];
    } catch (error) {
      history.push({ pathname: `/informes` });
      return null;
    }
  }
);

export const addInforme = createAsyncThunk(
  'informesApp/informes/addInforme',
  async (informe, { dispatch, getState }) => {
    const response = await axios.post('/api/informes', informe);

    const data = await response.data;

    return data;
  }
);

export const updateInforme = createAsyncThunk(
  'informesApp/informes/updateInforme',
  async (informe, { dispatch, getState }) => {
    const response = await axios.put(`/api/informes/${informe.id}`, informe);

    const data = await response.data;

    return data;
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
