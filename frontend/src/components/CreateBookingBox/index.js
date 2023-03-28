import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { thunkCreateBooking, thunkLoadUserBookings } from "../../store/bookings";
import "./CreateBookingBox.css";


export default function CreateBookingsBox() {
  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const history = useHistory();
  const spotObj = useSelector((state) => state.spots.indiv);
  const bookingData = useSelector((state) => state.bookings.spot);
  const bookings = Object.values(bookingData)
  // console.log(bookings)




  // format Date helper func
  // const formatDate = (day) => {
  //   const date = `0${day.getDate()}`.slice(-2);
  //   const month = `0${day.getMonth() + 1}`.slice(-2);
  //   const year = day.getFullYear();

  //   return `${year}-${month}-${date}`;
  // };

  // convert dates for backend

  // const setDates = (num) => {
  //   const now = new Date();
  //   now.setDate(now.getDate() + 10);
  //   const start = now;
  //   const end = new Date(start);
  //   end.setDate(end.getDate() + 7);

  //   if (num === "start") {
  //     return formatDate(start);
  //   } else {
  //     return formatDate(end);
  //   }
  // };

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const startDatetime = new Date(startDate).getTime();
  const endDatetime = new Date(endDate).getTime();
  const now = new Date().getTime();
  // const [dates] = useState(setDates(7));
  // const { startDate, endDate } = dates;
  const [errors, setErrors] = useState([]);


  // get end date for backend

  // const getEndDate = (start) => {
  //   const startDate = new Date(start);
  //   startDate.setDate(startDate.getDate() + 7);
  //   const endDate = startDate;

  //   return formatDate(endDate);
  // };

  // useEffect(() => {
  //   setEndDate(getEndDate(startDate));
  // }, [startDate]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setErrors([]);

  //   let bookingData = {
  //     spotId: id,
  //     endDate,
  //     startDate
  //   }

  //   dispatch(thunkCreateBooking(bookingData))
  //     .then(() => setEndDate(''))
  //     .then(() => setStartDate(''))
  //     .catch(async (res) => {
  //       const data = await res.json();
  //       if (data && data.errors) setErrors(data.errors);
  //     })

  //   history.push(`/profile`);
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    if (now >= startDatetime) {
      setErrors(["Booking cannot be in the past"]);
      return;
    }

    for(let booking of bookings){
      const oldstartDatetime = new Date(booking.startDate).getTime();
      const oldendDatetime = new Date(booking.endDate).getTime();

      if(startDatetime >= oldstartDatetime && endDatetime <= oldendDatetime){
       setErrors(["Dates selected are already booked"]);
       return;
      }
    }

    if(startDatetime >= endDatetime){
      setErrors(["Checkout cannot be before Check-in"]);
      return;
  }


    const newBookingData = {
      spotId: id,
      startDate,
      endDate,
    };

    const NewBooking = await dispatch(
      thunkCreateBooking(newBookingData)
    ).catch(async (res) => {
      const data = await res.json();
      if (data && data.errors) setErrors(data.errors);
    });

    if (NewBooking) {
      dispatch(thunkLoadUserBookings(loggedInUser.id));
      history.push(`/profile`);
    }
  };

  if (!loggedInUser) return null;

  // calculate days stayed for total price

  const totalReservationDays = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);

    if (endDate) {
      const end = new Date(endDate);
      const difference = end.getTime() - start.getTime();
      const convertToDays = difference / (1000 * 60 * 60 * 24) + 1;
      return Math.round(convertToDays);
    }

    const difference = start.getTime() - now.getTime();
    const convertToDays = difference / (1000 * 60 * 60 * 24);

    return Math.round(convertToDays);
  };

  const totalPrice = (startDate, endDate, price) => {
    const totalDays = totalReservationDays(startDate, endDate);

    let cost = Number(price * totalDays).toFixed(2);

    return cost;
  };

  let cost = totalPrice(startDate, endDate, spotObj.price);

  // const handleStartDateChange = (e) => {
  //   const value = e.target.value;
  //   if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
  //     setStartDate(value);
  //     setEndDate(getEndDate(value));
  //   } else {
  //     // display error message
  //     setErrors([...errors, "Invalid start date"]);
  //   }
  // };

  // const handleEndDateChange = (e) => {
  //   const value = e.target.value;
  //   if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
  //     setEndDate(value);
  //   } else {
  //     // display error message
  //     setErrors([...errors, "Invalid end date"]);
  //   }
  // };

  return (
    <div
      className="createBooking-container"
      hidden={
        loggedInUser && loggedInUser.id !== spotObj.ownerId ? false : true
      }
    >
      {/* <div className="">
        <div className="">
          <h1 className="">${Number(spotObj.price).toFixed(2)}</h1>
          <span className="">/ night</span>
        </div>
      </div> */}
      <div className="createBooking-error-container">
        <ul className="createBooking-errors">
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
      </div>
      <form onSubmit={handleSubmit} className="createBooking-form">
        <div className="createBooking-main-container">
          <div className="createBookingDiv">
            <div className="startAndEndSelect">
              <div className="startDate">
                <label htmlFor="lat">Check-In : </label>
                <input
                  // className="createBooking-lat"
                  // id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  // onChange={handleStartDateChange}
                />
              </div>
              <div className="endDate">
                <label htmlFor="lat">Check-Out : </label>
                <input
                  // className="createBooking-lat"
                  // id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  // onChange={handleEndDateChange}
                />
              </div>
            </div>
            <div className="createBookingButtonDiv">
              <button type="submit" className="createBookingButton">
                Reserve
              </button>
            </div>
            <div className="NoCharge">You won't be charged yet</div>
          </div>
        </div>
      </form>

      <div className="">
        <div className="" hidden={(parseInt(startDate) && parseInt(endDate) ? false : true)}>
          <div className="">
            <div className="priceXNights">
              <p className="">
                ${Number(spotObj.price).toFixed(2)} x{" "}
                {totalReservationDays(startDate, endDate)} nights
              </p>
              <p className="">${cost}</p>
            </div>
          </div>
          <div className="totalCostDiv">
            <p className="">Total before taxes</p>
            <p className="">${cost}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
