import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getLineItems,
    getLineItemsByCampaignId,
    updateAdjustment as updateAdjustmentApi,
    setItemReviewed as setItemReviewedApi,
    getItemComment as getItemCommentApi,
    updateItemComment as updateItemCommentApi,
} from '../apis/lineItemApi';

export const fetchLineItems = createAsyncThunk('lineItem/getLineItems', getLineItems);
export const fetchLineItemsByCampaignId = createAsyncThunk('lineItem/getLineItemsByCampaignId', getLineItemsByCampaignId);
export const updateAdjustment = createAsyncThunk('lineItem/updateAdjustment', updateAdjustmentApi);
export const setItemReviewed = createAsyncThunk('lineItem/setItemReviewed', setItemReviewedApi);
export const getItemComment = createAsyncThunk('lineItem/getItemComment', getItemCommentApi);
export const updateItemComment = createAsyncThunk('lineItem/updateItemComment', updateItemCommentApi);

export const lineItemSlice = createSlice({
    name: 'lineItem',
    initialState: {
        items: [],
        isItemLoading: false,
    },
    reducers: {
    },
    extraReducers: {
        [fetchLineItems.pending]: (state, action) => {
            state.isItemLoading = true;
        },
        [fetchLineItems.fulfilled]: (state, action) => {
            state.items = action.payload;
            state.isItemLoading = false;
        },
        [fetchLineItemsByCampaignId.pending]: (state, action) => {
            state.isItemLoading = true;
        },
        [fetchLineItemsByCampaignId.fulfilled]: (state, action) => {
            state.items = action.payload;
            state.isItemLoading = false;
        },
        [updateAdjustment.fulfilled]: (state, action) => {
            state.items.find((item) => {
                return item.id === Number(action.payload.id)
            }).adjustment = action.payload.adjustment;
        },
        [setItemReviewed.fulfilled]: (state, action) => {
            const reviewedIds = action.payload.ids.map(Number);

            state.items.forEach((item) => {
                if (reviewedIds.includes(item.id)) {
                    item.isReviewed = !item.isReviewed
                };
            })
        },
        [updateItemComment.fulfilled]: (state, action) => {
            const { id, comment } = action.meta?.arg

            state.items.find((item) => {
                return item.id === id
            }).comment = comment;
        },
    }
});

export default lineItemSlice.reducer