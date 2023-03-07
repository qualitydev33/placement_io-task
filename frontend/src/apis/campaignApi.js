import axios from 'axios';

import { URL_HOST } from '../constants'

export const getCampaigns = async () => {
    const response = await axios.get(`${URL_HOST}/campaigns`);

    return response.data;
}

export const getCampaignById = async (id) => {
    const response = await axios.get(`${URL_HOST}/campaigns/${id}`);

    return response.data;
}
