const path = require("path")
const express = require("express")
const session = require("express-session")
const exphbs = require("express-handlebars")
const helpers = require("./utils/helpers")
const chalk = require("chalk")

const app = express()
const PORT = process.env.PORT || 3001

const routes = require("./controllers")
const sequelize = require("./config/connection")
const SeqeulizeStore = require("connect-session-sequelize")(session.Store)

const sess = {
  secret: "Super secret secret",
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SeqeulizeStore({
    db: sequelize,
    checkExpirationInterval: 1 * 60 * 1000, // check every minute for expiration
    expiration: 10 * 60 * 1000, // session expire after 10 minutes
  }),
}

app.use(session(sess))

const hbs = exphbs.create({ helpers })

app.engine("handlebars", hbs.engine)
app.set("view engine", "handlebars")

app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(routes)

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () =>
    console.log(chalk.blue.bold(`App listening on port ${PORT}!`))
  )
})
