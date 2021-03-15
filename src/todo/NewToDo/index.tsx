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

import { newToDoRequestAction } from '../../redux/actions/toDoActions'
import useStyle from './styles'
import { RootState } from '../../redux/reducers'

const NewToDo: FC = () => {
  const classes = useStyle()

  const [newTaskText, setNewTaskText] = useState('')
  const [isInvalidText, setIsInvalidText] = useState(false)

  const prevOk = useRef(false)
  const inputRef = useRef<HTMLDivElement>(null)

  const {
    loading: appLoading,
    error: appError,
  } = useSelector((state: RootState) => state.app)

  const {
    loading,
    error,
    ok,
  } = useSelector((state: RootState) => state.newToDo)

  const dispatch = useDispatch()

  const appDisabled = appLoading || appError || loading

  const newToDoRequest = useCallback(
    (newToDoText: string) => dispatch(newToDoRequestAction(newToDoText)),
    [dispatch],
  )

  const onSnackBarClose = useCallback(() => {
    if (isInvalidText) {
      setIsInvalidText(false)
    }
  }, [isInvalidText, setIsInvalidText])

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

      newToDoRequest(toDoText)
    }
  }, [isInvalidText, newTaskText, setIsInvalidText, newToDoRequest])

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
    if (ok && !prevOk.current) {
      setNewTaskText('')
      if (inputRef.current) {
        const input = inputRef.current.querySelector('input')

        if (input) {
          input.focus()
        }
      }
    }
    prevOk.current = ok
  }, [ok])

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
        open={error}
        autoHide
        onClose={onSnackBarClose}
      >
        Can&apos;t add new toDo
      </ErrorSnackBar>
    </Grid>
  )
}

export default NewToDo
