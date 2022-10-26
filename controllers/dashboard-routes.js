const router = require("express").Router()
const sequelize = require("../config/connection")
const { Post, User, Comment } = require("../models")
const withAuth = require("../utils/auth")

// get all posts
router.get("/", (req, res) => {
  Post.findAll({
    where: {
      user_id: req.session.user_id,
    },
    order: [["created_at", "DESC"]],
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
      [
        sequelize.literal(
          "(SELECT COUNT (*) FROM dislike WHERE post.id = dislike.post_id)"
        ),
        "dislike_count",
      ],
    ],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      const posts = dbPostData.map((post) => post.get({ plain: true }))
      res.render("dashboard", {
        posts,
        loggedIn: req.session.loggedIn,
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json(err)
    })
})
router.get("/edit/:id", withAuth, (req, res) => {
  Post.findByPk(req.params.id, {
    attributes: [
      "id",
      "post_content",
      "title",
      "created_at",
      [
        sequelize.literal(
          "(SELECT COUNT(*) FROM likes WHERE post.id = likes.post_id)"
        ),
        "likes_count",
      ],
      [
        sequelize.literal(
          "(SELECT COUNT (*) FROM dislike WHERE post.id = dislike.post_id)"
        ),
        "dislike_count",
      ],
    ],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      if (dbPostData) {
        const post = dbPostData.get({ plain: true })

        res.render("edit-post", {
          post,
          loggedIn: true,
        })
      } else {
        res.status(404).end()
      }
    })
    .catch((err) => {
      res.status(500).json(err)
    })
})

module.exports = router
