module.exports = (sequelize, Sequelize) => {
    const Bid = sequelize.define("Bid", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        creator: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        cause: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        auction: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        amount: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        status: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    return Bid;
};