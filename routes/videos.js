const express = require("express");
const router = express.Router();

const Video = require("../models/Video");
const Rent = require("../models/Rent");

/* router.get("/allvideos", (req, res) => {
    Video.find((err, docs) => {
        if (!err) {
            //console.log(docs);
            res.render("allvideos", { list: docs });
        } else {
            console.log("Error in retrieving Videos from DB: " + err);
        }
    });
}); */

router.get("/allvideos/:page", (req, res, next) => {
    var perPage = 5;
    var page = req.params.page || 1;

    Video.find({})
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec((err, docs) => {
            Video.count().exec((err, count) => {
                if (err) return next(err);

                res.render("allvideos", {
                    list: docs,
                    current: page,
                    pages: Math.ceil(count / perPage),
                });
            });
        });
});
/////////////////////////// ADD VIDEOS ///////////////////////////
router.get("/addVideo", (req, res) => {
    res.render("addVideo");
});

router.post("/addVideo", (req, res) => {
    console.log(req.body);

    const {
        title,
        type,
        genre,
        isChildren,
        isNewRelease,
        maxAge,
        releaseYear,
    } = req.body;
    let errors = [];

    if (!title || !type || !genre) {
        errors.push({ msg: "Please enter all required fields" });
    }

    if (errors.length > 0) {
        //console.log(errors)
        res.render("addvideo", {
            errors,
            title,
            type,
            genre,
        }); // register.ejs
    } else {
        // check if email already in DB
        Video.findOne({ title: title }).then((video) => {
            // email in DB: email from req.body
            if (video) {
                // if user is found
                errors.push({ msg: "Video already in DB" });
                res.render("addvideo", {
                    errors,
                    title,
                    type,
                    genre,
                });
            } else {
                let video = new Video({
                    title,
                    type,
                    genre,
                    isChildren,
                    isNewRelease,
                    maxAge,
                    releaseYear,
                });
                video
                    .save()
                    .then((video) => {
                        // console.log(req.body)
                        console.log("Video added Sucessfully");
                        req.flash("success_msg", "Video added Sucessfully");
                        res.redirect("/allvideos/1");
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        });
    }
});
///////////////////////////////////////////////////////////////////////////

///////////////////////// RENT VIDEOS //////////////////////////////
router.get("/allvideos/rent/:id", (req, res) => {
    // console.log(req.params.id);
    Video.findById({ _id: req.params.id }, (err, docs) => {
        if (!err) {
            res.render("rentvideo", { list: docs });
        } else {
            console.log("Error in retrieving selected video: " + err);
        }
    });
});

router.post("/allvideos/rent/:id", (req, res) => {
    //console.log(req);
    // console.log(req.params.id);

    console.log(req.body);

    const { username, title, type, releaseYear, maxAge, days } = req.body;
    let errors = [];

    if (!username || !title || !days) {
        errors.push({ msg: "Please enter all required fields" });
    }

    if (errors.length > 0) {
        //console.log(errors)
        res.render("rentvideo", {
            errors,
            username,
            title,
            days,
        }); // register.ejs
    } else {
        let rentcost = 0;
        if (type == "Children's movie") {
            rentcost = 8 * days + maxAge / 2;
        }
        if (type == "New Release") {
            rentcost = 15 * days - releaseYear;
        }
        if (type == "Regular") {
            rentcost = 10 * days;
        }

        let rent = new Rent({
            username,
            title,
            days,
            rentcost: rentcost,
        });
        rent.save()
            .then((docs) => {
                // console.log(req.body)
                console.log("Rent added Sucessfully");
                req.flash("success_msg", "Rent added Sucessfully");
                //res.redirect("/allvideos/rentcost/:id");
                res.render("rentcost", { list: docs });
            })
            .catch((err) => {
                console.log(err);
            });
    }
});

///////////////////////////////////////////////////////////////////////////

///////////////////////// GET RENT COST //////////////////////////////

/* router.get("/allvideos/rentcost/:id", (req, res) => {
    // console.log(req.params.id);
    Rent.findById({ _id: req.params.id }, (err, docs) => {
        if (!err) {
            res.render("rentcost", { list: docs });
        } else {
            console.log("Error in retrieving selected video: " + err);
        }
    });
}); */
///////////////////////////////////////////////////////////////////////////

module.exports = router;
