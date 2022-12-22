const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const spotValidator = [
    check('address')
        .exists({checkFalsy: true})
        .withMessage("Street address is required"),
    check("city")
        .exists({checkFalsy: true})
        .withMessage("City is required"),
    check("state")
        .exists({checkFalsy: true})
        .withMessage("State is required"),
    check("country")
        .exists({checkFalsy: true})
        .withMessage("Country is required"),
    check("lat")
        .exists({checkFalsy: true})
        .withMessage("Latitude is not valid"),
    check("lng")
        .exists({checkFalsy: true})
        .withMessage("Longitude is not valid"),
    check("name")
        .exists({checkFalsy: true})
        .isLength({max: 50})
        .withMessage("Name must be less than 50 characters"),
    check("description")
        .exists({checkFalsy: true})
        .withMessage("Description is required"),
    check("price")
        .exists({checkFalsy: true})
        .withMessage("Price per day is required"),
    handleValidationErrors
]

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

// GET DETAILS OF A SPOT FROM AN ID
router.get("/:spotId", async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId, {
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Review
            },
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview']
            }
        ]
    })

    if(spot){
        let foundSpot = spot.toJSON();
        let total = 0;
        let reviewCount = 0;

        let foundSpotImages = foundSpot.SpotImages
        delete foundSpot.SpotImages

        foundSpot.Reviews.forEach(review => {
            reviewCount++;
            total += review.stars
        })
        foundSpot.numReviews = reviewCount
        foundSpot.avgStarRating = total/reviewCount

        foundSpot.SpotImages = foundSpotImages

        delete foundSpot.Reviews

        foundSpot.Owner = foundSpot.User
        delete foundSpot.User

        res.status(200);
        res.json(foundSpot)
    } else {
        res.status(404);
        res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
})

// EDIT A SPOT
router.put("/:spotId", spotValidator, requireAuth, async(req, res) => {
    const { address, city, state, country, lat, lng, name, description, price} = req.body

    const spotToUpdate = await Spot.findByPk(req.params.spotId)

    if(spotToUpdate){
    const updatedSpot = await spotToUpdate.update({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })

    res.status(200);
    res.json(updatedSpot)
} else {
    res.status(404);
    res.json({
        message: "Spot couldn't be found",
        statusCode: 404
    })
}
})

// DELETE A SPOT
router.delete("/:spotId", requireAuth, async (req, res) => {
    const spotToDelete = await Spot.findByPk(req.params.spotId)

    if(spotToDelete){
        if(req.user.id === spotToDelete.ownerId){
        await spotToDelete.destroy()

        res.status(200);
        res.json({
            message: "Successfully deleted",
            statusCode: 200
        })
    } else {
        res.status(404)
        res.json({
            message: "Invalid authorization",
            statusCode: 404
        })
    }
    } else {
        res.status(404);
        res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
})

// CREATE A SPOT
router.post("/", spotValidator, requireAuth, async(req, res) => {
    const { address, city, state, country, lat, lng, name, description, price} = req.body

    const newSpot = await Spot.create({
        ownerId: req.user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })

    res.status(201);
    res.json(newSpot)
})

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
