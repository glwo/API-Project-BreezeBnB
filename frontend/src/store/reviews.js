import { useParams } from "react-router-dom";
import { csrfFetch } from "./csrf";
import { getIndivSpot } from "./spots";

// TYPE
const CREATE_REVIEW = 'reviews/createReview'
const GET_REVIEWS = 'reviews/getReviews'
const DELETE_REVIEW = 'reviews/deleteReview'
const GET_REVIEWS_BY_USER = 'reviews/getReviewsByUser'
const EDIT_REVIEW = 'review/EDIT_REVIEW'


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

export const editReview = (reviewId, review) => {
    return {
        type: EDIT_REVIEW,
        reviewId,
        review
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
        dispatch(getIndivSpot(spotId))
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
        const newReview = await res.json()
        dispatch(buildReview(newReview))
        dispatch(getAllReviews(id))
        // dispatch(getIndivSpot(id))
    }
    return res
}

export const thunkEditReview = (reviewId, review) => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review)
    })

    if (res.ok) {
        const editedReview = await res.json();
        dispatch(editReview(reviewId, review));
        return editedReview;
    }
}

export const deleteReview = (id) => async (dispatch) => {
 const res = await csrfFetch (`/api/reviews/${id}`, {
    method: 'DELETE'
 })
 if(res.ok){
    const remainingReviews = await res.json()
    // console.log(remainingReviews)
    dispatch(removeReview(id))
    // dispatch(getAllReviews(spotId))
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

        case CREATE_REVIEW:
            newState = { ...state}
            const newReview = action.newReview
            newState.spotReviews[newReview.id] = newReview
            return newState

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

        case EDIT_REVIEW: {
            const newState = { ...state }
            newState.spotReviews = { ...state.spotReviews, [action.reviewId]: action.review }
            newState.userReviews = { ...state.userReviews, [action.reviewId]: action.review }
            return newState
        }

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
