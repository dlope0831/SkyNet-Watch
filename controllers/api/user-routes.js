const router = require("express").Router()
const { User } = require("../../models")

// GET /api/users to get all users data
router.get("/", (req, res) => {
  User.findAll({
    attributes: { exclude: ["password"] },
  })
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => {
      console.log(err)
      res.status(500).json(err)
    })
})

// GET /api/users/1 to get individual user data
router.get("/:id", (req, res) => {
  User.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(400).json({ message: "No user found with this id" })
      }
      res.json(dbUserData)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json(err)
    })
})

// POST /api/users create new user
router.post("/", (req, res) => {
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  })
    .then((dbUserData) => {
      req.session.save(() => {
        req.session.user_id = dbUserData.id
        req.session.username = dbUserData.username
        req.session.loggedIn = true

        res.json(dbUserData)
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json(err)
    })
})

// POST /api/users/login
router.post("/login", (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  }).then((dbUserData) => {
    if (!dbUserData) {
      res
        .status(400)
        .json({ message: "No user with that email address found!" })
      return
    }
    const validPassword = dbUserData.checkPassword(req.body.password)
    if (!validPassword) {
      res.status(400).json({ message: "Incorrect password" })
      return
    }
    req.session.save(() => {
      req.session.user_id = dbUserData.id
      req.session.username = dbUserData.username
      req.session.loggedIn = true

      res.json({ user: dbUserData, message: "You are now logged in! " })
    })
  })
})

// POST /api/users/logout
router.post("/logout", (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end()
    })
  } else {
    res.status(404).end()
  }
})

// PUT /api/users/1 to update one or more user's data
router.put("/:id", (req, res) => {
  User.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id" })
      }
      res.json(dbUserData)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json(err)
    })
})

// DELETE /api/users/1 to remove user's all data
router.delete("/:id", (req, res) => {
  User.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id " })
      }
      res.json(dbUserData)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json(err)
    })
})

module.exports = router
