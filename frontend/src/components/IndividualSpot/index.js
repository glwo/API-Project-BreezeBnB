import { getIndivSpot } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import './IndividualSpot.css'
import { useParams } from "react-router-dom";

const IndividualSpot = () => {
    const spotObj = useSelector(state => state.spots.indiv)
    const { id } = useParams()

    console.log(spotObj)

    // let spot = [];
    // if(spotObj){
    //     spot = Object.values(spotObj)
    // }

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getIndivSpot(id))
    }, [dispatch])

    if(!spotObj) return null

    return (
        <div>
            {spotObj &&
            <div className="spotDetails">
                <div>
                    <h2>{spotObj.name}</h2>
                </div>
                <div className="spotImgBox">
                    <div>
                        <img src={spotObj.SpotImages[0].url} alt="No image available for this spot!"></img>
                    </div>
                </div>
                <div className="spotOwnerDesc">
                    <h3>Property hosted By {spotObj.Owner.firstName} {spotObj.Owner.lastName}</h3>
                    <h4>The Space</h4>
                    <p>{spotObj.address}</p>
                    <p>{spotObj.description}</p>
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
                                {spotObj.avgRating} · {spotObj.numReviews}
                            </p>
                        </div>
                    </fieldset>
                </div>
            </div>
            }
        </div>
    )
}

export default IndividualSpot
