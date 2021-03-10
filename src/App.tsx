import * as React from 'react'
import { connect } from 'react-redux'

import Toolbar from '@material-ui/core/Toolbar'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

import createStyles from '@material-ui/core/styles/createStyles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles'

import NewToDo from './todo/NewToDo'
import ToDoList from './todo/ToDoList'

import { history } from './routing/RouterContext'

import { api, refreshTokens } from './api/api'
import UserResponse from './api/responses/UserResponse'

import { AppState } from './redux/reducers/appReducer'
import setUserAction from './redux/actions/appActions'
import { RootState } from './redux/reducers'

import { err } from './logging/logger'

interface DispatchProps {
  setUser: typeof setUserAction
}

const styles = (theme: Theme) => createStyles({
  root: {
    marginTop: theme.spacing(4),
  },
})

type Props = DispatchProps & AppState & WithStyles<typeof styles>

class App extends React.Component<Props> {
  constructor(props: Props | Readonly<Props>) {
    super(props)
    if (localStorage.getItem('access_token') == null) {
      history.push('/login')
    }
  }

  async componentDidMount() {
    try {
      await refreshTokens()

      const { user: userFromState, setUser } = this.props

      if (!userFromState) {
        const user = await api<UserResponse, {}>({
          endpoint: '/user',
        })

        if (user.status) {
          setUser((user as UserResponse).result)
        } else if (userFromState) {
          setUser(null)
        }
      }
    } catch (e) {
      err(e)
    }
  }

  componentWillUnmount() {
    const { setUser } = this.props

    setUser(null)
  }

  render(): JSX.Element {
    const { user, classes } = this.props

    if (!user) {
      return null
    }

    return (
      <Box>
        <Toolbar />
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="center"
          spacing={3}
          className={classes.root}
        >
          <NewToDo />
          <ToDoList user={user} />
        </Grid>
      </Box>
    )
  }
}

const mapStateToProps = (state: RootState): AppState => ({ ...state.app })

const mapDispatchToProps: DispatchProps = {
  setUser: setUserAction,
}

export default connect<AppState, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(App))
