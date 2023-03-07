import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getCampaigns,
    getCampaignById,
} from '../apis/campaignApi';

export const fetchCampaigns = createAsyncThunk('campaign/getCampaigns', getCampaigns);
export const fetchCampaignById = createAsyncThunk('campaign/getCampaignById', getCampaignById);

export const campaignSlice = createSlice({
    name: 'campaign',
    initialState: {
        campaignLookup: {},
        isCampaignLoading: false,
    },
    reducers: {
    },
    extraReducers: {
        [fetchCampaigns.pending]: (state, action) => {
            state.isCampaignLoading = true;
        },
        [fetchCampaigns.fulfilled]: (state, action) => {
            state.campaignLookup = action.payload.reduce((lookup, campaign) => {
                lookup[campaign.id] = campaign;

                return lookup;
            }, {});
            state.isCampaignLoading = false;
        },
        [fetchCampaignById.pending]: (state, action) => {
            state.isCampaignLoading = true;
        },
        [fetchCampaignById.fulfilled]: (state, action) => {
            const campaign = action.payload?.[0];

            state.campaignLookup[campaign.id] = campaign;
            state.isCampaignLoading = false;
        },
    }
});

export default campaignSlice.reducer