import * as React from 'react'
import {
  useState,
  ChangeEvent,
  KeyboardEvent,
  FC,
  useRef,
  useEffect,
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

  const [text, setText] = useState('')
  const [invalidText, setInvalidText] = useState(false)

  const {
    loading: appLoading,
    error: appError,
  } = useSelector((state: RootState) => state.app)

  const {
    loading,
    error,
    ok,
  } = useSelector((state: RootState) => state.newToDo)

  const appDisabled = appLoading || appError || loading

  const prevOk = useRef(false)

  const dispatch = useDispatch()

  const newToDoRequest = (newToDoText: string) => dispatch(newToDoRequestAction(newToDoText))

  const onSnackBarClose = () => {
    if (invalidText) {
      setInvalidText(false)
    }
  }

  const onButtonClick = async () => {
    const toDoText = text.trim()

    if (toDoText === '') {
      if (!invalidText) {
        setInvalidText(true)
      }
    } else {
      if (invalidText) {
        setInvalidText(false)
      }

      newToDoRequest(toDoText)
    }
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

  useEffect(() => {
    if (ok && !prevOk.current) {
      setText('')
    }
    prevOk.current = ok
  }, [ok])

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
        open={invalidText}
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
