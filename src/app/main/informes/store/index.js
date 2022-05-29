import { combineReducers } from '@reduxjs/toolkit';
import tags from './tagsSlice';
import contacts from './integrantesSlice';
import countries from './countriesSlice';
import contact from './integranteSlice';

const reducer = combineReducers({
  tags,
  countries,
  contacts,
  contact,
});

export default reducer;
