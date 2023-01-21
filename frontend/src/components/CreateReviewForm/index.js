import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import "./reviewModal.css";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { createReview, getAllReviews } from "../../store/reviews";

function CreateReviewForm() {
    const dispatch = useDispatch();
    const { id } = useParams()
    const history = useHistory()
    const [review, setReview] = useState("");
    const [stars, setStars] = useState(1);
    const [validationErrors, setValidationErrors] = useState("")
    const [errors, setErrors] = useState([]);


    const handleSubmit = async (e) => {
      e.preventDefault();
      setErrors([]);
      const newReview = await dispatch(createReview({
        id,
        stars,
        review
      }))
        .then(dispatch(getAllReviews(+id)))
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
          history.push(`/Spots/${id}`)
          return newReview
    };

    return (
      <>
      <div className="reviewForm">
        <h1>Create a Review</h1>
        <form onSubmit={handleSubmit}>
          <ul>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
          <div>
          <label>
            Review :
            <input
              type="text"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
            />
          </label>
          </div>
          <div>
          <label>
            Rating :
            {/* <input
              type="number"
              value={stars}
              onChange={(e) => setStars(e.target.value)}
              required
            /> */}
            <select
              value={stars}
              onChange={(e) => setStars(e.target.value)}
              required
              >
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
            </select>
          </label>
          </div>
          <div>
          <button className="createReviewButton" type="submit">Create Review</button>
          </div>
        </form>
        </div>
      </>
    );
  }

  export default CreateReviewForm;
