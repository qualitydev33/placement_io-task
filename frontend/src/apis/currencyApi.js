import axios from 'axios';

import { CURRENCY_API_URL, CURRENCY_API_KEY } from '../constants'

export const getCurrencyRate = async () => {
    const response = await axios.get(`${CURRENCY_API_URL}/${CURRENCY_API_KEY}/latest/USD`);

    return response.data?.conversion_rates;
}
