import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import sigeServiceConfig from 'src/app/auth/services/sigeService/sigeServiceConfig';

export const getTiposreunion = createAsyncThunk(
  'aperturasApp/tiposreunion/getTiposreunion',
  async (params, { getState }) => {
    const response = await axios.post(
      sigeServiceConfig.uniqueEndpoint,
      {
        params: {
          endpoint: 'search_read',
          args: {
            sid: window.localStorage.getItem('session_id'),
            model: 'sige.informereunion.tipo',
            filter: `[('id', '!=',  None)]`,
            fields: "['id', 'name']",
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
  tiposreunionAdapter.getSelectors((state) => state.aperturasApp.tiposreunion);

const tiposreunionSlice = createSlice({
  name: 'aperturasApp/tiposreunion',
  initialState: tiposreunionAdapter.getInitialState([]),
  reducers: {},
  extraReducers: {
    [getTiposreunion.fulfilled]: tiposreunionAdapter.setAll,
  },
});

export default tiposreunionSlice.reducer;
