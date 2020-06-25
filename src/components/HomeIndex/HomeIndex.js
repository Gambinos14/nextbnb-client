import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import apiUrl from '../../apiConfig'
import axios from 'axios'
import '../HomeSearch/homesearch.scss'

const HomeIndex = (props) => {
  const [homes, setHomes] = useState(undefined)

  useEffect(() => {
    axios(`${apiUrl}/houses/`)
      .then(res => setHomes(res.data))
      .catch(() => props.msgAlert({ message: 'Failed to Load Houses ...', variant: 'danger' }))
  }, [])

  if (homes === undefined) {
    return (
      <div className="searchHeader"> Loading ...</div>
    )
  }

  if (homes.length === 0) {
    return (
      <div className="searchHeader"> We have no homes to show at this time ...</div>
    )
  }

  return (
    <div>
      <section className="searchResults">
        <h3 className="searchHeader">Explore NextBnB</h3>
        <ul className="results">
          {homes.map(home => (
            <li key={home.id} className="resultContainer">
              <Link className="resultLink" to={`/house/${home.id}`}>
                <img src={home.images.length > 0 ? home.images[0].url : 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'} className="propertyImg" />
                <p className="currentName">{home.name}</p>
                <p className="currentDetails">{home.guest ? home.guest : '4'} guests - ${home.price} per night - Free Cancellation</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="mapContainer">
      </section>
    </div>
  )
}
export default HomeIndex
