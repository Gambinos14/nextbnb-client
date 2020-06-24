import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import apiUrl from '../../apiConfig'
import axios from 'axios'
import './bookingsIndex.scss'

const BookingsIndex = (props) => {
  const [bookings, setBookings] = useState([])
  const [updateStatus, setUpdateStatus] = useState(false)

  useEffect(() => {
    axios(`${apiUrl}/bookings/`)
      .then(res => {
        setBookings(res.data)
        // console.log(res)
      })
      .catch(console.error)
  }, [updateStatus])

  const handleDeleteClick = (id) => {
    // console.log('bookingId: ', id)
    axios({
      method: 'DELETE',
      url: `${apiUrl}/bookings/${id}`
    })
      .then(() => {
        // console.log('success')
        setUpdateStatus(!updateStatus)
      })
      .catch(console.error)
  }

  const handleUpdateClick = (houseId, bookingId) => {
    props.setUpdateId(bookingId)
    props.history.push(`/bookings-update/${houseId}`)
  }

  return (
    <div>
      <h3 className="bookingsHeader">Bookings</h3>
      <ul className="bookingsList">
        {bookings.map(booking => (
          <li key={booking.id} className="bookingsContainer">
            <div className="imageContainer">
              <h4 className="bookingLocation">{booking.property.name}</h4>
              <img src={booking.property.images[0].url}/>
            </div>
            <div className="bookingDetails">
              <div className="dates">
                Check-In:
                <p>{booking.start}</p>
              </div>
              <div className="dates">
                Check-Out:
                <p>{booking.end}</p>
              </div>
              <div className="price">
                <p><span>Total Price:</span>${(((new Date(booking.end) - new Date(booking.start)) / (1000 * 3600 * 24)) * booking.property.price).toFixed(2)}</p>
                <div className="buttonContainer">
                  <button onClick={() => handleDeleteClick(booking.id)} className="deleteBookingButton">Delete</button>
                  <button onClick={() => handleUpdateClick(booking.property.id, booking.id)} className="updateBookingButton">Update</button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default withRouter(BookingsIndex)
