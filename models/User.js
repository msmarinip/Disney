const { DataTypes } = require('sequelize');

const user = (sequelize) => {
    sequelize.define('user', {
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, { timestamps: false });
};

module.exports = user;