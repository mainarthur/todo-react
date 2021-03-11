import * as React from 'react'
import {
  useState,
  ChangeEvent,
  KeyboardEvent,
  FC,
} from 'react'
import { useDispatch } from 'react-redux'

import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'

import { Add } from '@material-ui/icons'

import ErrorSnackBar from '../common/ErrorSnackBar'

import { api } from '../api/api'
import NewToDoBody from '../api/bodies/NewToDoBody'
import NewToDoResponse from '../api/responses/NewToDoResponse'

import { addToDoAction } from '../redux/actions/toDoActions'
import useStyle from './NewToDoStyles'
import ToDo from '../models/ToDo'

const NewToDo: FC = () => {
  const classes = useStyle()

  const [text, setText] = useState('')
  const [invalidText, setInvalidText] = useState(false)

  const dispatch = useDispatch()

  const addToDo = (toDo: ToDo) => dispatch(addToDoAction(toDo))

  const onSnackBarClose = () => {
    if (invalidText) {
      setInvalidText(false)
    }
  }

  const onButtonClick = async (): Promise<void> => {
    const toDoText = text.trim()

    if (toDoText === '') {
      if (!invalidText) {
        setInvalidText(true)
      }
      return null
    }

    setText('')
    if (invalidText) {
      setInvalidText(false)
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
  }

  const onTextChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const { target: { value: newText } } = ev

    if (newText !== '') {
      if (invalidText) {
        setInvalidText(false)
      }
    }

    setText(newText)
  }

  const handleKeyPress = (ev: KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Enter') {
      onButtonClick()
    }
  }

  return (
    <Grid item>
      <Paper className={classes.paper}>
        <Input
          color="secondary"
          className={classes.input}
          onChange={onTextChange}
          value={text}
          onKeyPress={handleKeyPress}
          placeholder="New task"
          endAdornment={
            (
              <InputAdornment position="end">
                <IconButton onClick={onButtonClick}>
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
        onClose={onSnackBarClose}
      >
        Text is required
      </ErrorSnackBar>
    </Grid>
  )
}

export default NewToDo
