const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize')

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

const reviewValidator = [
    check("review")
        .exists({checkFalsy: true})
        .withMessage("Review text is required"),
    check("stars")
        .exists({checkFalsy: true})
        .isIn([1,2,3,4,5])
        .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
]

const spotQueryValidator = [
    check("page")
        .default(1)
        .isInt({ min: 1})
        .withMessage("Page must be greater than or equal to 1"),
    check("size")
        .default(20)
        .isInt({ min: 1})
        .withMessage("Size must be greater than or equal to 1"),
    check("maxLat")
        .optional()
        .isDecimal({checkFalsy: true})
        .withMessage("Maximum latitude is invalid"),
    check("minLat")
        .optional()
        .isDecimal({checkFalsy: true})
        .withMessage("Minimum latitude is invalid"),
    check("minLng")
        .optional()
        .isDecimal({checkFalsy: true})
        .withMessage("Minimum longitude is invalid"),
    check("maxLng")
        .optional()
        .isDecimal({checkFalsy: true})
        .withMessage("Maximum longitude is invalid"),
    check("minPrice")
        .optional()
        .isInt({ min: 0})
        .withMessage("Minimum price must be greater than or equal to 0"),
    check("maxPrice")
        .optional()
        .isInt({ min: 0})
        .withMessage("Maximum price must be greater than or equal to 0"),
    handleValidationErrors
]

// GET ALL REVIEWS BY A SPOT'S ID
router.get("/:spotId/reviews", async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId)
    const reviews = await Review.findAll({
        where: { spotId: req.params.spotId },
        include : [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    })


    if(spot){
    let reviewList = [];
    reviews.forEach(review => {
        reviewList.push(review.toJSON())
    });

    res.status(200)
    res.json({
        Reviews: reviewList
    })
  } else {
    res.status(404)
    res.json({
        message: "Spot couldn't be found",
        statusCode: 404
    })
  }
})

// CREATE A REVIEW FOR A SPOT BASED ON THE SPOT'S ID
router.post("/:spotId/reviews", reviewValidator, requireAuth, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId)

    const oldReview = await Review.findOne({
        where: {
            [Op.and]: [
                {spotId: req.params.spotId},
                {userId: req.user.id}
            ]
        }
    })

    if(spot && !oldReview){
    const { review, stars} = req.body

    const newReview = await Review.create({
        userId: req.user.id,
        spotId: req.params.spotId,
        review,
        stars
   })

   res.status(201);
   res.json(newReview)
}
if(spot && oldReview){
    res.status(403);
    res.json({
        message: "User already has a review for this spot",
        statusCode: 403
    })
}
if(!spot){
    res.status(404);
    res.json({
        message: "Spot couldn't be found",
        statusCode: 404
    })
}
})

// GET ALL SPOTS OWNED BY THE CURRENT USER
router.get("/current", requireAuth, async (req, res) => {
    const spots = await Spot.findAll({
        where: { ownerId: req.user.id },
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

// ADD AN IMAGE TO A SPOT BASED ON THE SPOT'S ID
router.post("/:spotId/images", requireAuth, async (req, res) => {
    const { url, preview } = req.body

    const spot = await Spot.findByPk(req.params.spotId)



    if(!spot){
        res.status(404)
        res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

    if(spot.ownerId !== req.user.id){
        res.status(403)
        res.json({
            message: "Forbidden",
            statusCode: 403
        })
    }

    if(spot){
    const spotJson = spot.toJSON()
    delete spotJson.ownerId
    delete spotJson.address
    delete spotJson.city
    delete spotJson.state
    delete spotJson.country
    delete spotJson.lat
    delete spotJson.lng
    delete spotJson.name
    delete spotJson.description
    delete spotJson.price
    delete spotJson.createdAt
    delete spotJson.updatedAt


    spotJson.url = url
    spotJson.preview = preview

    res.status(200)
    res.json(spotJson)
    }
})

// CREATE A BOOKING FROM A SPOT BASED ON THE SPOT'S ID
router.post("/:spotId/bookings", requireAuth, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId)

    if(!spot){
        res.status(404)
        res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

    if(spot.ownerId === req.user.id){
        res.status(403)
        res.json({
            message: "Forbidden",
            statusCode: 403
        })
    }

    if(spot.ownerId !== req.user.id){
        const { startDate, endDate } = req.body

        const startDatetime = new Date(startDate).getTime();
        const endDatetime = new Date(endDate).getTime();
        const spotId = req.params.spotId

        if(startDatetime >= endDatetime){
            res.json({
                message: "Validation error",
                statusCode: 400,
                errors: {
                    endDate: "endDate cannot come before the startDate"
                }
            })
        }

        const Bookings = await Booking.findAll({
            where: {
                spotId: spotId
            }
        })

        let allBookings = [];

        Bookings.forEach(booking => {
            allBookings.push(booking.toJSON())
        });

        for(let booking of allBookings){
            const oldstartDatetime = new Date(booking.startDate).getTime();
            const oldendDatetime = new Date(booking.endDate).getTime();

            if(startDatetime >= oldstartDatetime && endDatetime <= oldendDatetime){
             res.status(403);
             res.json({
                 message: "Sorry, this spot is already booked for the specified dates",
                 statusCode: 403,
                 errors: {
                     startDate: "Start date conflicts with an existing booking",
                     endDate: "End date conflicts with an existing booking"
                 }
             })
            }
        }




        const newBooking = await Booking.create({
            spotId: spot.id,
            userId: req.user.id,
            startDate: startDate,
            endDate: endDate
        })
        // newBooking.spotId = spot.id
        // newBooking.userId = req.user.id

        res.status(200)
        res.json(newBooking)
    }


})

// GET ALL BOOKINGS FOR A SPOT BEASED ON THE SPOT'S ID
router.get("/:spotId/bookings", requireAuth, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId)

    if(!spot){
        res.status(404)
        res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

    if(spot.ownerId !== req.user.id){
        const allBookings = await Booking.findAll({
            where: {
                spotId: req.params.spotId
            }
        })
        const Bookings = [];
        allBookings.forEach(booking => {
            Bookings.push(booking.toJSON())
        });
        Bookings.forEach(booking => {
            delete booking.id
            delete booking.userId
            delete booking.createdAt
            delete booking.updatedAt
        });
        res.status(200)
        res.json({
            Bookings
        })
    }

    if(spot.ownerId === req.user.id){
        const allBookings = await Booking.findAll({
            where: {
                spotId: req.params.spotId
            },
            include: {
                model: User
            }
        })
        const Bookings = [];
        allBookings.forEach(booking => {
            Bookings.push(booking.toJSON())
        });
        Bookings.forEach(booking => {
            delete booking.User.username
        });
        res.status(200)
        res.json({
            Bookings
        })
    }

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
        if(req.user.id === spotToUpdate.ownerId){
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
}

if(req.user.id !== spotToUpdate.ownerId){
    res.status(403)
        res.json({
            message: "Forbidden",
            statusCode: 403
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
        res.status(403)
        res.json({
            message: "Forbidden",
            statusCode: 403
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
router.get("/", spotQueryValidator, async (req, res) => {
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query

    page = parseInt(page)
    size = parseInt(size)

    if(Number.isNaN(page)) page = 1
    if(Number.isNaN(size)) size = 20

    if(page > 10) page = 10
    if(size > 20) size = 20

    const spots = await Spot.findAll({
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ],
        limit: size,
        offset: (page - 1) * size
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
    res.json({
        Spots,
        page,
        size
    })
})




module.exports = router
