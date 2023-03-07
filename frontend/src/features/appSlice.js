import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getCurrencyRate as getCurrencyRateApi
} from '../apis/currencyApi';

export const getCurrencyRate = createAsyncThunk('app/getCurrencyRate', getCurrencyRateApi);
export const appSlice = createSlice({
    name: 'app',
    initialState: {
        currentCurrency: 'USD',
        usdToCurrentCurrencyRate: 1,

    },
    reducers: {
        setCurrency: (state, action) => {
            state.currentCurrency = action.payload;
        }
    },
    extraReducers: {
        [getCurrencyRate.fulfilled]: (state, action) => {
            if (state.currentCurrency === 'EUR') {
                state.usdToCurrentCurrencyRate = action.payload?.['EUR'] || 1; //TODO: handle API error
            } else {
                state.usdToCurrentCurrencyRate = 1;

            }
        },
    }
});

export const { setCurrency } = appSlice.actions;
export default appSlice.reducer;