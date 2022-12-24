const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize')

const router = express.Router();

// DELETE A REVIEW IMAGE
router.delete("/:imageId", requireAuth, async (req, res) => {
    const reviewImage = await ReviewImage.findByPk(req.params.imageId)

    if(!reviewImage){
        res.status(404)
        res.json({
            message: "Review Image couldn't be found",
            statusCode: 404
        })
    }

    const review = await Review.findByPk(reviewImage.reviewId)

    if(review.userId !== req.user.id){
        res.status(403)
        res.json({
            message: "Forbidden",
            statusCode: 403
        })
    }

    if(reviewImage && review.userId === req.user.id){
        await reviewImage.destroy()

        res.status(200)
        res.json({
            message: "Successfully deleted",
            statusCode: 200
        })
    }
})

module.exports = router
