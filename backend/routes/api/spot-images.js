const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize')

const router = express.Router();

// DELETE A SPOT IMAGE
router.delete("/:imageId", requireAuth, async(req, res) => {
    const spotImage = await SpotImage.findByPk(req.params.imageId)

    if(!spotImage){
        res.status(404)
        return res.json({
            message: "Spot Image couldn't be found",
            statusCode: 404
        })
    }

    const spot = await Spot.findByPk(spotImage.spotId)

    if(spot.ownerId !== req.user.id){
        res.status(403)
        res.json({
            message: "Forbidden",
            statusCode: 403
        })
    }

    if(spotImage && spot.ownerId === req.user.id){
        await spotImage.destroy()

        res.status(200)
        res.json({
            message: "Successfully deleted",
            statusCode: 200
        })
    }
})

module.exports = router
