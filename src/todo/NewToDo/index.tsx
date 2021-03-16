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
import { useDispatch, useSelector } from 'react-redux'

import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import CircularProgress from '@material-ui/core/CircularProgress'

import { Add } from '@material-ui/icons'

import ErrorSnackBar from '../../common/ErrorSnackBar'

import { addToDoAction, /* newToDoRequestAction */ } from '../../redux/actions/toDoActions'
import useStyle from './styles'
import { RootState } from '../../redux/reducers'
import requestNewToDo from '../../redux/actions/requests'
import { RequestStatus } from '../../redux/constants'

const NewToDo: FC = () => {
  const classes = useStyle()

  const [newTaskText, setNewTaskText] = useState('')
  const [isInvalidText, setIsInvalidText] = useState(false)
  const [loading, setLoading] = useState(false)
  const [requestStatus, setRequestStatus] = useState(RequestStatus.NONE)

  const inputRef = useRef<HTMLDivElement>(null)

  const {
    loading: appLoading,
    error: appError,
  } = useSelector((state: RootState) => state.app)

  const dispatch = useDispatch()

  const appDisabled = appLoading || appError || loading

  const onSnackBarClose = useCallback(() => {
    if (isInvalidText) {
      setIsInvalidText(false)
    }
    if (requestStatus === RequestStatus.ERROR) {
      setRequestStatus(RequestStatus.NONE)
    }
  }, [isInvalidText, setIsInvalidText, requestStatus, setRequestStatus])

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
        setLoading(true)
        const newToDo = await requestNewToDo(dispatch, toDoText)
        dispatch(addToDoAction(newToDo))
        setRequestStatus(RequestStatus.OK)
      } catch (err) {
        setRequestStatus(RequestStatus.ERROR)
      } finally {
        setLoading(false)
      }
    }
  }, [
    isInvalidText,
    newTaskText,
    setIsInvalidText,
    setRequestStatus,
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
  }, [isInvalidText, setIsInvalidText, setNewTaskText])

  const handleKeyPress = useCallback((ev: KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Enter') {
      onButtonClick()
    }
  }, [onButtonClick])

  useEffect(() => {
    if (requestStatus === RequestStatus.OK) {
      setNewTaskText('')
      if (inputRef.current) {
        const input = inputRef.current.querySelector('input')

        if (input !== document.activeElement) {
          input.focus()
        }
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
          disabled={appDisabled}
          endAdornment={
            (
              <InputAdornment position="end">
                <IconButton disabled={appDisabled} onClick={onButtonClick}>
                  {loading ? <CircularProgress size="1.5rem" /> : <Add className={classes.addIcon} />}
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
