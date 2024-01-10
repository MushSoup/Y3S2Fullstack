const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Event = db.define('event', {
    eventID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
    eventName: {
        type: Sequelize.STRING
    },
    eventDesc: {
        type: Sequelize.STRING
    },
    eventLocation: {
        type: Sequelize.STRING
    },
    eventDate: {
        type: Sequelize.DATE
    },
    eventCreator:{
        type: Sequelize.STRING
    }, 
    eventImg: {
        type: Sequelize.BLOB('long') // Define the eventImg column as a BLOB
    }},
    {
        tableName: 'event' // Specify the custom table name
    });

module.exports = Event;