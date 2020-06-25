import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import apiUrl from '../../apiConfig'
import axios from 'axios'
import './bookingsIndex.scss'

const BookingsIndex = (props) => {
  const [bookings, setBookings] = useState([])
  const [updateStatus, setUpdateStatus] = useState(false)

  // console.log(props.user)

  useEffect(() => {
    // console.log(props.user.token)
    axios({
      method: 'GET',
      url: `${apiUrl}/bookings/`,
      headers: {
        'Authorization': `Token ${props.user.token}`
      }
    })
      .then(res => {
        setBookings(res.data)
        // console.log(res)
      })
      .catch(() => props.msgAlert({ message: 'Failed to Retrieve Bookings ...', variant: 'danger' }))
  }, [updateStatus])

  const handleDeleteClick = (id) => {
    // console.log('bookingId: ', id)
    axios({
      method: 'DELETE',
      url: `${apiUrl}/bookings/${id}`,
      headers: {
        'Authorization': `Token ${props.user.token}`
      }
    })
      .then(() => {
        // console.log('success')
        setUpdateStatus(!updateStatus)
      })
      .catch(() => props.msgAlert({ message: 'Failed to Delete Bookings ...', variant: 'danger' }))
  }

  const handleUpdateClick = (houseId, bookingId) => {
    props.setUpdateId(bookingId)
    props.history.push(`/bookings-update/${houseId}`)
  }

  if (bookings.length === 0) {
    return (<div className="searchHeader">Go make some bookings!!</div>)
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
