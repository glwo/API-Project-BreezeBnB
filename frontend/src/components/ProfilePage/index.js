import { getAllSpots, deleteIndivSpot, createSpot } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import './ProfilePage.css'
import { useModal, Modal } from "../../context/Modal";
import { thunkLoadUserBookings} from "../../store/bookings";
import { getAllReviews } from "../../store/reviews";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteBookingModal from "../DeleteBookingModal";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";


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
    const history = useHistory();

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
        dispatch(thunkLoadUserBookings(sessionUser.id))
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

    const onClick = (spotId) => {
        history.push(`/spots/${spotId}`);
      };

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
            <div className="UserNameTrips">
            <h1>Welcome, {sessionUser.firstName}.</h1>
            <h2 className="userBookings-trips">Your Trips</h2>
            </div>
            <div className="userBookings-container">
            {bookings && bookingsArray.map(booking => (
                <div className="booking-card" key={booking.id}>
                    <div className="booking-card-left">
                        <div className="booking-spot-name">{booking.Spot?.name}</div>
                        <div className="booking-spot-address">{booking.Spot?.address}</div>
                        <div className="booking-spot-city-country">{booking.Spot?.city}, {booking.Spot?.country}</div>
                        <div className="booking-start">From: {reformatDateString(booking.startDate.slice(0, 10))}</div>
                        <div className="booking-end">To: {reformatDateString(booking.endDate.slice(0,10))}</div>
                        <div className="booking-buttons">
                            {/* <div className="edit-booking">Edit</div> */}

                            <div className="delete-booking">
                            <OpenModalMenuItem
                            itemText="Delete"
                            onItemClick={closeMenu}
                            modalComponent={< DeleteBookingModal bookingId={booking.id}
                            />}
                            />
                            </div>
                        </div>
                    </div>
                    <div className="booking-card-right">
                        {spotsObj[booking.Spot?.id]?.previewImage === "No preview image available" ? (
                            <img className="booking-card-img" src="https://image.shutterstock.com/image-photo/luxurious-new-construction-home-bellevue-260nw-555325381.jpg" />
                        ) : (
                            <img className="booking-card-img" src={spotsObj[booking.Spot?.id]?.previewImage} />
                        )}
                    </div>
                </div>
            ))}
        </div>
        <div className="UserNameTrips">
            <h2 className="userBookings-trips">Your properties, thank you for hosting with BreezeBnB!</h2>
            </div>
        <div className="spots-Box">
        {userSpots &&
        userSpots.map((spot) => (
          <div
            key={spot.id}
            className="spot-card"
            onClick={() => onClick(spot.id)}
          >
            <div className="spot-img">
              <img
                className="spot-previewimg"
                src={spot.previewImage}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://i.pinimg.com/originals/81/45/ef/8145efce2fec5157c6700e46ba14abb0.jpg";
                }}
                onClick={() => onClick(spot.id)}
              />
            </div>
            <div className="spot-card-bottom">
              <div className="spot-card-header">
                <p className="spot-location">
                {spot.name}
                </p>
                <p className="spot-rating">
                  {(+spot.avgRating).toFixed(2) !== "0.00" ? (
                    <>
                      <i className="fa-solid fa-star" id="star"></i>{" "}
                      {(+spot.avgRating).toFixed(2)}
                    </>
                  ) : (
                    <>
                    <i className="fa-solid fa-star" id="star"></i>
                    New
                    </>
                  )}
                </p>
              </div>
              <div className="spot-card-middle">
                <p className="spot-name">{spot.city}, {spot.state}</p>
              </div>
              <div className="spot-card-footer">
                <p className="spot-price">${spot.price}</p>
                <p className="per-night">night</p>
              </div>
            </div>
          </div>
        ))}
        </div>
        </div>
    )
}

export default ProfilePage
