const { DataTypes, Sequelize } = require('sequelize');

const movie = (sequelize) => {
    sequelize.define('movie', {
        title: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        genreId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'genre',
                key: 'id'
            }
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        score: {
            type: DataTypes.FLOAT,
            allowNull: true,
            min: 1,
            max: 5
        },
        isMovie: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    });
}

module.exports = movie;