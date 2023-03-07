const express = require('express');
const R = require('ramda');
const { Op } = require("sequelize");

const {
    Campaign,
    LineItem,
    Invoice,
    sequelize,
} = require('../models');

const router = express.Router();

// Get all invoices result
router.get('/', async function(req, res, next) {
    try {
        const result = await Invoice.findAll();

        res.status(200).json(result);
    } catch (err) {
        console.error(err);

        next(err);
    }
});

// Create invoices
router.post('/', async function(req, res, next) {
    try {
        const {
            campaignIds
        } = req.body;

        const [campaigns, invoices] = await Promise.all([
            Campaign.findAll({
                where: {
                    id: {
                        [Op.in]: campaignIds,
                    }
                },
                include: LineItem,
            }),
            Invoice.findAll({
                attributes: ['campaignId'],
            }),
        ]);

        const invoicesToUpdate = campaigns.map((campaign) => {
            console.log({
                campaign,
            })
            return {
                campaignId: campaign.id,
                name: campaign.name,
                total: R.sum(R.map((item) => (item['actualAmount'] + item['adjustment']), campaign['LineItems'])),
            };
        });

        // Sqlite in heroku doesn't support upsert so we have to implement the upsert
        const campaignIdExistSet = new Set(invoices.map(invoice => invoice.get('campaignId')));
        const invoiceNotCreated = invoicesToUpdate.filter((invoice) => (!campaignIdExistSet.has(invoice.campaignId)))
        const invoiceCreated = invoicesToUpdate.filter((invoice) => (campaignIdExistSet.has(invoice.campaignId)))

        const t = await sequelize.transaction();

        try {
            await Promise.all([
                Invoice.bulkCreate(invoiceNotCreated, {
                    transaction: t
                }),
                ...invoiceCreated.map((invoice) => {
                    return Invoice.update(invoice, {
                        where: {
                            campaignId: invoice.campaignId,
                        },
                        transaction: t
                    })
                }),
                Campaign.update({
                    isInvoiceCreated: true,
                }, {
                    where: {
                        id: {
                            [Op.in]: campaignIds,
                        }
                    },
                    transaction: t,
                })
            ]);
            await t.commit();
        } catch (err) {
            await t.rollback();

            throw err;
        }

        res.status(204).send();
    } catch (err) {
        console.error(err);

        next(err);
    }
});

module.exports = router;
