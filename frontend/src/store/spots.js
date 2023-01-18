import { csrfFetch } from "./csrf";

// TYPE
const GET_ALL_SPOTS = 'spots/getSpots'
const GET_INDIVIDUAL_SPOT = 'spots/getSpot'

// ACTION
const getSpots = (spotsData) => {
    return {
        type: GET_ALL_SPOTS,
        spotsData
    }
}

const getSpot = (spot) => {
    return {
        type: GET_INDIVIDUAL_SPOT,
        spot
    }
}

// THUNK

// GET ALL SPOTS
export const getAllSpots = () => async (dispatch) => {
    const res = await csrfFetch('api/spots')

    if(res.ok) {
        const spots = await res.json()

        dispatch(getSpots(spots))
        return res
    }
}

// GET SPECIFIC SPOT
export const getIndivSpot = (spotId) => async (dispatch) => {
    const res =  await csrfFetch(`/api/spots/${spotId}`)

    if(res.ok) {
        const data = await res.json()

        dispatch(getSpot(data))
        return res
    }
}




// REDUCER
const initialState = { all: {}, indiv: {} }

export const SpotsReducer = (state = initialState, action) => {
    let newState;
    let all;
    let indiv;
    switch (action.type) {
        case GET_ALL_SPOTS:
            const allSpots = { ...state}
            all = {}
            // console.log(action.spots)
            action.spotsData.Spots.forEach(spot => {
                all[spot.id] = spot
            });
            allSpots.all = all
            return allSpots

        case GET_INDIVIDUAL_SPOT:
            newState = { ...state}
            indiv = { ...action.spot}
            // console.log(indiv)
            let lastName = indiv.Owner.lastName
            let firstName = indiv.Owner.firstName
            let url = indiv.SpotImages[0].url || null

            indiv["firstName"] = firstName
            indiv["lastName"] =lastName
            indiv["url"] = url

            newState.indiv = indiv
            return newState
        default:
            return state
    }
}
