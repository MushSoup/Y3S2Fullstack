
router.put(
    "/saveEvent/:eventID",
    ensureAuthenticated,
    upload.fields([{ name: "eventImage", maxCount: 1 }, { name: "eventImages", maxCount: 5 }]),
    (req, res) => {
      let eventName = req.body.eventName;
      let eventDesc = req.body.eventDescription;
      let eventLocation = req.body.eventLocation;
      let eventDate = moment(req.body.eventDate, "DD/MM/YYYY");
      let eventCreator = req.user.username;
  
      if (req.files && req.files.length > 0) {
          let thumbnail;
      let eventImages;
  
      if (req.files.eventImage && req.files.eventImage.length > 0) {
        eventImg = req.files.eventImage[0].buffer;
      }
  
      if (req.files.eventImages && req.files.eventImages.length > 0) {
        eventImages = req.files.eventImages.map((file) => ({ image: file.buffer }));
      }
  
      if (thumbnail || eventImages) {
        Event.update(
          {
            eventName,
            eventDate,
            eventDesc,
            eventLocation,
            eventCreator,
            eventImg: thumbnail
          },
          {
            where: {
              eventID: req.params.eventID
            }
          }
        )
          .then(() => {
            if (eventImages) {
              return Promise.all(
                eventImages.map((image) => {
                  return EventImage.update(
                    { image: image.image },
                    {
                      where: {
                        eventID: req.params.eventID
                      }
                    }
                  );
                })
              );
            } else {
              return Promise.resolve();
            }
          })
          .then(() => {
            res.redirect("/event/readEvent");
          })
          .catch((err) => console.log(err));
      }} else {
        // If no new images are uploaded, only update the event details
        Event.update(
          {
            eventName,
            eventDate,
            eventDesc,
            eventLocation,
            eventCreator,
          },
          {
            where: {
              eventID: req.params.eventID,
            },
          }
        )
          .then((event) => {
            res.redirect("/event/readEvent");
          })
          .catch((err) => console.log(err));
      }
    }
  );