import { csrfFetch } from "./csrf";
import { getIndivSpot } from "./spots";

// TYPE
const GET_REVIEWS = 'reviews/spot'
const REFRESH_REVIEWS = 'reviews/refreshReviews'

// ACTION
const getReviews = (data) => {
    return {
        type: GET_REVIEWS,
        data
    }
}

export const refreshReviews = () => {
    return {
        type: REFRESH_REVIEWS,
        data: {}
    }
}


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

export const deleteReview = (id) => async (dispatch) => {

}

// REDUCER

const initialState = { spotReviews: {}, userReviews: {} }

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

        case REFRESH_REVIEWS:
            newState = { ...state}
            spotReviews = { ...action.data}
            newState.spotReviews = spotReviews
            return newState
        default:
            return state
    }
}
