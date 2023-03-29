# Breezebnb
A fullstack clone of popular vacation rental site Airbnb which provides users with clean and smooth platform to advertise, book, and review local rentals.
Key technologies used include: JavaScript, Npm, React.js, Sequelize, and PostgreSQL.

[https://breezebnb-giln.onrender.com/](https://breezebnb-giln.onrender.com/)

## Functionality and MVPS
In breezebnb, users can:
- login or signup with a personal profile
- make and manage spots: full CRUD
- make and delete bookings
- write and manage reviews: full CRUD

## Technologies and Libraries
- React.js
- React/Redux
- Node.js
- Sequelize
- PostgreSQL


### Splash Page
![breezeHome](https://user-images.githubusercontent.com/112520930/228556194-ca34879d-623a-40cf-8864-22d5f133041c.PNG)

### Bookings
![breezeBookings](https://user-images.githubusercontent.com/112520930/228556567-3140f8b5-851e-4279-a157-931ffc1c861d.PNG)

### Spot Details Page
![homeDetails](https://user-images.githubusercontent.com/112520930/228557048-29934f1e-f603-41b9-9da6-10f785a1b308.PNG)



## Code Examples  
### Redux Action
```
export const thunkLoadSpotBookings = ( spotId ) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/bookings`);
  if (response.ok) {
    const data = await response.json();
    dispatch(loadSpotBookings(data))
  }
};
```
I chose Redux for this project because it provides a predictable and centralized way to manage state within my application. It's scalability and predictability made it a great choice for both present and future versions of the application. Also, it is quite flexible in the frameworks it allows.
### Spot Page React Element
```
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
              <textarea
            style={{
              borderRadius: "10px 10px 10px 10px",
              marginBottom: "10px",
              width: "95%",
            }}
            className="reviewText"
            type={"text"}
            placeholder={"Leave a Review..."}
            required
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
            </label>
          </div>
          <div className="ReviewFormStarsRating">
            Your rating :
            <StarsRating
              className="ReviewFormStarsRating"
              count={5}
              onChange={setStars}
              size={35}
              half={false}
              value={stars}
              color2={"#dd1361"}
              color1={"#80808f"}
            />
          </div>
          <div>
            <button className="createReviewButton" type="submit">
              Create Review
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
 ```
The React library provided me with a smooth and clean developmment process due to its modular format. Also, it provided me with the opportunity to implement additional packages quickly, such as the StarsRating package seen above. There was also many opportunities for code reuse in the development process which is mainly thanks to React.
