import React, { Fragment } from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

const authenticatedOptions = (
  <Fragment>
    <Nav.Link href="#bookings">My Bookings</Nav.Link>
    <Nav.Link href="#change-password">Change Password</Nav.Link>
    <Nav.Link href="#sign-out">Sign Out</Nav.Link>
  </Fragment>
)

const guestAuthenticatedOptions = (
  <Fragment>
    <Nav.Link href="#bookings">My Bookings</Nav.Link>
    <Nav.Link href="#sign-out">Sign Out</Nav.Link>
  </Fragment>
)

const unauthenticatedOptions = (
  <Fragment>
    <Nav.Link href="#sign-up">Sign Up</Nav.Link>
    <Nav.Link href="#sign-in">Sign In</Nav.Link>
    <Nav.Link href="#guest-sign-in">Guest</Nav.Link>
  </Fragment>
)

const alwaysOptions = (
  <Fragment>
    <Nav.Link href="#/">Home</Nav.Link>
  </Fragment>
)

const Header = ({ user }) => {
  if (user) {
    if (user.email === 'guest@account.com') {
      return (
        <Navbar bg="transparent" expand="md">
          <Navbar.Brand className='logo' href="#">
            <i className="logo fas fa-chevron-circle-right"></i>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              { alwaysOptions }
              { guestAuthenticatedOptions}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      )
    }
  }
  return (
    <Navbar bg="transparent" expand="md">
      <Navbar.Brand className='logo' href="#">
        <i className="logo fas fa-chevron-circle-right"></i>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          { alwaysOptions }
          { user ? authenticatedOptions : unauthenticatedOptions }
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header
