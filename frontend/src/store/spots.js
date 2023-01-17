import { csrfFetch } from "./csrf";

// TYPE
const GET_ALL_SPOTS = 'spots/getSpots'

// ACTION
const Spots = (spots) => {
    return {
        type: GET_ALL_SPOTS,
        spots
    }
}

// THUNK
export const getAllSpots = () => async (dispatch) => {
    const res = await csrfFetch('api/spots')

    if(res.ok) {
        const spots = await res.json()

        dispatch(Spots(spots))
        return res
    }
}

// REDUCER
const initialState = { all: {}, one: {} }

export const SpotsReducer = (state = initialState, action) => {
    let newState;
    let all;
    let one;
    switch (action.type) {
        case GET_ALL_SPOTS:
            const allSpots = { ...state}
            all ={}
            console.log(action.spots)
            action.spots.Spots.forEach(spot => {
                all[spot.id] = spot
            });
            allSpots.all = all
            return allSpots
        default:
            return state
    }
}
