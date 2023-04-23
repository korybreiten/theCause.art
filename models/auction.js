module.exports = (sequelize, Sequelize) => {
    const Auction = sequelize.define("Auction", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        creator: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        bid: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        funds: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        start: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        time: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        width: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        height: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        depth: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        image1: {
            type: Sequelize.STRING,
            allowNull: true
        },
        image2: {
            type: Sequelize.STRING,
            allowNull: true
        },
        image3: {
            type: Sequelize.STRING,
            allowNull: true
        },
        cause: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        status: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    return Auction;
};