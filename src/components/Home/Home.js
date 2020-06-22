import React from 'react'
import Carousel from 'react-bootstrap/Carousel'
import './home.scss'

const Home = () => {
  return (
    <div className='hero'>
      <Carousel interval='3000'>
        <Carousel.Item>
          <img
            className="d-block w-100 img"
            src="https://media.cntraveler.com/photos/5e18e330ac1cea00092e91d2/master/pass/airbnb-beach-dominican-6939168.jpeg"
            alt="First slide"
          />
          <Carousel.Caption>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100 img"
            src="https://outlawhotels.com/wp-content/uploads/2020/02/Airbnb-Canada.jpg"
            alt="Third slide"
          />

          <Carousel.Caption>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100 img"
            src="https://media.cntraveler.com/photos/5c40d940a5c1d51f43a9d2b5/master/w_820,c_limit/Bondi_23256482.jpg"
            alt="Third slide"
          />
          <Carousel.Caption>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  )
}

export default Home
