const router = require("express").Router()
const sequelize = require("../../config/connection")
const { Post, User, Likes, Dislike, Comment } = require("../../models")
const withAuth = require("../../utils/auth")

// get all posts
router.get("/", (req, res) => {
  Post.findAll({
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
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err)
      res.status(500).json(err)
    })
})

// GET /api/Post/id to get post from specific post
router.get("/:id", (req, res) => {
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
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" })
        return
      }
      res.json(dbPostData)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json(err)
    })
})

// POST /api/post to create an post activity
router.post("/", withAuth, (req, res) => {
  // expects {title: "Lost dog!", post_content: "My dog ran away at main st and 23th ave", user_id }
  if (req.session) {
    Post.create({
      title: req.body.title,
      post_content: req.body.post_content,
      user_id: req.session.user_id,
    })
      .then((dbPostData) => res.json(dbPostData))
      .catch((err) => {
        console.log(err)
        res.status(500).json(err)
      })
  }
})

// PUT /api/posts/upvote to allow users to like the post
router.put("/upvote", withAuth, (req, res) => {
  if (req.session) {
    Post.upvote(
      { ...req.body, user_id: req.session.user_id },
      { Likes, Comment, User }
    )
      .then((updatePostData) => res.json(updatePostData))
      .catch((err) => {
        console.log(err)
        res.status(500).json(err)
      })
  }
})

// PUT /api/posts/downvote to allow users to dislike the post
router.put("/downvote", withAuth, (req, res) => {
  if (req.session) {
    Post.downvote(
      { ...req.body, user_id: req.session.user_id },
      { Dislike, Comment, User }
    )
      .then((updatePostData) => res.json(updatePostData))
      .catch((err) => {
        console.log(err)
        res.status(500).json(err)
      })
  }
})

// PUT /api/posts/id allow post owner to edit their posts
router.put("/:id", withAuth, (req, res) => {
  Post.update(
    {
      title: req.body.title,
      post_content: req.body.post_content,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" })
        return
      }
      res.json(dbPostData)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json(dbPostData)
    })
})

// DELETE /api/posts/1 allow post owner to delete their posts
router.delete("/:id", (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" })
        return
      }
      res.json(dbPostData)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json(err)
    })
})

module.exports = router
