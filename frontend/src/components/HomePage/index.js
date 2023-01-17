import { getAllSpots } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import './homePage.css'

const HomePage = () => {
    const spotsObj = useSelector(state => state.spots.all)

    let spots = [];
    if(spotsObj){
        spots = Object.values(spotsObj)
    }
    // console.log(spotsObj)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch])

    if(!spotsObj) return null

    return (
        <div className="spots-Box">
            {spots.map(spot => {
                return (
                    <div className="spot-Card">
                        <nav>
                            <NavLink className="navBar" to={`/Spots/${spot.id}`}>
                                <div>
                                    <img className="spotImgDiv" src={`${spot.previewImage}`} alt={spot.name}></img>
                                </div>
                                <div>
                                    <h4 className="spotDetails">
                                        {spot.name}
                                    </h4>
                                    <h4>
                                        {spot.avgRating}
                                    </h4>
                                </div>
                                <p>
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
    )
}

export default HomePage
