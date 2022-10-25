const { Model, DataTypes } = require("sequelize")
const sequelize = require("../config/connection")
const bcrypt = require("bcrypt")

// create User model
class User extends Model {
  // set up method to run on instance data (per user) to check password
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password)
  }
}

// define table columns and configuration
User.init(
  {
    // define an id column
    id: {
      type: DataTypes.INTEGER, // use the special Sequelize DataTypes object provide what type of data it is
      allowNull: false, // this is the equivalent of SQL's `NOT NULL` option
      primaryKey: true, // instruct that this is the Primary Key
      autoIncrement: true, // enable auto increment
    },
    // define an username column
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // define an email column
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // unique to ensure that there is no duplicate email values in this table
      validate: {
        isEmail: true, // run data through validators before creating the table data
      },
    },
    // define a password column
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6], // password must be at least six characters long
      },
    },
  },
  {
    // lifecycle events
    hooks: {
      // set up beforeCreate hook functionality
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10)
        return newUserData
      },
      // set up beforeUpdate hook functionality
      async beforeUpdate(updatedUserData) {
        updatedUserData.password = await bcrypt.hash(
          updatedUserData.password,
          10
        )
        return updatedUserData
      },
    },

    // Table configuration options
    sequelize, // pass in imported sequelize connection
    timestamps: false, // Not allow to automatically create timestamp fields
    freezeTableName: true, // don't pluralize name of database table
    underscored: true, // use underscores instead of camel-casing
    modelName: "user", // named model to stays lowercase in the database
  }
)

module.exports = User
