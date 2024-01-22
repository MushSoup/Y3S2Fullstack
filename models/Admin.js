const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

/* Creates a user(s) table in MySQL Database. 
   Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const Admin = db.define('admin', {    
    adminID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
    adminName: {
        type: Sequelize.STRING
    },
    adminEmail: {
        type: Sequelize.STRING
    }},
    {
        tableName: 'admin' // Specify the custom table name
    });

module.exports = Admin;