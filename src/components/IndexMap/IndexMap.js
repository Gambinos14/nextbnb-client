import React, { useState, useEffect } from 'react'
import apiUrl from '../../apiConfig'
import axios from 'axios'
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react'

const indexStyle = {
  marginTop: '95px',
  width: '35vw',
  height: '35vw',
  position: 'fixed'
}

const IndexMap = (props) => {
  const [homes, setHomes] = useState([])
  const [center, setCenter] = useState({})

  useEffect(() => {
    axios(`${apiUrl}/houses/`)
      .then(res => {
        setHomes(res.data)
        setCenter({
          lat: res.data[0].latitude,
          lng: res.data[0].longitude
        })
      })
      .catch(console.error)
  }, [])

  return (
    <Map
      google={props.google}
      containerStyle={indexStyle}
      zoom={10}
      defaultCenter={center}
      center={center}>
      {homes.map(home => (
        <Marker key={home.id} position={{ lat: home.latitude, lng: home.longitude }} />
      ))}
    </Map>
  )
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyB-TRWMURP92g2f0t26iUj5ptaSpqOifUY'
})(IndexMap)
