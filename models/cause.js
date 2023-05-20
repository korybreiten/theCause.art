module.exports = (sequelize, Sequelize) => {
    const Cause = sequelize.define("Cause", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true
        },
        creator: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        funds: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        goal: {
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
        about: {
            type: Sequelize.STRING,
            allowNull: true
        },
        icon: {
            type: Sequelize.STRING,
            allowNull: true
        },
        status: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    return Cause;
};