const router = require("express").Router()
const apiRoutes = require("./api")

router.use("/api", apiRoutes)

router.get("/", async (req, res) => {
  res.render("homepage")
})

router.get('/login', (req, res) => {
  console.log('get login route')
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('login');
})

// router.get('/signup', (req, res) => {
//   if (req.session.loggedIn) {
//     res.redirect('/');
//     return;
//   }
//   res.render('signup');
// })

module.exports = router
