const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Forum = db.define('forum', {
    fName: {
        type: Sequelize.STRING
    },
    fType: {
        type: Sequelize.STRING
    },
    fDate: {
        type: Sequelize.DATE
    }
});

module.exports = Forum;