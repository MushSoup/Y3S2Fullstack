const mySQLDB = require('./DBConfig');
const user = require('../models/User');
const video = require('../models/Video');
const event = require('../models/Event');
const attendee = require('../models/Attendee');
const EventImage = require('../models/EventImage')

// If drop is true, all existing tables are dropped and recreated
const setUpDB = (drop) => {
    mySQLDB.authenticate()
        .then(() => {
            console.log('techcycle database connected');
        })
        .then(() => {
            /*
              Defines the relationship where a user has many videos.
              In this case the primary key from user will be a foreign key
              in video.
            */
            user.hasMany(video);
            user.hasMany(attendee, {foreignKey: 'userID'});
            attendee.belongsTo(user, {foreignKey: 'userID'});
            event.hasMany(attendee, {foreignKey: 'eventID'});
            attendee.belongsTo(event, {foreignKey: 'eventID'});
            event.hasMany(EventImage, { as: 'images',  foreignKey: 'eventId'  });
            EventImage.belongsTo(event, { foreignKey: 'eventId' });
            mySQLDB.sync({ // Creates table if none exists
                force: drop
            }).then(() => {
                console.log('Create tables if none exists')
            }).catch(err => console.log(err))
        })
        .catch(err => console.log('Error: ' + err));
};

module.exports = { setUpDB };
