import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import Carousel from 'react-bootstrap/Carousel'
import apiUrl from '../../apiConfig'
import axios from 'axios'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { DateRange } from 'react-date-range'
import { addDays } from 'date-fns'
import '../HomeShow/homeshow.scss'
import './bookingupdate.scss'

const BookingsUpdate = (props) => {
  const [house, setHouse] = useState({})
  const [images, setImages] = useState([])
  const [houseReservations, setHouseReservations] = useState([])
  const [blockedDates, setBlockedDates] = useState([])
  const [userReservation, setUserReservation] = useState({})
  const [amenities, setAmenities] = useState([])

  const reservationId = props.updateId
  const houseId = props.match.params.id

  const [reservation, setReservation] = useState({
    startDate: new Date(),
    endDate: addDays(new Date(), 7),
    key: 'selection'
  })

  const listDates = (array) => {
    const unavailableDates = []
    array.forEach(booking => {
      const checkOut = new Date(booking.end)
      const checkIn = new Date(booking.start)
      const lengthOfStay = (checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24)
      let newBlockedDate = addDays(checkIn, 1)
      unavailableDates.push(newBlockedDate)
      for (let i = 1; i < lengthOfStay; i++) {
        newBlockedDate = addDays(newBlockedDate, 1)
        unavailableDates.push(newBlockedDate)
      }
    })
    return unavailableDates
  }

  useEffect(() => {
    axios(`${apiUrl}/houses/id/${houseId}/`)
      .then(res => {
        setHouse(res.data)
        setAmenities(res.data.amenities)
        setImages(res.data.images)
        setHouseReservations(res.data.bookings)
        let blackListDates = listDates(res.data.bookings)
        // console.log('blackListDates: ', blackListDates)

        const currentReservation = listDates(res.data.bookings.filter(booking => booking.id === reservationId))
        setUserReservation(res.data.bookings.find(booking => booking.id === reservationId))

        const convertBlackListDates = blackListDates.map(date => Date.parse(date))

        currentReservation.forEach(date => {
          const removeIndex = convertBlackListDates.indexOf(Date.parse(date))
          // console.log('removeIndex: ', removeIndex)
          convertBlackListDates.splice(removeIndex, 1)
        })

        blackListDates = convertBlackListDates.map(date => new Date(date))
        // console.log('NewBlockedDates: ', blackListDates)
        setBlockedDates(blackListDates)
      })
      .catch(() => props.msgAlert({ message: 'Could Not Find This House ...', variant: 'danger' }))
  }, [])

  const amenitiesObject = {
    'Wifi': <i className="utilitiesIcons fas fa-wifi"></i>,
    'Kitchen': <i className="utilitiesIcons fas fa-utensils"></i>,
    'Tv': <i className="utilitiesIcons fas fa-tv"></i>,
    'Breakfast': <i className="utilitiesIcons fas fa-coffee"></i>,
    'Pool': <i className="utilitiesIcons fas fa-swimming-pool"></i>,
    'Parking': <i className="utilitiesIcons fas fa-parking"></i>
  }

  const handleUpdateRequest = (event) => {
    const currentReservation = {
      start_date: reservation.startDate.toISOString().split('T')[0],
      end_date: reservation.endDate.toISOString().split('T')[0]
    }
    const existingReservationIndex = houseReservations.indexOf(userReservation)
    houseReservations.splice(existingReservationIndex, 1)

    const checkAvailability = (reservation, index) => {
      if (reservation.end <= currentReservation.start_date) {
        return false
      }
      if (index === 0) {
        if (reservation.start >= currentReservation.end_date || reservation.end <= currentReservation.start_date) {
          return false
        }
      }
      if (reservation.start >= currentReservation.end_date && (houseReservations[index - 1].end <= currentReservation.start_date || houseReservations[index - 1].start >= currentReservation.end_date)) {
        return false
      }
      return true
    }

    const checkBookingConflict = houseReservations.find(checkAvailability)

    if (checkBookingConflict !== undefined) {
      props.msgAlert({ message: 'Update Request Denied ... Please Check The Dates', variant: 'danger' })
    } else {
      axios({
        method: 'PATCH',
        url: `${apiUrl}/bookings/${reservationId}/`,
        data: {
          booking: {
            start: currentReservation.start_date,
            end: currentReservation.end_date,
            property: houseId
          }
        },
        headers: {
          'Authorization': `Token ${props.user.token}`
        }
      })
        .then(() => {
          props.history.push('/bookings')
        })
        .catch(() => props.msgAlert({ message: 'Failed to Update This Booking ...', variant: 'danger' }))
    }
  }
  return (
    <div>
      <div className='hero'>
        <Carousel interval='3000'>
          {images.map(image => (
            <Carousel.Item key={image.url}>
              <img
                className="d-block w-100 img"
                src={image.url}
                alt="Third slide"
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
      <div className="houseInformation">
        <div className="houseDetails">
          <div className="textDetails">
            <p className="apartmentType">ENTIRE APARTMENT</p>
            <h3 className="apartmentName">{house.name}</h3>
            <div className='houseSpecs'>
              <i className="utilitiesIcons fas fa-user-friends"></i>
              <p className='houseSpecsText'>{house.guests ? `${house.guests} guests` : '4 guests'}</p>
              <i className="utilitiesIcons fas fa-warehouse"></i>
              <p className='houseSpecsText'>{house.bedrooms ? `${house.bedrooms} bedrooms` : '2 bedrooms'}</p>
              <i className="utilitiesIcons fas fa-bed"></i>
              <p className='houseSpecsText'>{house.beds ? `${house.beds} beds` : '6 beds'}</p>
              <i className="utilitiesIcons fas fa-bath"></i>
              <p className='houseSpecsText'>{house.baths ? `${house.baths} baths` : '3 baths'}</p>
            </div>
            <p>{house.description}</p>
            <div className='amenitiesSpecs'>
              {amenities.map((amenity, index) => (
                <div key={index} className="amenitiesDisplay">
                  {amenitiesObject[amenity]}
                  <p className='amenitiesText'>{amenity}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="calendarSection">
            <h4 className="updateHeader">Current Reservation Dates</h4>
            <div className="bookingUpdateDetails">
              <div className="dates">
                Check-In:
                <p>{userReservation.start}</p>
              </div>
              <div className="dates">
                Check-Out:
                <p>{userReservation.end}</p>
              </div>
            </div>
            <div className="calendar">
              <p className="priceInfo"><span className='price'>${house.price}</span><span className='smallerFont'>per night</span></p>
              <p id="dates">Dates</p>
              <DateRange
                className="dateRangeCalendar"
                ranges={[reservation]}
                onChange={current => setReservation(current.selection)}
                editableDateInputs={false}
                moveRangeOnFirstSelection={false}
                rangeColors={['#FF585D']}
                disabledDates={blockedDates}
                minDate={new Date()}
              />
              <button onClick={handleUpdateRequest}className="bookingButton">Update Booking</button>
              <p className="userInfo">You will not be charged.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default withRouter(BookingsUpdate)
