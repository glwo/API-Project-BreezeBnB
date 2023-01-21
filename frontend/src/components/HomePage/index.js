import { getAllSpots, deleteIndivSpot, createSpot } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import './homePage.css'
import CreateSpotButton from "./CreateSpotButton";
import CreateSpotModal from "../CreateSpotModal";
import { useModal, Modal } from "../../context/Modal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";


const HomePage = () => {
    const spotsObj = useSelector(state => state.spots.all)

    // const [modalToggle, setModalToggle] = useState(false)
    const { closeModal } = useModal();


    let spots = [];
    if(spotsObj){
        spots = Object.values(spotsObj)
    }
    // console.log(spotsObj)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllSpots())
        dispatch(createSpot())
    }, [dispatch])

    // useEffect(() => {
    //     dispatch(deleteIndivSpot())
    // }, [dispatch])

    // useEffect(() => {
    //     dispatch(createSpot())
    // }, [dispatch])

    if(!spotsObj) return null

    return (
        <div>
            {/* <button onClick={() => setModalToggle(true)}>
                Create a Spot
            </button> */}
            {/* {modalToggle && ( <Modal modalContent={<CreateSpotModal></CreateSpotModal>}>
            <CreateSpotModal setModalToggle={setModalToggle}/>
            </Modal>
            )} */}
        {/* <div className="create-spot">
         <OpenModalMenuItem
              itemText="Create a New Spot"
            //   onItemClick={closeMenu}
              modalComponent={<CreateSpotModal />}
            //   modalContent={}
         />
         </div> */}
        <div className="spots-Box">
            {spots.map(spot => {
                return (
                    <div className="spot-Card">
                        <nav>
                            <NavLink className="navBar" to={`/Spots/${spot.id}`}>
                                <div>
                                    <img className="spotImgDiv" src={`${spot.previewImage}`} alt={"Image couldn't be retrieved"}></img>
                                </div>
                                <div>
                                    <div id='spot-name-rating-div'>
                                        <h4 id="spotName">
                                            {spot.name}
                                        </h4>
                                        <i id="starIcon" class="fa-sharp fa-solid fa-star"></i>
                                        {(+spot.avgRating).toFixed(2)}
                                    </div>
                                    <div className="spotRating">
                                    <h4 >
                                    {/* <i class="fa-sharp fa-solid fa-star"></i>
                                    {(+spot.avgRating).toFixed(2)} */}
                                    </h4>
                                    {/* <h4 className="spotDetails">

                                    </h4> */}
                                    </div>
                                </div>
                                <p className="spotLocation">
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
        </div>
    )
}

export default HomePage
