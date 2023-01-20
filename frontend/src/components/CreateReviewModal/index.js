import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import "./reviewModal.css";
import { Redirect, useHistory } from "react-router-dom";
import { createReview } from "../../store/reviews";

function CreateReviewModal() {
    const dispatch = useDispatch();
    const history = useHistory()
    const [review, setReview] = useState("");
    const [stars, setStars] = useState("");
    const [validationErrors, setValidationErrors] = useState("")
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();

    const user = useSelector((state) => state.session.user)

    if(!user) {
      return <Redirect to={'/'}/>
    }


    const handleSubmit = async (e) => {
      e.preventDefault();
      setErrors([]);
      return dispatch(createReview({
        review,
        stars
      }))
        .then(closeModal())
        // .then(history.push(`/`))
        .catch(
          async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(data.errors);
          }
        );
        // if(newSpot){
        //   const newSpotJSON = await
        //   history.push(`/Spots/${newSpot.id}`)
        // }

        // const newSpotJSON = newSpot.json()
        // history.push(`/Spots/${newSpotJSON.id}`)
          // return newSpot
    };

    return (
      <>
        <h1>Create a Review</h1>
        <form onSubmit={handleSubmit}>
          <ul>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
          <label>
            Review
            <input
              type="text"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
            />
          </label>
          <label>
            City
            <input
              type="text"
              value={stars}
              onChange={(e) => setStars(e.target.value)}
              required
            />
          </label>
          <button type="submit">Create Review</button>
        </form>
      </>
    );
  }

  export default CreateReviewModal;
