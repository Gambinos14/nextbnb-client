import React from 'react'
import ReactDOM from 'react-dom'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import './index.scss'

import App from './components/App/App'
import { HashRouter } from 'react-router-dom'

const stripePromise = loadStripe('pk_test_51H30P4CzwcJcSMpGzNVuWDNY3zWMVqIo1fw8jxuL6aWgCk2aHUmUaKkyHC48ZQTmWrL2WFINPZCcOZSxXIFFWLcb00IepER00t')

const appJsx = (
  <HashRouter>
    <Elements stripe={ stripePromise }>
      <App />
    </Elements>
  </HashRouter>
)

ReactDOM.render(appJsx, document.getElementById('root'))
