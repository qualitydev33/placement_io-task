
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const URL_HOST = IS_PRODUCTION? 'https://pleacement-io-interview.herokuapp.com' : 'http://localhost:3000'
export const CURRENCY_API_KEY = 'e9b98113566ef17b610c06e4';
export const CURRENCY_API_URL = 'https://v6.exchangerate-api.com/v6';