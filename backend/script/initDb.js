const { Sequelize, DataTypes } = require('sequelize');

const {
    Campaign,
    Invoice,
    LineItem
} = require('../models');

// Create table is not existing
Promise.all([
    Campaign.sync(),
    Invoice.sync(),
    LineItem.sync(),
]).then(() => {
    console.log('Table create done!');

    // Insert raw data
    const rawData = require('../placements_teaser_data.json');

    const campaignsLookup = {};
    const lineItems = [];

    rawData.forEach((data) => {
        lineItems.push({
            id: data['id'],
            campaignId: data['campaign_id'],
            name: data['line_item_name'],
            bookedAmount: data['booked_amount'], //precision issue
            actualAmount:data['actual_amount'],
            adjustment: data['adjustments'],
        });

        campaignsLookup[data['campaign_id']] = {
            id: data['campaign_id'],
            name: data['campaign_name'],
        }
    });

    Promise.all(Object.values(campaignsLookup).map((campaign) => {
        return Campaign.create(campaign);
    })).then(()=> {
        return Promise.all(lineItems.map((item) => {
            return LineItem.create(item);
        }))
    }).then(() => {
        console.log('Insert data done!')
    });
})

