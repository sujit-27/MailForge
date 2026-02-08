import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('mailforge-theme');
    return savedTheme || 'dark';
  }
  return 'dark';
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    currentTheme: getInitialTheme(),
  },
  reducers: {
    setTheme: (state, action) => {
      state.currentTheme = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('mailforge-theme', action.payload);
      }
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
