import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';
import sigeServiceConfig from 'src/app/auth/services/sigeService/sigeServiceConfig';
import { addApertura, removeApertura, updateApertura } from './aperturaSlice';

export const getAperturas = createAsyncThunk(
  'aperturasApp/aperturas/getAperturas',
  async (params, { getState }) => {
    const response = await axios.post(
      sigeServiceConfig.uniqueEndpoint,
      {
        params: {
          endpoint: 'search_read',
          args: {
            sid: window.localStorage.getItem('session_id'), // session_id
            model: 'sige.apertura',
            filter: `['|',('docente_id', '=', ${window.localStorage.getItem(
              'partner_id'
            )}),('tutores_ids', 'in', [${window.localStorage.getItem('partner_id')}])]`, // red_id
            fields:
              "['fecha_inicio', 'curso_id', 'matriculados', 'state', 'programa_id', 'modalidad']",
          },
        },
      },
      {
        withCredentials: true,
      }
    );

    const data = await response.data;

    return { data };
  }
);

const aperturasAdapter = createEntityAdapter({});

export const selectSearchText = ({ aperturasApp }) => aperturasApp.aperturas.searchText;

export const { selectAll: selectAperturas, selectById: selectAperturasById } =
  aperturasAdapter.getSelectors((state) => state.aperturasApp.aperturas);

export const selectFilteredAperturas = createSelector(
  [selectAperturas, selectSearchText],
  (aperturas, searchText) => {
    if (searchText.length === 0) {
      return aperturas;
    }
    return FuseUtils.filterArrayByString(aperturas, searchText);
  }
);

export const selectGroupedFilteredAperturas = createSelector(
  [selectFilteredAperturas],
  (aperturas) => {
    return (
      aperturas
        // eslint-disable-next-line array-callback-return
        .sort((a, b) => {
          if (a.fecha_inicio && b.fecha_inicio) {
            a.fecha_inicio.localeCompare(b.fecha_inicio, 'es', { sensitivity: 'base' });
          }
        })
        .reduce((r, e) => {
          // get first letter of name of current element
          const group = e.fecha_inicio.slice(0, 4);
          // if there is no property in accumulator with this letter create it
          if (!r[group]) r[group] = { group, children: [e] };
          // if there is push current element to children array for that letter
          else r[group].children.push(e);
          // return accumulator
          return r;
        }, {})
    );
  }
);

const aperturasSlice = createSlice({
  name: 'aperturasApp/aperturas',
  initialState: aperturasAdapter.getInitialState({
    searchText: '',
  }), 
  reducers: {
    setAperturasSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [updateApertura.fulfilled]: aperturasAdapter.upsertOne,
    [addApertura.fulfilled]: aperturasAdapter.addOne,
    [removeApertura.fulfilled]: (state, action) =>
      aperturasAdapter.removeOne(state, action.payload),
    [getAperturas.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      aperturasAdapter.setAll(state, data.result.data); // contactsAdapter.setAll(state, data);
      state.searchText = '';
    },
  },
});

export const { setAperturasSearchText } = aperturasSlice.actions;

export default aperturasSlice.reducer;
