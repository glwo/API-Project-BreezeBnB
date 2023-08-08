import { getAllSpots, deleteIndivSpot, createSpot } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { NavLink } from "react-router-dom";
import "./homePage.css";
import CreateSpotButton from "./CreateSpotButton";
import CreateSpotModal from "../CreateSpotModal";
import { useModal, Modal } from "../../context/Modal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";

const HomePage = () => {
  const spotsObj = useSelector((state) => state.spots.all);
  const history = useHistory();
  const { closeModal } = useModal();

  let spots = [];
  if (spotsObj) {
    spots = Object.values(spotsObj);
  }

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllSpots());
  }, [dispatch]);

  if (!spotsObj) return null;

  const onClick = (spotId) => {
    history.push(`/spots/${spotId}`);
  };

  return (
    <div className="allSpots-div">
      {spots &&
        spots.map((spot) => (
          <div
            key={spot.id}
            className="spot-card"
            onClick={() => onClick(spot.id)}
          >
            <div className="spot-img">
              <img
                className="spot-previewimg"
                src={spot.previewImage}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://i.pinimg.com/originals/81/45/ef/8145efce2fec5157c6700e46ba14abb0.jpg";
                }}
                onClick={() => onClick(spot.id)}
              />
            </div>
            <div className="spot-card-bottom">
              <div className="spot-card-header">
                <p className="spot-location">
                {spot.name}
                </p>
                <p className="spot-rating">
                  {(+spot.avgRating).toFixed(2) !== "0.00" ? (
                    <>
                      <i className="fa-solid fa-star" id="star"></i>{" "}
                      {(+spot.avgRating).toFixed(2)}
                    </>
                  ) : (
                    <>
                    <i className="fa-solid fa-star" id="star"></i>
                    New
                    </>
                  )}
                </p>
              </div>
              <div className="spot-card-middle">
                <p className="spot-name">{spot.city}, {spot.state}</p>
              </div>
              <div className="spot-card-footer">
                <p className="spot-price">${spot.price}</p>
                <p className="per-night">night</p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default HomePage;
