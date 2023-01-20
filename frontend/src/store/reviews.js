import { csrfFetch } from "./csrf";
import { getIndivSpot } from "./spots";

// TYPE
const CREATE_REVIEW = 'reviews/createReview'
const GET_REVIEWS = 'reviews/getReviews'
const DELETE_REVIEW = 'reviews/deleteReview'
const GET_REVIEWS_BY_USER = 'reviews/getReviewsByUser'


// ACTION
const getReviews = (data) => {
    return {
        type: GET_REVIEWS,
        data
    }
}

const buildReview = (newReview) => {
    return {
        type: CREATE_REVIEW,
        newReview
    }
}

const removeReview = (review) => {
    return {
        type: DELETE_REVIEW,
        review
    }
}

// const getReviewsByUser = (reviews) => {
//     return {
//         type: GET_REVIEWS_BY_USER,
//         reviews
//     }
// }


// THUNK
export const getAllReviews = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`)

    if(res.ok){
        const reviewData = await res.json()

        dispatch(getReviews(reviewData))
        return reviewData
    }
}

export const createReview = (payload) => async (dispatch) => {
    const {
        id,
        stars,
        review
        } = payload

    const res = await csrfFetch(`/api/spots/${id}/reviews` , {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            review,
            stars
        })
    })

    if(res.ok){
        dispatch(getAllReviews(id))
        dispatch(getIndivSpot(id))
    }
    return res
}

export const deleteReview = (id, spotId) => async (dispatch) => {
 const res = await csrfFetch (`/api/reviews/${id}`, {
    method: 'DELETE'
 })
 if(res.ok){
    const remainingReviews = await res.json()
    dispatch(removeReview(id))
    // dispatch(getAllReviews())
    return remainingReviews
 }
}

// REDUCER

const initialState = { spotReviews: {}, userReviews: {}}

export const ReviewsReducer = (state = initialState, action) => {
    let newState;
    let spotReviews;
    switch (action.type) {

        case GET_REVIEWS:
            newState = { ...state}
            spotReviews = {}
            // console.log(action.data.Reviews)
            // const AllReviews = action.data.Reviews
            action.data.Reviews.forEach(review => {
                spotReviews[review.id] = review
            });
            // AllReviews.forEach(review => {
            //     spotReviews[review.id] = review
            // });
            // newState['spotReviews'] = { ...spotReviews}
            newState.spotReviews = spotReviews
            return newState

        case DELETE_REVIEW:
            newState = { ...state}

            const deleteAction = action.review

            // delete newState.spotReviews[action.review]
            delete newState.spotReviews[deleteAction]

            return newState

        default:
            return state
    }
}
