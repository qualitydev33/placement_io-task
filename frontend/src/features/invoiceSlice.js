import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getInvoices as getInvoiceApi,
    createInvoices as createInvoicesApi
} from '../apis/invoiceApi';

export const createInvoices = createAsyncThunk('invoice/createInvoices', createInvoicesApi);
export const getInvoices = createAsyncThunk('invoice/getInvoices', getInvoiceApi);

export const invoiceSlice = createSlice({
    name: 'invoice',
    initialState: {
        invoiceLookup: [],
        isInvoicesLoading: false,
        showInvoiceCreateSnackbar: false,
    },
    reducers: {
        showInvoiceCreateSnackbar: (state) => {
            state.showInvoiceCreateSnackbar = true;
        },
        closeInvoiceCreateSnackbar: (state) => {
            state.showInvoiceCreateSnackbar = false;
        }
    },
    extraReducers: {
        [getInvoices.pending]: (state, action) => {
            state.isInvoicesLoading = true;
        },
        [getInvoices.fulfilled]: (state, action) => {
            state.invoices = action.payload;
            state.isInvoicesLoading = false;
        },
        [getInvoices.pending]: (state, action) => {
            state.isInvoicesLoading = true;
        },
        [getInvoices.fulfilled]: (state, action) => {
            state.invoiceLookup = action.payload.reduce((lookup, invoice) => {
                lookup[invoice.id] = invoice;

                return lookup;
            }, {});
            state.isInvoicesLoading = false;
        },
        [createInvoices.fulfilled]: (state, action) => {
            state.isFromInvoiceCreate = true;
        },
    }
});
export const { showInvoiceCreateSnackbar, closeInvoiceCreateSnackbar } = invoiceSlice.actions
export default invoiceSlice.reducer