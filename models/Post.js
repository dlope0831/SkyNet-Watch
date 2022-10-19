const { Model, DataTypes } = require("sequelize")
const sequelize = require("../config/connection")

class Post extends Model {
  static upLikes(body, models) {
    return models.Likes.create({
      user_id: body.user_id,
      post_id: body.post_id,
    }).then(() => {
      return Post.findOne({
        where: {
          id: body.post_id,
        },
        attributes: [
          "id",
          "post_content",
          "title",
          "created_at",
          [
            sequelize.literal(
              "(SELECT COUNT (*) FROM likes WHERE post.id = likes.post_id)"
            ),
            "likes_count",
          ],
        ],
      })
    })
  }
  static upDislike(body, models) {
    return models.Dislike.create({
      user_id: body.user_id,
      post_id: body.post_id,
    }).then(() => {
      return Post.findOne({
        where: {
          id: body.post_id,
        },
        attributes: [
          "id",
          "post_content",
          "title",
          "created_at",
          [
            sequelize.literal(
              "(SELECT COUNT (*) FROM dislike WHERE post.id = dislike.post_id)"
            ),
            "dislike_count",
          ],
        ],
      })
    })
  }
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    post_content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id",
      },
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: "post",
  }
)

module.exports = Post
