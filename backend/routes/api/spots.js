const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();


router.get("/", async (req, res) => {
    const spots = await Spot.findAll({
        attributes: {
            include
        },
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ]
    })
    return res.json({
        Spots: spots
    })
})

module.exports = router
