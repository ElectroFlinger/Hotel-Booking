const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
// const passport = require("passport");
// const localStrategy = require("passport-local");
// const User = require("./models/user.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/hotels";

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

main()
    .then(() => {
        console.log("Connection to DB successful");
    })
    .catch((err) => {
        console.log(err);
    });
async function main() {
    await mongoose.connect(MONGO_URL);
}

// session
const sessionOptions = {
    secret : "mysecret",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now()+7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true,
    },
};

app.get("/", (req, res) => {
    res.send("This is home page");
});

app.use(session(sessionOptions));
app.use(flash());



app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    next();
});


// Routers
const listings = require("./routes/listing");
const reviews = require("./routes/review");
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

// Error handling
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("listing/error.ejs", { message });
});

// Start server
app.listen(8080, (req, res) => {
    console.log("App is listening on port 8080");
});
