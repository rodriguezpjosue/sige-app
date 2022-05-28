import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';
import { addContact, removeContact, updateContact } from './integranteSlice';

export const getContacts = createAsyncThunk(
  'integrantesApp/integrantes/getContacts',
  async (params, { getState }) => {
    const response = await axios.post(
      'rest',
      {
        params: {
          endpoint: 'search_read',
          args: {
            sid: window.localStorage.getItem('session_id'), // session_id
            model: 'res.partner',
            filter: `[('red_id', '=', ${window.localStorage.getItem('red_id')})]`, // red_id
            fields: "['mobile', 'email']",
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

const contactsAdapter = createEntityAdapter({});

export const selectSearchText = ({ contactsApp }) => contactsApp.contacts.searchText;

export const { selectAll: selectContacts, selectById: selectContactsById } =
  contactsAdapter.getSelectors((state) => state.contactsApp.contacts);

export const selectFilteredContacts = createSelector(
  [selectContacts, selectSearchText],
  (contacts, searchText) => {
    if (searchText.length === 0) {
      return contacts;
    }
    return FuseUtils.filterArrayByString(contacts, searchText);
  }
);

export const selectGroupedFilteredContacts = createSelector(
  [selectFilteredContacts],
  (contacts) => {
    return contacts
      .sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }))
      .reduce((r, e) => {
        // get first letter of name of current element
        const group = e.name[0];
        // if there is no property in accumulator with this letter create it
        if (!r[group]) r[group] = { group, children: [e] };
        // if there is push current element to children array for that letter
        else r[group].children.push(e);
        // return accumulator
        return r;
      }, {});
  }
);

const contactsSlice = createSlice({
  name: 'integrantesApp/integrantes',
  initialState: contactsAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setContactsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [updateContact.fulfilled]: contactsAdapter.upsertOne,
    [addContact.fulfilled]: contactsAdapter.addOne,
    [removeContact.fulfilled]: (state, action) => contactsAdapter.removeOne(state, action.payload),
    [getContacts.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      contactsAdapter.setAll(state, data.result.data); // contactsAdapter.setAll(state, data);
      state.searchText = '';
    },
  },
});

export const { setContactsSearchText } = contactsSlice.actions;

export default contactsSlice.reducer;
