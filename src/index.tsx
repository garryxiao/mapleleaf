import React from 'react'
import ReactDOM from 'react-dom'
import { UserStateProvider, NotifierProvider } from 'etsoo-react'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { LanguageStateProvider } from './app/Settings'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.render(
  <React.Fragment>
    <UserStateProvider>
      <LanguageStateProvider>
        <NotifierProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </NotifierProvider>
      </LanguageStateProvider>
    </UserStateProvider>
  </React.Fragment>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()