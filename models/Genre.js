const { DataTypes } = require('sequelize');

const genre = (sequelize) => {
    sequelize.define('genre', {
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, { timestamps: false });
}

module.exports = genre;