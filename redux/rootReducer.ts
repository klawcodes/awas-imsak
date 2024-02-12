import { combineReducers } from 'redux';
import surahReducer from './surahReducer';

const rootReducer = combineReducers({
  surah: surahReducer,
});

export default rootReducer;
