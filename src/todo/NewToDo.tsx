import * as React from 'react'
import { connect } from 'react-redux'
import Alert from '@material-ui/lab/Alert'
import {
  createStyles,
  Grid,
  IconButton,
  Paper,
  Theme,
  WithStyles,
  withStyles,
  Input,
  InputAdornment,
  Snackbar,
} from '@material-ui/core'
import { Add } from '@material-ui/icons'
import { api } from '../api/api'
import NewToDoBody from '../api/bodies/NewToDoBody'
import NewToDoResponse from '../api/responses/NewToDoResponse'
import ToDo from '../models/ToDo'
import { changeNewToDoTextAction, toggleTextErrorAction } from '../redux/actions/newToDoActions'
import { addToDoAction } from '../redux/actions/toDoActions'
import { RootState } from '../redux/reducers'
import { NewToDoState } from '../redux/reducers/newToDoReducer'

interface DispatchProps {
  changeText: typeof changeNewToDoTextAction
  toggleTextError: typeof toggleTextErrorAction
  addToDo: typeof addToDoAction
}

type StateProps = {
  newTodoState: NewToDoState
  todos: ToDo[]
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

type Props = StateProps & DispatchProps & WithStyles<typeof styles>

class NewToDo extends React.Component<Props> {
  timerId: number

  onFormSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    this.onButtonClick()
  };

  onButtonClick = async () => {
    const {
      newTodoState: {
        textFieldValue,
        invalidText,
      },
      toggleTextError,
      changeText,
      addToDo,
    } = this.props

    const toDoText = textFieldValue.trim()

    if (toDoText === '') {
      clearTimeout(this.timerId)

      this.timerId = window.setTimeout(() => {
        const {
          newTodoState: {
            invalidText: invalidTextAtUpdate,
          },
          toggleTextError: toggleTextErrorAtUpdate,
        } = this.props

        if (invalidTextAtUpdate) {
          toggleTextErrorAtUpdate()
        }
      }, 5000)

      return !invalidText && toggleTextError()
    }

    changeText('')
    if (invalidText) {
      toggleTextError()
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

    return true
  };

  onTextChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const newText = ev.target.value
    const { newTodoState: { invalidText }, toggleTextError, changeText } = this.props

    if (newText !== '') {
      if (invalidText) {
        toggleTextError()
      }
    }
    changeText(newText)
  };

  handleKeyPress = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Enter') {
      this.onButtonClick()
    }
  }

  onSnackBarClose = () => {
    const { newTodoState: { invalidText }, toggleTextError } = this.props

    if (invalidText) {
      toggleTextError()
    }
  }

  render(): JSX.Element {
    const { newTodoState: { invalidText, textFieldValue }, classes } = this.props

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
        <Snackbar open={invalidText}>
          <Alert
            elevation={6}
            variant="filled"
            severity="error"
            onClose={this.onSnackBarClose}
          >
            Text is required
          </Alert>
        </Snackbar>
      </Grid>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => ({
  newTodoState: state.newToDo,
  todos: state.todos,
})

const mapDispatchToProps: DispatchProps = {
  changeText: changeNewToDoTextAction,
  toggleTextError: toggleTextErrorAction,
  addToDo: addToDoAction,
}

export default connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(NewToDo))
