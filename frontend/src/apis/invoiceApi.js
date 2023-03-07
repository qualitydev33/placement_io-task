
import axios from 'axios';

import { URL_HOST } from '../constants'

export const getInvoices = async () => {
    const response = await axios.get(`${URL_HOST}/invoices`);

    return response.data;
}

export const createInvoices = async (campaignIds) => {
    await axios.post(`${URL_HOST}/invoices`, {
        campaignIds,
    });
}