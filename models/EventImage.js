const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const EventImage = db.define('event_images', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      eventID: {
        type: Sequelize.INTEGER,
        references: {
            model: event, // Reference to the Event model
            key: 'id' // The primary key in the Event model
        }
    },
    image: {
        type: Sequelize.BLOB('long') // Define the eventImg column as a BLOB
    }},
    {
        tableName: 'event' // Specify the custom table name
    });

module.exports = Event;