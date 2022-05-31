import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';
import { addInforme, removeInforme, updateInforme } from './informeSlice';
import stringOperations from '../../../shared-components/stringOperations';

export const getInformes = createAsyncThunk(
  'informesApp/informes/getInformes',
  async (params, { getState }) => {
    const response = await axios.post(
      'rest',
      {
        params: {
          endpoint: 'search_read',
          args: {
            sid: window.localStorage.getItem('session_id'), // session_id
            model: 'sige.informereunion',
            filter: `[('red_id', '=', ${window.localStorage.getItem('red_id')})]`, // red_id
            fields: "['fechareunion', 'tema', 'total_asistentes', 'state', 'tiporeunion_id']",
          },
        },
      },
      {
        withCredentials: true,
      });

    const data = await response.data;

    return { data };
  }
);

const informesAdapter = createEntityAdapter({});

export const selectSearchText = ({ informesApp }) => informesApp.informes.searchText;

export const { selectAll: selectInformes, selectById: selectInformesById } =
  informesAdapter.getSelectors((state) => state.informesApp.informes);

export const selectFilteredInformes = createSelector(
  [selectInformes, selectSearchText],
  (informes, searchText) => {
    if (searchText.length === 0) {
      return informes;
    }
    return FuseUtils.filterArrayByString(informes, searchText);
  }
);

export const selectGroupedFilteredInformes = createSelector(
  [selectFilteredInformes],
  (informes) => {
    return informes
      .sort((a, b) => {
        if (a.fechareunion && b.fechareunion){
          a.fechareunion.localeCompare(b.fechareunion, 'es', { sensitivity: 'base' });
        }
      })
      .reduce((r, e) => {
        // get first letter of name of current element
        const group = e.fechareunion.slice(0, 4);
        // if there is no property in accumulator with this letter create it
        if (!r[group]) r[group] = { group, children: [e] };
        // if there is push current element to children array for that letter
        else r[group].children.push(e);
        // return accumulator
        return r;
      }, {});
  }
);

const informesSlice = createSlice({
  name: 'informesApp/informes',
  initialState: informesAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setInformesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [updateInforme.fulfilled]: informesAdapter.upsertOne,
    [addInforme.fulfilled]: informesAdapter.addOne,
    [removeInforme.fulfilled]: (state, action) => informesAdapter.removeOne(state, action.payload),
    [getInformes.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      informesAdapter.setAll(state, data.result.data); // contactsAdapter.setAll(state, data);
      state.searchText = '';
    },
  },
});

export const { setInformesSearchText } = informesSlice.actions;

export default informesSlice.reducer;
