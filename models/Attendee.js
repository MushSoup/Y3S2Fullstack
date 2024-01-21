const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const user = require('../models/User');
const event = require('../models/Event');

const Attendee = db.define('eventattendee', {
    aID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
    aName: {
        type: Sequelize.STRING
    },
    aPhoneNo: {
        type: Sequelize.STRING
    },
    aAge: {
        type: Sequelize.INTEGER
    },
    aGender: {
        type: Sequelize.STRING
    },
    aDiet:{
        type: Sequelize.STRING
    }, 
    aEmerCont: {
        type: Sequelize.STRING // Define the eventImg column as a BLOB
    },
    aExtra:{
        type: Sequelize.STRING
    },
    eventID: {
        type: Sequelize.INTEGER,
        references: {
            model: event, // Reference to the Event model
            key: 'eventID' // The primary key in the Event model
        }
    },
    userID: {
        type: Sequelize.INTEGER,
        references: {
            model: user, // Reference to the User model
            key: 'userID' // The primary key in the User model
        }
    }},
    {
        tableName: 'eventattendee' // Specify the custom table name
    });

module.exports = Attendee;