const User = require("./User")
const Post = require("./Post")
const Comment = require("./Comment")
const Likes = require("./Likes")
const Dislike = require("./Dislike")

// create associations

User.hasMany(Post, {
  foreignKey: "user_id",
})

Post.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "cascade",
})

User.belongsToMany(Post, {
  through: Likes,
  as: "liked_posts",
  foreignKey: "user_id",
  onDelete: "cascade",
})

User.belongsToMany(Post, {
  through: Dislike,
  as: "disliked_posts",
  foreignKey: "user_id",
  onDelete: "cascade",
})

Post.belongsToMany(User, {
  through: Likes,
  as: "liked_posts",
  foreignKey: "post_id",
  onDelete: "cascade",
})

Post.belongsToMany(User, {
  through: Dislike,
  as: "disliked_posts",
  foreignKey: "post_id",
  onDelete: "cascade",
})

Likes.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "cascade",
})

Dislike.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "cascade",
})

Likes.belongsTo(Post, {
  foreignKey: "post_id",
  onDelete: "cascade",
})

Dislike.belongsTo(Post, {
  foreignKey: "post_id",
  onDelete: "cascade",
})

User.hasMany(Likes, {
  foreignKey: "user_id",
  onDelete: "cascade",
})

User.hasMany(Dislike, {
  foreignKey: "user_id",
  onDelete: "cascade",
})

Post.hasMany(Likes, {
  foreignKey: "post_id",
  onDelete: "cascade",
})

Post.hasMany(Dislike, {
  foreignKey: "post_id",
  onDelete: "cascade",
})

Comment.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "cascade",
})

Comment.belongsTo(Post, {
  foreignKey: "post_id",
  onDelete: "cascade",
})

User.hasMany(Comment, {
  foreignKey: "user_id",
  onDelete: "cascade",
})

Post.hasMany(Comment, {
  foreignKey: "post_id",
  onDelete: "cascade",
})

module.exports = { User, Post, Likes, Dislike, Comment }
