const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

/* Creates a user(s) table in MySQL Database. 
   Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const User = db.define('users', {    
    userID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
    username: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    tel: {
        type: Sequelize.INTEGER
    },
    address: {
        type: Sequelize.STRING
    },
    postal: {
        type: Sequelize.STRING
    },
    gender: {
        type: Sequelize.CHAR(1)
    },
    DOB: {
        type: Sequelize.STRING
    },
    cardNo: {
        type: Sequelize.INTEGER
    },
    role:{
        type: Sequelize.INTEGER
    }
});

module.exports = User;
