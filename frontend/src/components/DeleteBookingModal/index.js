import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { thunkLoadUserBookings, thunkDeleteBooking } from '../../store/bookings';
import { useHistory } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import './DeleteBooking.css'


export default function DeleteBookingModal({bookingId}) {
    const dispatch = useDispatch();
    const history = useHistory();
    // const user = useSelector((state) => state.session.user);
    const {closeModal} = useModal()
    const [errors, setErrors] = useState([]);



    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        dispatch(thunkDeleteBooking(bookingId))
            .then(() => dispatch(thunkLoadUserBookings()))
            .then(closeModal)
    };

    return (
        <div className='deleteRecipe'>
            <div className="form-header">
                <h1>Delete Booking?</h1>
                <p>(Booking will be deleted permanently and this cannot be undone. You will not be charged.)</p>
                <p className='pastBookings'>*Past Bookings cannot be deleted to maintain host records.</p>
            </div>
            <form onSubmit={handleSubmit}>
              <button className="delete-button" type="submit">Confirm Delete</button>
            </form>
        </div>
    )
}
