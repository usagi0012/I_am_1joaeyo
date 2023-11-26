'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Posts extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.Users, { as: 'user', onDelete: 'cascade' });
            this.hasMany(models.Likes, { foreignKey: 'postId', as: 'likes', onDelete: 'cascade' });
            this.hasMany(models.Comments, { foreignKey: 'postId', as: 'comments', onDelete: 'cascade' });
        }
    }
    Posts.init(
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            title: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            content: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            image: {
                type: DataTypes.STRING,
            },
            userId: {
                allowNull: false,
                type: DataTypes.NUMBER,
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'Posts',
        }
    );
    return Posts;
};
