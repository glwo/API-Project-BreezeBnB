import { getAllSpots, deleteIndivSpot, createSpot } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import './ProfilePage.css'
import { useModal, Modal } from "../../context/Modal";
import { thunkGetUserBookings } from "../../store/bookings";
import { getAllReviews } from "../../store/reviews";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";


const ProfilePage = () => {
    const spotsObj = useSelector(state => state.spots.all);
    const sessionUser = useSelector((state) => state.session.user);
    const bookings = useSelector((state) => state.bookings.user);
    const reviews = useSelector((state) => state.reviews.allReviews)
    const [showMenu, setShowMenu] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false)

    const userSpots = Object.values(spotsObj).filter(spot => spot?.ownerId == sessionUser?.id)
    // const userReviews = Object.values(reviews).filter(review => review?.user_id == sessionUser?.id)
    const { closeModal } = useModal();

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    const closeMenu = () => setShowMenu(false);

    let bookingsArray
    if (bookings) {
        bookingsArray = Object.values(bookings);
    }

    let spots = [];
    if(spotsObj){
        spots = Object.values(spotsObj)
    }

    // let userSpots = spots.filter(loggedin)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(thunkGetUserBookings(sessionUser.id))
        dispatch(getAllSpots())
        setIsLoaded(true)
        // dispatch(getAllReviews())
    }, [dispatch, isLoaded])

    if (!bookingsArray) return null;

    if (!spotsObj) return null

    if (!sessionUser) return null

    if (!bookings) {
        return (
        <div className="UserBookings-container">
            <h1 className="UserBookings-header">Trips</h1>
            <div className="UserBookings-no-trips-container">
                <h2 className="UserBookings-secondary-header">
                    No trips
                </h2>
            </div>
        </div>
        )
    }

    function reformatDateString(dateString) {
        // Split the date string into an array of [year, month, day]
        const dateComponents = dateString.split('-');

        // Reassemble the components in the desired format: [day, month, year]
        const reformattedDate = dateComponents[2] + '-' + dateComponents[1] + '-' + dateComponents[0];

        return reformattedDate;
    }

    // console.log(reformatDateString(bookings[0].startDate.slice(0, 10)))



    return (
        <div>
            <h1>Welcome, {sessionUser.firstName}</h1>
            <div className="userBookings-container">
            <h2 className="userBookings-trips">Your Trips</h2>
            {bookings && bookingsArray.map(booking => (
                <div className="booking-card" key={booking.id}>
                    <div className="booking-card-left">
                        <div className="booking-spot-name">{booking.Spot.name}</div>
                        <div className="booking-spot-address">{booking.Spot.address}</div>
                        <div className="booking-spot-city-country">{booking.Spot.city}, {booking.Spot.country}</div>
                        <div className="booking-start">From: {reformatDateString(booking.startDate.slice(0, 10))}</div>
                        <div className="booking-end">To: {reformatDateString(booking.endDate.slice(0,10))}</div>
                        <div className="booking-buttons">
                            {/* <div className="edit-booking">Edit</div> */}

                            <div className="delete-booking">
                            <OpenModalMenuItem
                            itemText="Delete"
                            onItemClick={closeMenu}
                            // modalComponent={< DeleteBookingForm bookingId={booking.id}
                            // />}
                            />
                            </div>
                        </div>
                    </div>
                    <div className="booking-card-right">
                        {spotsObj[booking.Spot.id].previewImage === "No preview image available" ? (
                            <img className="booking-card-img" src="https://i.pinimg.com/736x/e1/1d/4c/e11d4cdb0e95e4338908d8579784a906--el-dragon-dragon-art.jpg" />
                        ) : (
                            <img className="booking-card-img" src={spotsObj[booking.Spot.id].previewImage} />
                        )}
                    </div>
                </div>
            ))}
        </div>
        <div className="spots-Box">
            {userSpots.map(spot => {
                return (
                    <div className="spot-Card">
                        <nav>
                            <NavLink className="navBar" to={`/Spots/${spot.id}`}>
                                <div>
                                    <img className="spotImgDiv" src={`${spot.previewImage}`} alt={"Image couldn't be retrieved"}></img>
                                </div>
                                <div>
                                    <div id='spot-name-rating-div'>
                                        <h4 id="spotName">
                                            {spot.name}
                                        </h4>
                                        <i id="starIcon" class="fa-sharp fa-solid fa-star"></i>
                                        {(+spot.avgRating).toFixed(2)}
                                    </div>
                                    <div className="spotRating">
                                    <h4 >

                                    </h4>
                                    </div>
                                </div>
                                <p className="spotLocation">
                                    {spot.city}, {spot.state}
                                </p>
                                <h4>
                                    ${spot.price} night
                                </h4>
                            </NavLink>
                        </nav>
                    </div>
                )
            })}
        </div>
        </div>
    )
}

export default ProfilePage
