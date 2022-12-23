const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize')

const router = express.Router();

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

// ADD AN IMAGE TO A REVIEW BASED ON THE REVIEW'S ID
router.post("/:reviewId/images", requireAuth, async (req, res) => {
    const review = await Review.findByPk(req.params.reviewId)

    // console.log(review)
    if(review){
    const reviewObj = review.toJSON();
    if(review.userId === req.user.id){
        reviewObj.url = req.body.url

        res.status(200)
        res.json({
            id: review.id,
            url: reviewObj.url
        })
    }
}

    if(!review){
        res.status(404)
        res.json({
            message: "Review couldn't be found",
            statusCode: 404
        })
    }

    if(review.userId !== req.user.id){
        res.status(403)
        res.json({
            message: "User does not own review",
            statusCode: 403
        })
    }


    // console.log(reviewObj)
    const imgCount = await ReviewImage.findAll({
        where: {
            reviewId: req.params.reviewId
        }
    })

    // for(let key of reviewObj){
    //     if(key === url){
    //     urlCount++
    //     }
    // }

    if(imgCount >= 10){
        res.status(403);
        res.json({
            "message": "Maximum number of images for this resource was reached",
            "statusCode": 403
          })
    }
})

// EDIT A REVIEW
router.put("/:reviewId", reviewValidator, requireAuth, async (req, res) => {
    const { review, stars} = req.body;

    const editReview = await Review.findByPk(req.params.reviewId)

    if(!editReview){
        res.status(404)
        res.json({
            message: "Review couldn't be found",
            statusCode: 404
        })
    }

    if(editReview.userId !== req.user.id){
        res.status(403)
        res.json({
            message: "User does not own review",
            statusCode: 403
        })
    }

    if(editReview){
        editReview.update({
            review,
            stars
        })
        res.status(200)
        res.json(editReview)
    }

})

// GET ALL REVIEWS OF THE CURRENT USER
router.get("/current", requireAuth, async (req, res) => {
    const reviews = await Review.findAll({
        where: { userId: req.user.id },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    })

    let reviewList = [];

    reviews.forEach(review => {
        reviewList.push(review.toJSON())
    });

    for(let review of reviewList){
        // console.log(review)
        const spotImage = await SpotImage.findOne({
            where: { [Op.and]: [{preview: true}, {spotId: review.Spot.id}] }
        })
        // console.log(spotImage)
        review.Spot.previewImage = spotImage.url
        delete review.Spot.description
        delete review.Spot.createdAt
        delete review.Spot.updatedAt
    };
    res.status(200)
    res.json({
        Reviews: reviewList
    })
})

module.exports = router
