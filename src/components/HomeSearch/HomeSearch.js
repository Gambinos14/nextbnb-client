import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import apiUrl from '../../apiConfig'
import axios from 'axios'
import './homesearch.scss'

const HomeSearch = (props) => {
  const searchString = props.searchParam.toLowerCase()
  // console.log(searchString)
  const arrayOfStrings = searchString.split(' ')
  arrayOfStrings.forEach((element, index) => {
    const capitalizeFirstLetter = arrayOfStrings[index].charAt(0).toUpperCase()
    const remainderOfString = arrayOfStrings[index].slice(1)
    arrayOfStrings[index] = capitalizeFirstLetter + remainderOfString
  })
  const headerText = arrayOfStrings.join(' ')

  const [homes, setHomes] = useState([])
  const [currentSearchLocation, setSearchLocation] = useState('')

  useEffect(() => {
    axios(`${apiUrl}/houses/${headerText}/`)
      .then(res => {
        setHomes(res.data)
        setSearchLocation(headerText)
        props.setSearch('')
      })
      .catch(() => props.msgAlert({ message: 'We could not find any homes ...', variant: 'danger' }))
  }, [])

  if (homes.length === 0) {
    return (
      <div className="searchHeader">We have no homes yet at this destination ...</div>
    )
  }

  return (
    <div>
      <section className="searchResults">
        <h3 className="searchHeader">Explore Homes in {currentSearchLocation}</h3>
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
export default HomeSearch
