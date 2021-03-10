import * as React from 'react'
import { connect } from 'react-redux'

import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'

import createStyles from '@material-ui/core/styles/createStyles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles'

import { Add } from '@material-ui/icons'

import ErrorSnackBar from '../common/ErrorSnackBar'

import { api } from '../api/api'
import NewToDoBody from '../api/bodies/NewToDoBody'
import NewToDoResponse from '../api/responses/NewToDoResponse'

import { addToDoAction } from '../redux/actions/toDoActions'

type State = {
  newToDoText: string
  invalidText: boolean
}

interface DispatchProps {
  addToDo: typeof addToDoAction
}

const styles = (theme: Theme) => createStyles({
  addIcon: {
    fill: theme.palette.secondary.main,
  },
  paper: {
    minWidth: '25vw',
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  input: {
    width: '100%',
  },
})

type Props = DispatchProps & WithStyles<typeof styles>

class NewToDo extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props)

    this.state = {
      newToDoText: '',
      invalidText: false,
    }
  }

  onFormSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    this.onButtonClick()
  };

  onButtonClick = async () => {
    const { addToDo } = this.props
    const { invalidText, newToDoText } = this.state

    const toDoText = newToDoText.trim()

    if (toDoText === '' && !invalidText) {
      return this.setState({
        invalidText: true,
      })
    }

    this.setState({
      newToDoText: '',
    })
    if (invalidText) {
      this.setState({
        invalidText: false,
      })
    }

    const toDoResponse = await api<NewToDoResponse, NewToDoBody>({
      endpoint: '/todo',
      method: 'POST',
      body: {
        text: toDoText,
      },
    })

    if (toDoResponse.status) {
      addToDo((toDoResponse as NewToDoResponse).result)
    }

    return null
  };

  onTextChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { invalidText } = this.state
    const { target: { value: newText } } = ev

    if (newText !== '') {
      if (invalidText) {
        this.setState({
          invalidText: false,
        })
      }
    }
    this.setState({
      newToDoText: newText,
    })
  };

  handleKeyPress = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Enter') {
      this.onButtonClick()
    }
  }

  onSnackBarClose = () => {
    const { invalidText } = this.state

    if (invalidText) {
      this.setState({
        invalidText: false,
      })
    }
  }

  render(): JSX.Element {
    const { classes } = this.props
    const { invalidText, newToDoText: textFieldValue } = this.state

    return (
      <Grid item>
        <Paper className={classes.paper}>
          <Input
            color="secondary"
            className={classes.input}
            onChange={this.onTextChange}
            value={textFieldValue}
            onKeyPress={this.handleKeyPress}
            placeholder="New task"
            endAdornment={
              (
                <InputAdornment position="end">
                  <IconButton onClick={this.onButtonClick}>
                    <Add className={classes.addIcon} />
                  </IconButton>
                </InputAdornment>
              )
            }
          />
        </Paper>
        <ErrorSnackBar
          open={invalidText}
          autoHide
          onClose={this.onSnackBarClose}
        >
          Text is required
        </ErrorSnackBar>
      </Grid>
    )
  }
}

const mapStateToProps = () => ({})

const mapDispatchToProps: DispatchProps = {
  addToDo: addToDoAction,
}

export default connect<{}, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(NewToDo))
