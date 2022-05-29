import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import history from '@history';
import ContactModel from '../model/IntegranteModel';

export const getContact = createAsyncThunk(
  'contactsApp/task/getContact',
  async (id, { dispatch, getState }) => {
    try {
      const response = await axios.post(
        'rest',
        {
          params: {
            endpoint: 'search_read',
            args: {
              sid: window.localStorage.getItem('session_id'), // session_id
              model: 'res.partner',
              filter: `[('id', '=',  ${id})]`, // red_id
              fields: "['mobile', 'email', 'image_small', 'cursos', 'profesion_id', 'lugar_trabajo', 'fecha_nacimiento', 'street']",
            },
          },
        },
        {
          withCredentials: true,
        }
      );

      const data = await response.data;
      console.log(data);
      return data.result.data[0];
    } catch (error) {
      history.push({ pathname: `/integrantes` });

      return null;
    }
  }
);

export const addContact = createAsyncThunk(
  'contactsApp/contacts/addContact',
  async (contact, { dispatch, getState }) => {
    const response = await axios.post('/api/contacts', contact);

    const data = await response.data;

    return data;
  }
);

export const updateContact = createAsyncThunk(
  'contactsApp/contacts/updateContact',
  async (contact, { dispatch, getState }) => {
    const response = await axios.put(`/api/contacts/${contact.id}`, contact);

    const data = await response.data;

    return data;
  }
);

export const removeContact = createAsyncThunk(
  'contactsApp/contacts/removeContact',
  async (id, { dispatch, getState }) => {
    const response = await axios.delete(`/api/contacts/${id}`);

    await response.data;

    return id;
  }
);

export const selectContact = ({ contactsApp }) => contactsApp.contact;

const contactSlice = createSlice({
  name: 'contactsApp/contact',
  initialState: null,
  reducers: {
    newContact: (state, action) => ContactModel(),
    resetContact: () => null,
  },
  extraReducers: {
    [getContact.pending]: (state, action) => null,
    [getContact.fulfilled]: (state, action) => action.payload,
    [updateContact.fulfilled]: (state, action) => action.payload,
    [removeContact.fulfilled]: (state, action) => null,
  },
});

export const { resetContact, newContact } = contactSlice.actions;

export default contactSlice.reducer;
