export const FETCH_SURAH_DATA_SUCCESS = 'FETCH_SURAH_DATA_SUCCESS';

export const fetchSurahDataSuccess = (surahDataList: any) => ({
  type: FETCH_SURAH_DATA_SUCCESS,
  payload: surahDataList,
});
