import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { updateIndivSpot } from "../../store/spots";
import './UpdateSpotForm.css';

const UpdateSpotForm = () => {
    const spotObj = useSelector(state => state.spots.indiv);
    const { id } = useParams();
    const history = useHistory();
    const loggedInUser = useSelector(state => state.session.user);

    // console.log(spotObj)

    const dispatch = useDispatch();
    const [address, setAddress] = useState(spotObj.address);
    const [city, setCity] = useState(spotObj.city);
    const [state, setState] = useState(spotObj.state);
    const [country, setCountry] = useState(spotObj.country);
    const [lat, setLat] = useState(spotObj.lat);
    const [lng, setLng] = useState(spotObj.lng);
    const [name, setName] = useState(spotObj.name);
    const [description, setDescription] = useState(spotObj.description);
    const [price, setPrice] = useState(spotObj.price);
    const [errors, setErrors] = useState([]);

    // const submitUpdate = async (e) => {
    //     e.preventDefault()

    //     const updates = {
    //         address,
    //         city,
    //         state,
    //         country,
    //         lat,
    //         lng,
    //         name,
    //         description,
    //         price
    //     }

    //     const updatedSpot = await dispatch(updateIndivSpot(updates))
    //     .catch(
    //         async (res) => {
    //           const data = await res.json();
    //           if (data && data.errors) setErrors(data.errors);
    //         }
    //       );

    //       if(updatedSpot){
    //         history.push(`/Spots/${id}`)
    //       }
    // }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        return dispatch(updateIndivSpot({
            id,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        }))
        .then(history.push(`/Spots/${id}`))
          .catch(
            async (res) => {
              const data = await res.json();
              if (data && data.errors) setErrors(data.errors);
            }
          );
      };

    return (
        <>
        <div className="updateSpotForm">
          <h1>Update Your Spot</h1>
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
                value={+price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </label>
            </div>
            <div>
            <button className="updateSpotButton" type="submit" hidden={(loggedInUser && loggedInUser.id === spotObj.ownerId ? false : true)}>Submit Spot Updates</button>
            </div>
          </form>
          </div>
        </>
      );
}


export default UpdateSpotForm
