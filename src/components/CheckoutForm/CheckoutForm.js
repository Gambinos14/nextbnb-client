import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import { useElements, useStripe, CardElement } from '@stripe/react-stripe-js'
import axios from 'axios'
import apiUrl from '../../apiConfig'
import './checkout.scss'

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '22px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  }
}

const CheckoutForm = (props) => {
  const { house, reservation, houseId, user } = props
  const housePrice = parseFloat(house.price)
  const checkIn = reservation.startDate
  const checkOut = reservation.endDate
  const visitLength = ((new Date(checkOut) - new Date(checkIn)) / (1000 * 3600 * 24))
  const totalCost = (housePrice * visitLength).toFixed(2)

  const [error, setError] = useState(null)

  const stripe = useStripe()
  const elements = useElements()

  const handleServerResponse = (response) => {
    if (response.data.error) {
      setError(response.data.error)
    } else {
      const newReservation = {
        start_date: reservation.startDate.toISOString().split('T')[0],
        end_date: reservation.endDate.toISOString().split('T')[0]
      }
      axios({
        method: 'POST',
        url: `${apiUrl}/bookings/`,
        data: {
          booking: {
            start: newReservation.start_date,
            end: newReservation.end_date,
            property: houseId
          }
        },
        headers: {
          'Authorization': `Token ${user.token}`
        }
      })
        .then(() => {
          props.history.push('/bookings')
        })
        .catch(() => props.msgAlert({ message: 'Booking Request Failed ...', variant: 'danger' }))
    }
  }

  const handlePaymentMethodResult = (result) => {
    if (result.error) {
      setError(result.error.message)
    } else {
      axios({
        method: 'POST',
        url: `${apiUrl}/pay/`,
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({
          payment_method_id: result.paymentMethod.id,
          house: house,
          reservation: reservation
        })
      })
        .then(response => handleServerResponse(response))
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)
    })
      .then(result => handlePaymentMethodResult(result))
  }

  // Handle real-time validation errors from the card Element.
  const handleChange = (event) => {
    if (event.error) {
      setError(event.error.message)
    } else {
      setError(null)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="bookingDetails">
        <img src={house.images ? house.images[0].url : ''} />
        <div className="bookingDates"><p><b>Check In:</b></p><p>{reservation.startDate.toISOString().split('T')[0]}</p></div>
        <div className="bookingDates"><p><b>Check Out:</b></p><p>{reservation.endDate.toISOString().split('T')[0]}</p></div>
        <div className="finalCost"><p>Total for <b>{visitLength}</b> nights:</p><p className="chargeAmount">${totalCost}</p></div>
      </div>
      <CardElement
        id="card-element"
        options={CARD_ELEMENT_OPTIONS}
        onChange={handleChange}
      />
      <div className="card-errors" role="alert">{error}</div>
      <Button className="payButton" type="submit" disabled={!stripe}>Submit Payment</Button>
    </form>
  )
}

export default withRouter(CheckoutForm)
