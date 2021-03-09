import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createMuiTheme, ThemeProvider } from '@material-ui/core'
import App from './App'
import Login from './login/Login'
import Register from './register/Register'
import Router from './routing/Router'
import Route from './routing/Route'
import routes from './routing/config'
import NotFound from './common/NotFound'
import store from './redux/store'
import ToDoAppBar from './common/ToDoAppBar'
import { green } from '@material-ui/core/colors'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: green[500],
    },
    secondary: {
      main: '#F39C12',
    },
  },
})

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <Router routes={routes} NotFound={NotFound}>
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
    </Provider>
  </ThemeProvider>,
  document.querySelector('.root'),
)
