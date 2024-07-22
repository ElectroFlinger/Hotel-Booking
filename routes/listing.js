const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(404, error);
    } else {
        next();
    }
};

// Index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listing/index.ejs", { allListings });
}));



/// New route - Create (C)
router.get("/new", (req, res) => {
    res.render("listing/new.ejs");
});
// Save POST route
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    const { image, ...listingData } = req.body;
    const newListing = new Listing({
        ...listingData,
        image: image
    });

    await newListing.save();
    req.flash("success","new listing created");
    res.redirect("/listings");
}));


// Show route -- Read ( R )
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listing/show.ejs", { listing });
}));

// Edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing });
}));

// Update route
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { image, ...listingData } = req.body;

    const updatedListing = {
        ...listingData,
        image: image
    };

    const updated = await Listing.findByIdAndUpdate(id, updatedListing);
    req.flash("success","listing Updated");

    // Redirect to the updated listing page
    res.redirect(`/listings/${updated._id}`);
}));



// Delete route -- Delete ( D )
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing Deleted");
    res.redirect("/listings");
}));

module.exports = router;
