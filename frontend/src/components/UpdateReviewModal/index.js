import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton";
import { useModal } from "../../context/Modal";
import { useParams } from "react-router-dom";
import { getIndivSpot } from "../../store/spots";
import { thunkEditReview, getAllReviews } from "../../store/reviews";
import "./UpdateReviewModal.css";

function UpdateReviewModal({ reviewDetails }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [review, setReview] = useState(reviewDetails.review);
  const [stars, setStars] = useState(reviewDetails.stars);
  const [errors, setErrors] = useState([]);
//   const [url, setUrl] = useState(reviewDetails.imgUrl);

  // const initialStars = useState(reviewDetails.rating);

  const updateReview = (e) => setReview(e.target.value);
  const updateStars = (e) => setStars(e.target.value);
//   const updateImage = (e) => setUrl(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (review.split(" ").length === 1 && review.length > 25) {
      setErrors(["Note cannot exceed 25 characters."]);
      return;
    }

    if (review.split(" ").length > 100) {
      setErrors(["Note cannot exceed 100 words."]);
      return;
    }

    if (review.length > 700) {
      setErrors(["Note cannot exceed 700 characters."]);
      return;
    }

    // if (!url) {
    //   setErrors(["Please provide an image for your note."]);
    //   return;
    // }

    if (review.split(" ").length > 1) {
      let words = review.split(" ");
      for (let word of words) {
        if (word.length > 30) {
          setErrors(["Words within review cannot exceed 30 characters"]);
          return;
        }
      }
    }

    const payload = {
      ...reviewDetails,
      review: review,
      stars: stars
    //   imgUrl: url,
    };

    const updatedReview = await dispatch(
      thunkEditReview(reviewDetails.id, payload)
    );
    if (updatedReview.errors) {
      setErrors(updatedReview.errors);
    } else {
      setErrors([]);
      dispatch(getAllReviews());
      dispatch(getIndivSpot(+reviewDetails.spotId))
      closeModal();
    }
  };

  return (
    <div className="updateReviewModal">
      <div>
        <h1>Update Your Note</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="reviewFormmodal">
          {errors.length !== 0 && (
            <ul style={{ marginBottom: "0px" }}>
              {errors.map((error, idx) => (
                <li key={idx} style={{ color: "red" }}>
                  {error}
                </li>
              ))}
            </ul>
          )}
          <textarea
            style={{
              borderRadius: "10px 10px 10px 10px",
              marginBottom: "10px",
              width: "95%",
            }}
            className="reviewText"
            type={"text"}
            placeholder={"Note"}
            required
            value={review}
            onChange={updateReview}
          />
          <div>
            <label>Rating :</label>
          </div>
          <input
            // checked={initialStars === 1 ? true : false}
            type="radio"
            id="star1"
            name="rate"
            value="1"
            onChange={updateStars}
          />
          <label for="star1" title="text">
            1 star
          </label>
          <input
            // checked={initialStars === 2 ? true : false}
            type="radio"
            id="star2"
            name="rate"
            value={2}
            onChange={updateStars}
          />
          <label for="star2" title="text">
            2 stars
          </label>
          <input
            // checked={initialStars === 3 ? true : false}
            type="radio"
            id="star3"
            name="rate"
            value={3}
            onChange={updateStars}
          />
          <label for="star3" title="text">
            3 stars
          </label>
          <input
            // checked={initialStars === 4 ? true : false}
            type="radio"
            id="star4"
            name="rate"
            value={4}
            onChange={updateStars}
          />
          <label for="star4" title="text">
            4 stars
          </label>
          <input
            // checked={initialStars === 5 ? true : false}
            type="radio"
            id="star5"
            name="rate"
            value={5}
            onChange={updateStars}
          />
          <label for="star5" title="text">
            5 stars
          </label>
          {/* <div>
            <label>Note image :</label>
          </div>
          <input
            style={{
              borderRadius: "10px 10px 10px 10px",
              marginBottom: "10px",
              width: "95%",
            }}
            className="formChildren"
            type={"url"}
            placeholder={"Note Image"}
            value={url}
            onChange={updateImage}
          /> */}
        </div>
        <div className="reviewSubmit">
          <button type="submit">Submit Updates</button>
        </div>
      </form>
    </div>
  );
}

export default UpdateReviewModal;
