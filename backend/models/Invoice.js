module.exports = function(sequelize, DataTypes) {
    const Invoice = sequelize.define('Invoice', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT,
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        campaignId: {
            allowNull: false,
            type: DataTypes.BIGINT,
            unique: true,
        },
        total: {
            allowNull: false,
            type: DataTypes.DOUBLE,
        },
    });

    return Invoice;
};