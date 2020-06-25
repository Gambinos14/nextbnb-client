import React, { useState, useEffect } from 'react'
import { Link, Redirect, withRouter } from 'react-router-dom'
import Carousel from 'react-bootstrap/Carousel'
import './home.scss'
import apiUrl from '../../apiConfig'
import axios from 'axios'
import Form from 'react-bootstrap/Form'

const Home = (props) => {
  const [homes, setHomes] = useState([])
  const [redirect, setRedirect] = useState(false)

  useEffect(() => {
    axios(`${apiUrl}/houses/featured/True`)
      .then(res => {
        // console.log(res)
        setHomes(res.data)
      })
      .catch(() => props.msgAlert({ message: 'Issue Retrieving Featured Homes ...', variant: 'danger' }))
  }, [])

  const handleSearchInput = (event) => {
    props.setSearch(event.target.value)
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    setRedirect(true)
  }

  const handleHouseIndex = (event) => {
    props.history.push('/houses')
  }

  if (redirect) {
    return <Redirect to={'houses/search'} />
  }

  return (
    <div className='hero'>
      <Carousel interval='3000'>
        <Carousel.Item>
          <img
            className="d-block w-100 img"
            src="https://d1v1n2d34vm51j.cloudfront.net/wp-content/uploads/AdobeStock_46360603.jpg"
            alt="Third slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100 img"
            src="https://i2.wp.com/thepointsguy.com/wp-content/uploads/2020/05/PJM020719Q202_Luxe_WanakaNZ_LivingRoom_0264-LightOn_R1-scaled.jpg?fit=2560%2C1707px&ssl=1"
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100 img"
            src="https://www.asiaone.com/sites/default/files/inline-images/050719_airbnbluxebali_0.jpg"
            alt="Second slide"
          />
        </Carousel.Item>
      </Carousel>
      <div className="positionSettings">
        <p className="mainHeader">Find your next getaway at nextbnb</p>
        <div className="searchContainer">
          <Form onSubmit={handleSearchSubmit}className="searchBar">
            <Form.Control type="text" name="search" placeholder="Search Our Collection of Homes" onChange={handleSearchInput} />
            <div className="searchButton"><button type='submit'></button></div>
          </Form>
        </div>
        <button className="houseIndexButton" onClick={handleHouseIndex}>View All Homes</button>
      </div>
      <div className="featured">
        <p>Featured Homes</p>
        <ul>
          {homes.map(home => (
            <Link className='linkDecoration' key={home.id} to={`/house/${home.id}`}>
              <li>
                <img src={home.images.length > 0 ? home.images[0].url : 'https://picsum.photos/200'}/>
                <div>
                  {home.name}
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default withRouter(Home)
