const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Event = db.define('event', {
    eName: {
        type: Sequelize.STRING
    },
    eDesc: {
        type: Sequelize.STRING
    },
    eLocation: {
        type: Sequelize.STRING
    },
    eDate: {
        type: Sequelize.DATE
    }
});

module.exports = Event;