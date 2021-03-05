import * as React from 'react'
import { connect } from 'react-redux'
import Card from './common/Card'
import NewToDo from './todo/NewToDo'
import ToDoList from './todo/ToDoList'
import { history } from './routing/RouterContext'
import UserResponse from './api/responses/UserResponse'
import { api, refreshTokens } from './api/api'
import { err } from './logging/logger'
import { AppState } from './redux/reducers/appReducer'
import setUserAction from './redux/actions/appActions'
import { RootState } from './redux/reducers'

interface DispatchProps {
  setUser: typeof setUserAction
}

type Props = DispatchProps & AppState

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
    const { user } = this.props

    if (!user) {
      return null
    }

    return (
      <>
        <Card>
          <NewToDo />
        </Card>
        <Card id="todos-card">
          <ToDoList user={user} />
        </Card>
      </>
    )
  }
}

const mapStateToProps = (state: RootState): AppState => ({ ...state.app })

const mapDispatchToProps: DispatchProps = {
  setUser: setUserAction,
}

export default connect<AppState, DispatchProps>(mapStateToProps,
  mapDispatchToProps)(App)
