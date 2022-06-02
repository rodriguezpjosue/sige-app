import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getTiposreunion = createAsyncThunk(
  'informesApp/tiposreunion/getTiposreunion',
  async (params, { getState }) => {
    const response = await axios.post(
      'rest',
      {
        params: {
          endpoint: 'search_read',
          args: {
            sid: window.localStorage.getItem('session_id'),
            model: 'sige.informereunion.tipo',
            filter: `[('id', '!=',  None)]`,
            fields: "[id', 'name']",
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

const tiposreunionAdapter = createEntityAdapter({});

export const { selectAll: selectTiposreunion, selectById: selectTagsById } =
  tiposreunionAdapter.getSelectors((state) => state.informesApp.tiposreunion);

const tiposreunionSlice = createSlice({
  name: 'informesApp/tiposreunion',
  initialState: tiposreunionAdapter.getInitialState([]),
  reducers: {},
  extraReducers: {
    [getTiposreunion.fulfilled]: tiposreunionAdapter.setAll,
  },
});

export default tiposreunionSlice.reducer;
