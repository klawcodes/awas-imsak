import { FETCH_SURAH_DATA_SUCCESS } from './surahActions';

const initialState = {
  surahDataList: [],
};

const surahReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case FETCH_SURAH_DATA_SUCCESS:
      return {
        ...state,
        surahDataList: action.payload,
      };
    default:
      return state;
  }
};

export default surahReducer;
