const express = require('express');
const R = require('ramda');
const {
    Campaign,
    LineItem,
} = require('../models');

const router = express.Router();

// Get all campaigns
router.get('/', async function(req, res, next) {
    try {
        const campaigns = await Campaign.findAll({
            include: LineItem
        });

        const result = campaigns
            .map((campaign) => {
                return {
                    id: campaign.id,
                    name: campaign.name,
                    total: R.sum(R.map((item) => (item['actualAmount'] + item['adjustment']), campaign['LineItems'])),
                    isInvoiceCreated: campaign.isInvoiceCreated,
                };
            })

        res.status(200).json(result);
    } catch (err) {
        console.error(err);

        next(err);
    }
});

// Get campaign by ID
router.get('/:id', async function(req, res, next) {
    try {
        const id = req.params.id;
        const campaign = await Campaign.findAll({
            where: {
                id,
            }
        });

        res.status(200).json(campaign);
    } catch (err) {
        console.error(err);

        next(err);
    }
});

module.exports = router;
