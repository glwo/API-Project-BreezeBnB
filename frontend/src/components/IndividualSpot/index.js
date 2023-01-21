import { getAllSpots, getIndivSpot } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import './IndividualSpot.css'
import { useParams, useHistory } from "react-router-dom";
import { deleteIndivSpot } from "../../store/spots";
import { getAllReviews, deleteReview } from "../../store/reviews";
import CreateReviewModal from "../CreateReviewForm";


const IndividualSpot = () => {
    const spotObj = useSelector(state => state.spots.indiv)
    const { id } = useParams()
    const history = useHistory()
    const loggedInUser = useSelector(state => state.session.user)
    const spotReviews = useSelector(state => state.reviews.spotReviews)
    const spotReviewsArr = Object.values(spotReviews)

    // console.log(spotReviews)

    // console.log(spotObj)
    // console.log(loggedInUser)

    // let spot = [];
    // if(spotObj){
    //     spot = Object.values(spotObj)
    // }

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getIndivSpot(+id))
        dispatch(getAllReviews(+id))
        // dispatch(deleteReview())
    }, [dispatch, id])


    const deleteSpot = async (e) => {
        e.preventDefault()

        const deleteSuccess = dispatch(deleteIndivSpot(id))

        if(deleteSuccess){
            history.push('/')
        }
        else {
            console.log('error deleting spot')
        }
    }

    const updateSpot = async(e) => {
        e.preventDefault()
        history.push(`/spots/${spotObj.id}/update`)
    }

    const createReview = async (e) => {
        e.preventDefault()
        history.push(`/spots/${spotObj.id}/createReview`)
    }

    // const triggerReviewDelete = async (e) => {
    //     e.preventDefault()

    //     const deleteSuccess = dispatch(deleteReview())
    // }

    if(!spotObj) return null

    return (
        <div>
            {spotObj &&
            <div className="spotDetails">
                <div >
                    <h2>{spotObj.name}</h2>
                </div>
                    <div className="spotImg">
                        <img src={spotObj.url} alt="No image available for this spot!"></img>
                    </div>
                <div className="spotOwnerDesc">
                    <h3>Property hosted By {spotObj.firstName} {spotObj.lastName}</h3>
                    <h4>The Space</h4>
                        <p>{spotObj.address}</p>
                        <p>{spotObj.description}</p>
                </div>
                <div>
                    <h2>Reviews</h2>
                    {spotReviewsArr.length > 0 && (<div className="review-container">
                        {spotReviewsArr.map(review => {
                            return (
                                <div key={review.id} className='indiv-review'>
                                    <div className="review-name">
                                    <h5><i class="fa-solid fa-user"></i>{review.User?.firstName}</h5>
                                    </div>
                                    {review.review}
                                    <div>
                                    <button className="delReviewButton"
                                    onClick={() => dispatch(deleteReview(review.id)).then(dispatch(getAllReviews(spotObj.id)))}
                                    hidden={(loggedInUser && loggedInUser?.id === review.User?.id ? false : true)}>
                                        Delete Your Review
                                    </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>)}
                    {!spotReviewsArr.length && (<p> There are currently no reviews for this location </p>)}
                </div>
                <div>
                    <fieldset>
                        <div className="price">
                            <h2>
                                $ {spotObj.price} night
                            </h2>
                        </div>
                        <div className="ratingandreviews">
                            <p>
                            <i class="fa-sharp fa-solid fa-star"></i>
                                {(+(spotObj.avgStarRating)).toFixed(2)} · {spotObj.numReviews} reviews
                            </p>
                        </div>
                        <button className="spotButtons" onClick={createReview} hidden={(loggedInUser && loggedInUser.id !== spotObj.ownerId ? false : true)}>
                            Add A Review
                        </button>
                        <button className="spotButtons" onClick={updateSpot} hidden={(loggedInUser && loggedInUser.id === spotObj.ownerId ? false : true)}>
                            Update Spot
                        </button>
                        <button className="spotButtons"
                        onClick={() => dispatch(deleteIndivSpot(id)).then(dispatch(getAllSpots())).then(history.push("/"))}
                        hidden={(loggedInUser && loggedInUser.id === spotObj.ownerId ? false : true)}>
                            Delete Spot
                        </button>
                    </fieldset>
                </div>
            </div>
            }
        </div>
    )
}

export default IndividualSpot
