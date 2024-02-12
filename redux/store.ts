// store.ts
import { configureStore } from '@reduxjs/toolkit';
import surahReducer from './surahReducer';

const store = configureStore({
  reducer: {
    surah: surahReducer,
  },
});

export default store;
