import { createSpot, getAllSpots, getIndivSpot } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import "./IndividualSpot.css";
import { useParams, useHistory } from "react-router-dom";
import { deleteIndivSpot } from "../../store/spots";
import { getAllReviews, deleteReview } from "../../store/reviews";
import { thunkLoadSpotBookings, thunkLoadUserBookings } from "../../store/bookings";
import CreateReviewModal from "../CreateReviewForm";
import UpdateReviewModal from "../UpdateReviewModal";
import OpenModalButton from "../OpenModalButton";
import CreateBookingsBox from "../CreateBookingBox";

const IndividualSpot = () => {
  const spotObj = useSelector((state) => state.spots.indiv);
  const { id } = useParams();
  let spotId = id;
  const history = useHistory();
  const loggedInUser = useSelector((state) => state.session.user);
  const spotReviews = useSelector((state) => state.reviews.spotReviews);
  const spotBookings = useSelector((state) => state.bookings.spot);
  const spotReviewsArr = Object.values(spotReviews);
  const spotBookingsArr = Object.values(spotBookings)
  // console.log(spotBookingsArr)
  //   let spotId;

  const checkReviews = function (currentUser, userReviews) {
    for (let userReview of userReviews) {
      if (userReview.userId === currentUser.id) {
        return false;
      }
    }
    return true;
  };

  // console.log(spotReviews)

  // console.log(spotObj)
  // console.log(loggedInUser)

  // let spot = [];
  // if(spotObj){
  //     spot = Object.values(spotObj)
  // }

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getIndivSpot(+id));
    dispatch(getAllReviews(+id));
    dispatch(thunkLoadSpotBookings(+spotId))
    // dispatch(deleteReview())
    // dispatch(createSpot())
  }, [dispatch, id, spotId]);

  // const deleteSpot = async (e) => {
  //     e.preventDefault()

  //     const deleteSuccess = dispatch(deleteIndivSpot(id))

  //     if(deleteSuccess){
  //         history.push('/')
  //     }
  //     else {
  //         console.log('error deleting spot')
  //     }
  // }

  const updateSpot = async (e) => {
    e.preventDefault();
    history.push(`/spots/${spotObj.id}/update`);
  };

  const createReview = async (e) => {
    e.preventDefault();
    history.push(`/spots/${spotObj.id}/createReview`);
  };

  // const triggerReviewDelete = async (e) => {
  //     e.preventDefault()

  //     const deleteSuccess = dispatch(deleteReview())
  // }

  if (!spotObj) return null;

  return (
    <div className="spotRootDiv">
      {spotObj && (
        <div className="spotDetails">
          <div id="spot-details-inner">
            <div>
              <h2>{spotObj.name}</h2>
              <p id="spot-address">{spotObj.address}</p>
            </div>
            <img
              id="spotImg"
              src={spotObj.url}
              alt="No image available for this spot!"
            ></img>
            <div className="spotOwnerDesc">
              <h3>
                Property hosted By {spotObj.firstName} {spotObj.lastName}
              </h3>
              <h4>The Space</h4>
              <p>{spotObj.description}</p>
            </div>
            <div id="page-bottom-container">
              <div className="review-container">
                <h3>Reviews</h3>
                {spotReviewsArr.length > 0 &&
                  spotReviewsArr.map((review) => {
                    return (
                      <div key={review.id} className="indiv-review">
                        <div className="review-name">
                          <h5>
                            <i class="fa-solid fa-user"></i>
                            {review.User?.firstName}
                          </h5>
                        </div>
                        {review.review}
                        <div className="editDelRevButton">
                          <div>
                            <button
                              className="delReviewButton"
                              onClick={() =>
                                dispatch(deleteReview(review.id)).then(
                                  dispatch(getAllReviews(spotObj.id))
                                )
                              }
                              hidden={
                                loggedInUser &&
                                loggedInUser?.id === review.User?.id
                                  ? false
                                  : true
                              }
                            >
                              <i class="fa-solid fa-trash"></i> Delete
                            </button>
                          </div>
                          {loggedInUser &&
                          review.User?.id == loggedInUser.id ? (
                            <div>
                              <OpenModalButton
                                buttonText={
                                  <>
                                    <i class="fa-regular fa-pen-to-square"></i>{" "}
                                    Update
                                  </>
                                }
                                modalComponent={
                                  <UpdateReviewModal
                                    key={review.id}
                                    reviewDetails={review}
                                  />
                                }
                              />
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
              {!spotReviewsArr.length && (
                <p> There are currently no reviews for this location </p>
              )}

              <div id="spot-information">
                <div className="priceandReviews">
                <div className="price">
                  <h2>$ {spotObj.price} night</h2>
                </div>
                <div className="ratingandreviews">
                  <p>
                    <i class="fa-sharp fa-solid fa-star"></i>
                    {(+spotObj.avgStarRating).toFixed(2)} · {spotObj.numReviews}{" "}
                    review(s)
                  </p>
                </div>
                </div>
                {/* <div
                hidden={
                  loggedInUser &&
                  loggedInUser.id !== spotObj.ownerId
                    ? false
                    : true
                }> */}
                  <CreateBookingsBox />
                {/* </div> */}
                <div>
                  <button
                    className="spotButtons"
                    onClick={createReview}
                    hidden={
                      loggedInUser &&
                      loggedInUser.id !== spotObj.ownerId &&
                      checkReviews(loggedInUser, spotReviewsArr)
                        ? false
                        : true
                    }
                  >
                    Add A Review
                  </button>
                </div>
                <div className="updateSpotButton" hidden={
                      loggedInUser && loggedInUser.id === spotObj.ownerId
                        ? false
                        : true
                    }>
                  <button
                    className="spotButtons"
                    onClick={updateSpot}
                  >
                    Update Spot
                  </button>
                </div>
                <div>
                  <button
                    className="spotButtons"
                    onClick={() =>
                      dispatch(deleteIndivSpot(id))
                        .then(dispatch(getAllSpots()))
                        .then(history.push("/"))
                    }
                    hidden={
                      loggedInUser && loggedInUser.id === spotObj.ownerId
                        ? false
                        : true
                    }
                  >
                    Delete Spot
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndividualSpot;
