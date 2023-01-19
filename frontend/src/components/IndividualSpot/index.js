import { getIndivSpot } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import './IndividualSpot.css'
import { useParams, useHistory } from "react-router-dom";
import { deleteIndivSpot } from "../../store/spots";


const IndividualSpot = () => {
    const spotObj = useSelector(state => state.spots.indiv)
    const { id } = useParams()
    const history = useHistory()
    const loggedInUser = useSelector(state => state.session.user)

    // console.log(spotObj)
    // console.log(loggedInUser)

    // let spot = [];
    // if(spotObj){
    //     spot = Object.values(spotObj)
    // }

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getIndivSpot(id))
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
                        <img src={spotObj.url} alt="No image available for this spot!"></img>
                    </div>
                </div>
                <div className="spotOwnerDesc">
                    <h3>Property hosted By {spotObj.firstName} {spotObj.lastName}</h3>
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
                                {spotObj.avgStarRating} · {spotObj.numReviews} reviews
                            </p>
                        </div>
                        <button className="spotButtons" onClick={updateSpot} hidden={(loggedInUser && loggedInUser.id === spotObj.ownerId ? false : true)}>
                            Update Spot
                        </button>
                        <button className="spotButtons" onClick={deleteSpot} hidden={(loggedInUser && loggedInUser.id === spotObj.ownerId ? false : true)}>
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
