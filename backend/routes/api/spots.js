const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();


router.get("/", async (req, res) => {
    const spots = await Spot.findAll({ raw:true })

    for(let spot of spots){
        const avgRating = await Review.findAll({
            where: {
                spotId: spot.id
            },
            attributes: {
                include: [
                    [
                        sequelize.fn("AVG", sequelize.col("stars")), "avgRating"
                    ]
                ]
            },
            raw: true
        })
        const previewImage = await SpotImage.findAll({
            where: {
                spotId: spot.id
            },
            attributes: ['url']
        })
        spot.avgRating = avgRating[0].avgRating;
        spot.previewImage = previewImage[0].url
    }

    return res.json({
        Spots: spots
    })
})

module.exports = router
