import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import Carousel from 'react-bootstrap/Carousel'
import apiUrl from '../../apiConfig'
import axios from 'axios'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { DateRange } from 'react-date-range'
import { addDays } from 'date-fns'
import './homeshow.scss'
import { PeopleIcon, BathIcon, WarehouseIcon, WifiIcon, UtensilsIcon, TvIcon, CoffeeIcon, SwimmingPoolIcon, LocalParkingIcon, WasherIcon, DryerIcon, HotelBedIcon } from './homeshowcomponents'

const HomeShow = (props) => {
  const houseId = props.match.params.id
  const [house, setHouse] = useState({})
  const [images, setImages] = useState([])
  const [reservationDates, setReservationDates] = useState([])
  const [blockedDates, setBlockedDates] = useState([])

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
        setImages(res.data.images)
        // console.log('house: ', res.data)
        const blackListDates = listDates(res.data.bookings)
        setBlockedDates(blackListDates)
        setReservationDates(res.data.bookings)
      })
      .catch(console.error)
  }, [])

  const amenities = ['Wifi', 'Pool', 'Washer', 'Dryer', 'Kitchen', 'Breakfast', 'Parking', 'Tv']

  const amenitiesObject = {
    'Wifi': <WifiIcon />,
    'Kitchen': <UtensilsIcon />,
    'Tv': <TvIcon />,
    'Breakfast': <CoffeeIcon />,
    'Pool': <SwimmingPoolIcon />,
    'Parking': <LocalParkingIcon />,
    'Washer': <WasherIcon />,
    'Dryer': <DryerIcon />
  }

  const handleBookingRequest = (event) => {
    const currentReservation = {
      start_date: reservation.startDate.toISOString().split('T')[0],
      end_date: reservation.endDate.toISOString().split('T')[0]
    }
    // console.log('CurrentReservation: ', currentReservation)

    const checkAvailability = (reservation, index) => {
      if (reservation.end <= currentReservation.start_date) {
        return false
      }
      if (index === 0) {
        if (reservation.start >= currentReservation.end_date || reservation.end <= currentReservation.start_date) {
          return false
        }
      }
      if (reservation.start >= currentReservation.end_date && (reservationDates[index - 1].end <= currentReservation.start_date || reservationDates[index - 1].start >= currentReservation.end_date)) {
        return false
      }
      return true
    }

    const checkBookingConflict = reservationDates.find(checkAvailability)
    // console.log('Booking Conflict: ', checkBookingConflict !== undefined)
    if (checkBookingConflict !== undefined) {
      props.msgAlert({ message: 'Booking Request Failed...', variant: 'danger' })
    } else {
      axios({
        method: 'POST',
        url: `${apiUrl}/bookings/`,
        data: {
          booking: {
            start: currentReservation.start_date,
            end: currentReservation.end_date,
            guest: 2,
            property: houseId
          }
        }
      })
        .then(() => {
          props.history.push('/bookings')
        })
        .catch(console.error)
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
              <PeopleIcon />
              <p className='houseSpecsText'>{house.guest ? `${house.guest} guests` : '4 guests'}</p>
              <WarehouseIcon />
              <p className='houseSpecsText'>{house.bedroom ? `${house.bedroom} bedrooms` : '2 bedrooms'}</p>
              <HotelBedIcon />
              <p className='houseSpecsText'>{house.bed ? `${house.bed} beds` : '6 beds'}</p>
              <BathIcon />
              <p className='houseSpecsText'>{house.bath ? `${house.bath} baths` : '3 baths'}</p>
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
            <div className="calendar">
              <p className="priceInfo"><span className='price'>${house.price}</span><span className='smallerFont'>per night</span></p>
              <p className="dates">Dates</p>
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
              <button onClick={handleBookingRequest}className="bookingButton">Book</button>
              <p className="userInfo">You will not be charged.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default withRouter(HomeShow)
