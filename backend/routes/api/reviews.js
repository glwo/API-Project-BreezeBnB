const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize')

const router = express.Router();

// GET ALL REVIEWS OF THE CURRENT USER
router.get("/current", async (req, res) => {
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
