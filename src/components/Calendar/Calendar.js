import React, { useState, useEffect } from 'react'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { DateRange } from 'react-date-range'
import { addDays } from 'date-fns'
import axios from 'axios'
import './calendar.scss'

const CalendarView = () => {
  const [reservation, setReservation] = useState({
    startDate: new Date(),
    endDate: addDays(new Date(), 7),
    key: 'selection'
  })

  const [blockedDates, setBlockedDates] = useState([])

  const availability = [
    {
      'id': 1,
      'start_date': '2020-06-26',
      'end_date': '2020-06-30'
    },
    {
      'id': 2,
      'start_date': '2020-07-01',
      'end_date': '2020-07-04'
    },
    {
      'id': 3,
      'start_date': '2020-07-04',
      'end_date': '2020-07-08'
    },
    {
      'start_date': '2020-07-20',
      'end_date': '2020-07-28'
    }
  ]

  const unavailableDates = []
  const listDates = () => {
    availability.forEach(reservation => {
      const checkOut = new Date(reservation.end_date)
      const checkIn = new Date(reservation.start_date)
      const lengthOfStay = (checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24)
      let newBlockedDate = addDays(checkIn, 1)
      unavailableDates.push(newBlockedDate)
      for (let i = 1; i < lengthOfStay; i++) {
        newBlockedDate = addDays(newBlockedDate, 1)
        unavailableDates.push(newBlockedDate)
      }
    })
    setBlockedDates(unavailableDates)
  }

  useEffect(() => listDates(), [])

  useEffect(() => {
    axios('http://localhost:8000/reservations/')
      .then(res => console.log(res))
      .catch(console.error)
  })

  useEffect(() => {
    const currentReservation = {
      start_date: reservation.startDate.toISOString().split('T')[0],
      end_date: reservation.endDate.toISOString().split('T')[0]
    }
    console.log(currentReservation)
  }, [reservation])

  return (
    <div>
      <DateRange
        className='calendar'
        ranges={[reservation]}
        onChange={current => setReservation(current.selection)}
        editableDateInputs={false}
        moveRangeOnFirstSelection={false}
        rangeColors={['red']}
        disabledDates={blockedDates}
        minDate={new Date()}
      />
    </div>
  )
}

export default CalendarView
