import axios from 'axios';

import { URL_HOST } from '../constants'

export const getLineItems = async () => {
    const response = await axios.get(`${URL_HOST}/line-items`);

    return response.data;
}

export const getLineItemsByCampaignId = async (campaignId) => {
    const response = await axios.get(`${URL_HOST}/line-items/campaign/${campaignId}`);

    return response.data;
}

export const getLineItemsByCampaignIds = async (ids) => {
    const response = await axios.post(`${URL_HOST}/line-items/campaign`, {
        ids,
    });

    return response.data;
}

export const updateAdjustment = async ({id, adjustment}) => {
    const response = await axios.put(`${URL_HOST}/line-items/${id}`, {
        adjustment
    });

    return response.data;
}

export const setItemReviewed = async (ids) => {
    const response = await axios.put(`${URL_HOST}/line-items/reviewed`, {
        ids
    });

    return response.data;
}

export const getItemComment = async (id) => {
    const response = await axios.get(`${URL_HOST}/line-items/${id}/comment`);

    return response.data;
}

export const updateItemComment = async ({id, comment}) => {
    await axios.post(`${URL_HOST}/line-items/${id}/comment`, {
        text: comment,
    });

    return;
}