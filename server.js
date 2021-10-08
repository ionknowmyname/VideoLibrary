const express = require("express");
const mongoose = require("mongoose");
// const bodyparser = require("body-parser");   // bodyparser now included in express
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");

const VideoRoute = require("./routes/videos");
// const RentRoute = require("./routes/rent");

////////////////////  MongoDB Connection ////////////////////////
mongoose.connect(
    "mongodb://localhost:27017/VideoLibrary",
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        if (!err) {
            console.log("MongoDB connection success");
        } else {
            console.log("Error in DB Connection: " + err);
        }
    }
);
//////////////////////////////////////////////////////////////////

const app = express();

////// EJS  SETUP  ///////
app.use(expressLayouts);
app.set("view engine", "ejs");
//////////////////////////

//////////// Bodyparser middleware //////////////
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
/////////////////////////////////////////////////

//////////// method Override middleware //////////////
app.use(methodOverride("_method")); // to override post method in forms to delete
/////////////////////////////////////////////////

///// EXPRESS-SESSION middleware ////
app.use(
    session({
        secret: "secret", // can be anything
        resave: true,
        saveUninitialized: true,
    })
);
///////////////////////////////////////////////

//// FLASH middleware ////
app.use(flash());
//////////////////////////

/////////////// setting Global Variables ///////////////////
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg"); // success_msg is the variable name
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error"); // flash for passport error
    next();
});
///////////////////////////////////////////////////////////

app.use("/", VideoRoute); // routes should be after bodyparser
// app.use("/rent", RentRoute);

//////////////////// Server start //////////////////
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});
/////////////////////////////////////////////////////
