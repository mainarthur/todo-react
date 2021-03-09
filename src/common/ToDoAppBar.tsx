import * as React from 'react'
import { connect } from 'react-redux'
import {
  AppBar,
  createStyles,
  IconButton,
  Theme,
  Toolbar,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { deleteTokensAction } from '../redux/actions/tokenActions'
import { RootState } from '../redux/reducers'
import { TokensState } from '../redux/reducers/tokensReducer'
import { history } from '../routing/RouterContext'

interface DispatchProps {
  deleteTokens: typeof deleteTokensAction
}

const toolBarPadding = 4

const styles = (theme: Theme) => createStyles({
  title: {
    flexGrow: 1,
    color: '#fff',
  },
  toolBar: {
    paddingLeft: theme.spacing(toolBarPadding),
    paddingRight: theme.spacing(toolBarPadding),
  },
  logOutIcon: {
    fill: '#fff',
  },
})

type Props = DispatchProps & TokensState & WithStyles<typeof styles>

class ToDoAppBar extends React.PureComponent<Props> {
  onLogOutClick = () => {
    const { deleteTokens } = this.props

    deleteTokens()
    localStorage.clear()
    history.push('/login')
  }

  render() {
    const { classes, accessToken } = this.props

    return (
      <AppBar>
        <Toolbar className={classes.toolBar}>
          <Typography className={classes.title} variant="h5">
            To-Do List
          </Typography>
          {accessToken !== '' ? (
            <IconButton onClick={this.onLogOutClick}>
              <ExitToAppIcon className={classes.logOutIcon} />
            </IconButton>
          ) : null}
        </Toolbar>
      </AppBar>
    )
  }
}

const mapStateToProps = (state: RootState): TokensState => ({
  ...state.tokens,
})

const mapDispatchToProps: DispatchProps = {
  deleteTokens: deleteTokensAction,
}

export default connect<TokensState, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(ToDoAppBar))
