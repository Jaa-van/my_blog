"use strict";
const { Model } = require("sequelize");
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      this.belongsTo(models.posts, {
        targetKey: "post_id",
        foreignKey: "PostId",
      });
      this.belongsTo(models.users, {
        targetKey: "user_id",
        foreignKey: "UserId",
      });
    }
  }
  comments.init(
    {
      comment_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      PostId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "posts",
          key: "post_id",
        },
        onDelete: "CASCADE",
      },
      UserId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "user_id",
        },
        onDelete: "CASCADE",
      },
      comment: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    },
    {
      sequelize,
      modelName: "comments",
    }
  );
  return comments;
};
