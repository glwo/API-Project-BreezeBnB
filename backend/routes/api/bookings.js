const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');
const e = require('express');

const router = express.Router();

// DELETE A BOOKING
router.delete("/:bookingId", requireAuth, async (req, res) => {
    const bookingToDelete = await Booking.findByPk(req.params.bookingId)


    if(bookingToDelete){
        if(req.user.id === bookingToDelete.userId){
            const  startDate  = bookingToDelete.startDate
            const startDatetime = new Date(startDate).getTime();
            const now = new Date().getTime();
            // console.log(now)
            // console.log(startDatetime)
            if(now >= startDatetime){
                res.status(403)
                res.json({
                    message: "Bookings that have been started can't be deleted",
                    statusCode: 403
                })
            } else {

            await bookingToDelete.destroy()

            res.status(200);
            res.json({
                message: "Successfully deleted",
                statusCode: 200
            })
         }
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
            message: "Booking couldn't be found",
            statusCode: 404
        })
    }
})

// EDIT A BOOKING
router.put("/:bookingId", requireAuth, async (req, res) => {
    const editBooking = await Booking.findByPk(req.params.bookingId)


    if(!editBooking){
        res.status(404)
        res.json({
            message: "Booking couldn't be found",
            statusCode: 404
        })
    }
    if(editBooking.userId !== req.user.id){
        res.status(403)
        res.json({
            message: "Forbidden",
            statusCode: 403
        })
    }

    if(editBooking){
        const { startDate, endDate } = req.body
        const startDatetime = new Date(startDate).getTime();
        const endDatetime = new Date(endDate).getTime();
        const now = new Date().getTime();
        const spotId = editBooking.spotId

        if(startDatetime >= endDatetime){
            res.json({
                message: "Validation error",
                statusCode: 400,
                errors: {
                    endDate: "endDate cannot come before the startDate"
                }
            })
        }

        if(now >= endDatetime){
        res.json({
            message: "Past bookings can't be modified",
            statusCode: 403
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

        //    else if(startDatetime >= oldstartDatetime){
        //     res.status(403);
        //     res.json({
        //         message: "Sorry, this spot is already booked for the specified dates",
        //         statusCode: 403,
        //         errors: {
        //             startDate: "Start date conflicts with an existing booking"
        //         }
        //     })
        //    }

        //    else if(endDatetime <= oldendDatetime){
        //     res.status(403);
        //     res.json({
        //         message: "Sorry, this spot is already booked for the specified dates",
        //         statusCode: 403,
        //         errors: {
        //             endDate: "End date conflicts with an existing booking"
        //         }
        //     })
        //    }
        }



        await editBooking.update({
            startDate,
            endDate
        })
        res.status(200);
        res.json(editBooking)
    }
})

// GET ALL OF THE CURRENT USER'S BOOKINGS
router.get("/current", requireAuth, async (req, res) => {
    const allBookings = await Booking.findAll({
        where: { userId: req.user.id },
        // attributes: ['userId', 'startDate', 'endDate', 'createdAt', 'updatedAt'],
        include:
            {
                model: Spot
            }

    })

    let Bookings = [];
    let allBookingsJSON = []

    allBookings.forEach(booking => {
        allBookingsJSON.push(booking.toJSON())
    });
    console.log(allBookingsJSON)
    // console.log(allBookings)
    for(let booking of allBookingsJSON){

        const imgPreview = await Spot.findByPk(booking.spotId, {
            include: [
                {
                    model: SpotImage,
                    attributes: ['url'],
                    where: {
                        preview: true
                    }
                }
            ]
        })
        console.log(imgPreview)

        let getUrl = imgPreview.toJSON();
        // console.log(getUrl)
        let imgUrl = getUrl.SpotImages[0];
        // console.log(imgUrl)
        allBookings.forEach(booking => {
            Bookings.push(booking.toJSON())
        });

        Bookings.forEach(booking => {
            booking.Spot.previewImage = imgUrl.url

            delete booking.Spot.description
            delete booking.Spot.createdAt
            delete booking.Spot.updatedAt

        })
    }
    res.status(200);
    res.json({
        Bookings
    })
})



module.exports = router
