import { csrfFetch } from "./csrf";

// TYPE
const GET_ALL_SPOTS = 'spots/getSpots'
const GET_INDIVIDUAL_SPOT = 'spots/getSpot'
// const UPDATE_SPOT = 'spots/updateSpot'
const DELETE_SPOT = 'spots/deleteSpot'

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

// const updateSpot = (spot) => {
//     return {
//         type: UPDATE_SPOT,
//         spot
//     }
// }

const deleteSpot = (spot) => {
    return {
        type: DELETE_SPOT,
        spot
    }
}

// THUNK

// CREATE A SPOT
export const createSpot = (spotToCreate) => async (dispatch) => {
    const {
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
        imageUrl
        } = spotToCreate
    const newSpot = await csrfFetch('/api/spots', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            address,
            city,
            state,
            country,
            lat: 37.62,
            lng: 42.53,
            name,
            description,
            price
        })
    })
    if(newSpot.ok){
        const newSpotJSON = await newSpot.json();

        // console.log(newSpotJSON)

        const imgData = {
            id: newSpotJSON.id,
            url: imageUrl
        }
        await dispatch(createSpotImage(imgData))
    }
    return newSpot
}

// CREATE A SPOT IMAGE
export const createSpotImage = (spotImage) => async (dispatch) => {
    const {
        id,
        url
        } = spotImage

        // console.log(imageUrl)

        const postImage = await csrfFetch(`/api/spots/${id}/images`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                url,
                preview: true
            })
        })

        if (postImage.ok){
            await dispatch(getIndivSpot(id))
        }
}

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
        const spot = await res.json()

        dispatch(getSpot(spot))
        return res
    }
}

// UPDATE A SPOT
export const updateIndivSpot = (spotToUpdate) => async (dispatch) => {
    const {
        id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
        } = spotToUpdate
    const updatedSpot = await csrfFetch(`/api/spots/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        })
    })
    return updatedSpot
}

// DELETE A SPOT
export const deleteIndivSpot = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: "DELETE"
    })

    if(res.ok){
        const newSpots = await csrfFetch('/api/spots')
        if(newSpots.ok){
            const remainingSpots = await newSpots.json()
            dispatch(deleteSpot(remainingSpots))
        }
        return res.json()
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

        case DELETE_SPOT:
            newState = { ...state}
            all = {}
            action.spotsData.Spots.forEach(spot => {
                all[spot.id] = spot
            });
            newState.all = all
            return newState

        default:
            return state
    }
}
