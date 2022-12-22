const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const review = require('../../db/models/review');
const spot = require('../../db/models/spot');

const router = express.Router();

// GET ALL SPOTS OWNED BY THE CURRENT USER
router.get("/current", requireAuth, async (req, res) => {
    const spots = await Spot.findAll({
        where: { ownerId: req.user.id},
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ]
    })

    let spotList = [];

    spots.forEach(spot => {
        spotList.push(spot.toJSON())
    })

    spotList.forEach(spot => {
        let total = 0;
        let reviewCount = 0;
        spot.Reviews.forEach(review => {
            reviewCount ++;
            total += review.stars
        })
        spot.avgRating = total/reviewCount

        delete spot.Reviews
    })

    spotList.forEach(spot => {
        spot.SpotImages.forEach(img => {
            if(img.preview === true){
                spot.previewImage = img.url
            }
        })
        delete spot.SpotImages
    })

    let Spots = spotList

    res.status(200);
    res.json({Spots})
})

// GET SPOT BY ID
router.get("/:spotId", async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId, {
        include: [
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview']
            },
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Review
            }
        ]
    })

    if(spot){
        let foundSpot = spot.toJSON();
    }
})

// CREATE A SPOT
router.post("/", )

// GET ALL SPOTS
router.get("/", async (req, res) => {
    const spots = await Spot.findAll({
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ]
    })

    let spotList = [];

    spots.forEach(spot => {
        spotList.push(spot.toJSON())
    })

    spotList.forEach(spot => {
        let total = 0;
        let reviewCount = 0;
        spot.Reviews.forEach(review => {
            reviewCount++;
            total += review.stars
        })
        spot.avgRating = total/reviewCount

        delete spot.Reviews
    })

    spotList.forEach(spot => {
        spot.SpotImages.forEach(img => {
            if(img.preview === true){
                spot.previewImage = img.url
            }
        })
        delete spot.SpotImages
    })

    let Spots = spotList

    res.status(200);
    res.json({Spots})
})




module.exports = router
