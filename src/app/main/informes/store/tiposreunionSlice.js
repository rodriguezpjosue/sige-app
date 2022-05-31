import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getTiposreunion = createAsyncThunk(
  'contactsApp/tags/getTags',
  async (params, { getState }) => {
    const response = await axios.get('/api/contacts/tags');

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
