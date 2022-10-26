const router = require("express").Router()
const sequelize = require("../config/connection")
const { Post, User, Comment, Likes } = require("../models")

// get all posts
router.get("/", (req, res) => {
  Post.findAll({
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
      res.render("homepage", {
        posts,
        loggedIn: req.session.loggedIn,
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json(err)
    })
})

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/")
    return
  }
  res.render("login")
})

// route to signup page and after sign up it will redirect to homepage
router.get("/signup", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/")
    return
  }
  res.render("signup")
})

router.get("/post/:id", (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
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
    ],
  }).then((dbPostData) => {
    if (!dbPostData) {
      res.status(404).json({ message: "No post found with this id" })
      return
    }
    Likes.findOne({
      where: {
        post_id: req.params.id,
        user_id: req.session.user_id,
      },
    })
      .then((likeData) => {
        //serialize the data
        const post = dbPostData.get({ plain: true })

        //pass the data to template
        res.render("single-post", {
          post,
          loggedIn: req.session.loggedIn,
          showButton: likeData === null,
        })
      })
      .catch((err) => {
        console.log(err)
        res.status(500).json(err)
      })
  })
})

module.exports = router
