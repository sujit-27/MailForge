// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice";
import authReducer from "./slices/authSlice";
import projectsReducer from "./slices/projectsSlice";
import emailsReducer from "./slices/emailsSlice";
import analyticsReducer from "./slices/analyticsSlice";
import paymentsReducer from "./slices/paymentSlice";  
import transactionsReducer from "./slices/transactionSlice";
import templatesReducer from "./slices/templateSlice";

const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    projects: projectsReducer,
    emails: emailsReducer,
    analytics: analyticsReducer,
    payment: paymentsReducer,
    transactions: transactionsReducer,
    templates: templatesReducer,
  },
});

export default store;

