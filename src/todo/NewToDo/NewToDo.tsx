import * as React from 'react'
import {
  useState,
  ChangeEvent,
  KeyboardEvent,
  FC,
  useRef,
  useEffect,
  useCallback,
} from 'react'
import { useDispatch } from 'react-redux'

import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'

import { Add } from '@material-ui/icons'

import ErrorSnackBar from '../../common/ErrorSnackBar'

import useStyle from './styles'

import { addToDoAction, newToDoAction } from '../../redux/actions/toDoActions'
import { RequestStatus } from '../../redux/constants'
import { createAsyncAction } from '../../redux/helpers'

import NewToDoBody from '../../api/bodies/NewToDoBody'
import ToDo from '../../models/ToDo'
import ComponentProgressBar from '../../common/ComponentProgressBar'
import { LoadingPart } from '../constants'

const NewToDo: FC = () => {
  const classes = useStyle()

  const [newTaskText, setNewTaskText] = useState('')
  const [isInvalidText, setIsInvalidText] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [requestStatus, setRequestStatus] = useState(RequestStatus.NONE)

  const inputRef = useRef<HTMLDivElement>(null)

  const dispatch = useDispatch()

  const isControlsDisabled = isLoading

  const onSnackBarClose = useCallback(() => {
    if (isInvalidText) {
      setIsInvalidText(false)
    }
    if (requestStatus === RequestStatus.ERROR) {
      setRequestStatus(RequestStatus.NONE)
    }
  }, [isInvalidText, requestStatus])

  const onButtonClick = useCallback(async () => {
    const toDoText = newTaskText.trim()

    if (toDoText === '') {
      if (!isInvalidText) {
        setIsInvalidText(true)
      }
    } else {
      if (isInvalidText) {
        setIsInvalidText(false)
      }
      try {
        setIsLoading(true)

        const newToDo = await createAsyncAction<ToDo, NewToDoBody>(dispatch, newToDoAction({
          text: toDoText,
        }))

        newToDo.loadingPart = LoadingPart.NONE

        dispatch(addToDoAction(newToDo))
        setRequestStatus(RequestStatus.OK)
      } catch (err) {
        setRequestStatus(RequestStatus.ERROR)
      } finally {
        setIsLoading(false)
      }
    }
  }, [
    isInvalidText,
    newTaskText,
    dispatch,
  ])

  const onTextChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    const { target: { value: newText } } = ev

    if (newText !== '') {
      if (isInvalidText) {
        setIsInvalidText(false)
      }
    }

    setNewTaskText(newText)
  }, [isInvalidText])

  const handleKeyPress = useCallback((ev: KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Enter') {
      onButtonClick()
    }
  }, [onButtonClick])

  useEffect(() => {
    if (requestStatus === RequestStatus.OK) {
      setNewTaskText('')
      if (inputRef.current) {
        setTimeout(() => {
          const input = inputRef.current.querySelector('input')

          if (input !== document.activeElement) {
            input.focus()
          }
        }, 0)
      }
      setRequestStatus(RequestStatus.NONE)
    }
  }, [requestStatus])

  return (
    <Grid item>
      <Paper className={classes.paper}>
        <Input
          ref={inputRef}
          color="secondary"
          className={classes.input}
          onChange={onTextChange}
          value={newTaskText}
          onKeyPress={handleKeyPress}
          placeholder="New task"
          disabled={isControlsDisabled}
          endAdornment={
            (
              <InputAdornment position="end">
                <IconButton disabled={isControlsDisabled} onClick={onButtonClick}>
                  <ComponentProgressBar loading={isLoading}>
                    <Add className={classes.addIcon} />
                  </ComponentProgressBar>
                </IconButton>
              </InputAdornment>
            )
          }
        />
      </Paper>
      <ErrorSnackBar
        open={isInvalidText}
        autoHide
        onClose={onSnackBarClose}
      >
        Text is required
      </ErrorSnackBar>
      <ErrorSnackBar
        open={requestStatus === RequestStatus.ERROR}
        autoHide
        onClose={onSnackBarClose}
      >
        Can&apos;t add new ToDo
      </ErrorSnackBar>
    </Grid>
  )
}

export default NewToDo
