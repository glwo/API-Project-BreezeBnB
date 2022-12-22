const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const review = require('../../db/models/review');
const spot = require('../../db/models/spot');

const router = express.Router();

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
        let sum = 0;
        let count = 0;
        spot.Reviews.forEach(review => {
            count++;
            sum += review.stars
        })
        spot.avgRating = sum/count

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

    res.status(200);
    res.json({spotList})
})




module.exports = router
