import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider as ReduxStoreProvider } from 'react-redux'

import CssBaseline from '@material-ui/core/CssBaseline'

import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import { ThemeProvider } from '@material-ui/core/styles'

import ToDoAppBar from './common/ToDoAppBar'
import App from './App'
import Login from './login'
import Register from './register'
import NotFound from './common/NotFound'

import Router from './routing/Router'
import Route from './routing/Route'
import routes from './routing/config'

import store from './redux/store'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#0d47a1',
      light: '#5472d3',
      dark: '#002171',
    },
    secondary: {
      main: '#bf360c',
      light: '#f9683a',
      dark: '#870000',
    },
  },
})

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <ReduxStoreProvider store={store}>
      <Router routes={routes} NotFound={<NotFound />}>
        <CssBaseline />
        <ToDoAppBar />
        <Route path={routes.home.path}>
          <App />
        </Route>
        <Route path={routes.login.path}>
          <Login />
        </Route>
        <Route path={routes.register.path}>
          <Register />
        </Route>
      </Router>
    </ReduxStoreProvider>
  </ThemeProvider>,
  document.querySelector('.root'),
)
