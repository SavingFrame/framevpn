import { createSlice } from '@reduxjs/toolkit';

export interface TitleState {
  value: string;
}

const initialState: TitleState = {
  value: 'Dashboard',
};

export const routeTitleSlice = createSlice({
  name: 'routeTitle',
  initialState,
  reducers: {
    setRouteTitle: (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state.value = action.payload;
    },
  },
});

export const { setRouteTitle } = routeTitleSlice.actions;

export default routeTitleSlice.reducer;
