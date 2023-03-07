module.exports = function(sequelize, DataTypes) {
    const Campaign = sequelize.define('Campaign', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.BIGINT,
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        isInvoiceCreated: {
            defaultValue: false,
            type: DataTypes.BOOLEAN,
        },
        isReviewed: {
            defaultValue: false,
            type: DataTypes.BOOLEAN,
        },
        isArchived: {
            defaultValue: false,
            type: DataTypes.BOOLEAN,
        },
    });

    return Campaign;
};