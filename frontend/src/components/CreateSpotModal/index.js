import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import "./CreateSpotModal.css";
import { createSpot, getAllSpots } from "../../store/spots";
import { Redirect, useHistory } from "react-router-dom";

function CreateSpotModal() {
  const dispatch = useDispatch();
  const history = useHistory()
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("")
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  // const user = useSelector((state) => state.session.user)

  // if(!user) {
  //   return <Redirect to={'/'}/>
  // }


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setErrors([]);
  //   return await dispatch(createSpot({
  //       address,
  //       city,
  //       state,
  //       country,
  //       lat,
  //       lng,
  //       name,
  //       description,
  //       price,
  //       imageUrl
  //   }))
  //     .then(closeModal())
  //     .then(dispatch(getAllSpots()))
  //     .then(history.push('/'))
  //     .catch(
  //       async (res) => {
  //         const data = await res.json();
  //         if (data && data.errors) setErrors(data.errors);
  //       }
  //     );
  //     // if(newSpot){
  //     //   const newSpotJSON = await
  //     //   history.push(`/Spots/${newSpot.id}`)
  //     // }

  //     // const newSpotJSON = newSpot.json()
  //     // history.push(`/Spots/${newSpotJSON.id}`)
  //       // return newSpot
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    const newSpot = await dispatch(createSpot({
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
    }))
      .then(dispatch(getAllSpots()))
      .then(closeModal())
      // .then(dispatch(history.push(`/Spots/${newSpot.id}`)))
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );

      history.push(`/Spots/${newSpot.id}`)
      return newSpot
  };

  return (
    <>
    <div className="createSpotModal">
      <h1>Create a Spot</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <div>
        <label>
          Address
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>
        </div>
        <div>
        <label>
          City
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </label>
        </div>
        <div>
        <label>
          State
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </label>
        </div>
        <div>
        <label>
          Country
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </label>
        </div>
        <div>
        <label>
          Latitude
          <input
            type="number"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            required
          />
        </label>
        </div>
        <div>
        <label>
          Longitude
          <input
            type="number"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            required
          />
        </label>
        </div>
        <div>
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        </div>
        <div>
        <label>
          Description
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        </div>
        <div>
        <label>
          Price
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>
        </div>
        <label>
          Image Url
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
        </label>
        <div>
        <button className="createSpotButton" type="submit">Create Spot</button>
        </div>
      </form>
      </div>
    </>
  );
}

export default CreateSpotModal;
