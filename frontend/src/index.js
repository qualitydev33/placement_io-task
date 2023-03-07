import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'
import logger from 'redux-logger'
import { configureStore } from '@reduxjs/toolkit'

import App from './components/App';

import campaignReducer from './features/campaignSlice';
import lineItemSlice from './features/lineItemSlice';
import invoiceSlice from './features/invoiceSlice';
import appSlice from './features/appSlice';

import { IS_PRODUCTION } from './constants';

const store = configureStore({
    reducer: {
        campaign: campaignReducer,
        lineItem: lineItemSlice,
        invoice: invoiceSlice,
        app: appSlice,
    },
    middleware: (getDefaultMiddleware) => {
        return IS_PRODUCTION ? getDefaultMiddleware() : getDefaultMiddleware().concat(logger);
    },
})

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);