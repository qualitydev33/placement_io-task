module.exports = function(sequelize, DataTypes) {
    const LineItem = sequelize.define('LineItem', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.BIGINT,
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        bookedAmount: {
            allowNull: false,
            type: DataTypes.DOUBLE,
        },
        actualAmount: {
            allowNull: false,
            type: DataTypes.DOUBLE,
        },
        adjustment: {
            allowNull: false,
            type: DataTypes.DOUBLE,
        },
        campaignId: {
            allowNull: false,
            type: DataTypes.BIGINT,
        },
        comment: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        isReviewed: {
            defaultValue: false,
            type: DataTypes.BOOLEAN,
        },
        isArchived: {
            defaultValue: false,
            type: DataTypes.BOOLEAN,
        },
    }, {
        indexes: [
            {
                fields: ['campaignId'],
            },
        ],
    });

    return LineItem;
};