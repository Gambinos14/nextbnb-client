import React, { useState, useEffect } from 'react'
import apiUrl from '../../apiConfig'
import axios from 'axios'
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react'

const indexStyle = {
  marginTop: '50px',
  marginBottom: '50px',
  width: '45vw',
  height: '35vw'
}

const ShowHouseMap = (props) => {
  const [home, setHome] = useState({})
  const [center, setCenter] = useState({})

  useEffect(() => {
    axios(`${apiUrl}/houses/id/${props.houseId}/`)
      .then(res => {
        setHome(res.data)
        setCenter({
          lat: res.data.latitude,
          lng: res.data.longitude
        })
      })
      .catch(console.error)
  }, [])

  return (
    <Map
      google={props.google}
      containerStyle={indexStyle}
      zoom={15}
      defaultCenter={center}
      center={center}>
      <Marker key={home.id} position={{ lat: home.latitude, lng: home.longitude }} />
    </Map>
  )
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyB-TRWMURP92g2f0t26iUj5ptaSpqOifUY'
})(ShowHouseMap)
