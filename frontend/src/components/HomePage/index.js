import { getAllSpots } from "../../store/spots";
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
    }, [dispatch])

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
        <div>
         <OpenModalMenuItem
              itemText="Create a New Spot"
            //   onItemClick={closeMenu}
              modalComponent={<CreateSpotModal />}
            //   modalContent={}
         />
         </div>
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
                                    <i class="fa-sharp fa-solid fa-star"></i>
                                    {spot.avgRating}
                                    </h4>
                                    {/* <h4 className="spotDetails">

                                    </h4> */}
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
        </div>
    )
}

export default HomePage
