
const { DataTypes } = require('sequelize');


const character = ( sequelize ) => {
    sequelize.define('character', {
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        age: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        weight: {
            type: DataTypes.FLOAT,
            allowNull: true
        }
    }, { timestamps: false })
}


module.exports = character;