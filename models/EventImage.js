const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const event = require('../models/Event');

const EventImage = db.define('event_images', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      eventId: {
        type: Sequelize.INTEGER,
        references: {
            model: event, // Reference to the Event model
            key: 'eventID' // The primary key in the Event model
        }
    },
    image: {
        type: Sequelize.BLOB('long') // Define the image column as a BLOB
    }},
    {
        tableName: 'event_images' // Specify the custom table name
    });

module.exports = EventImage;