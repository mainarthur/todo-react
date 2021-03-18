import * as React from 'react'
import {
  FC,
  useState,
  forwardRef,
  useCallback,
  ChangeEvent,
  KeyboardEvent,
} from 'react'

import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'

import { Add } from '@material-ui/icons'

import ErrorSnackBar from '../../common/ErrorSnackBar'

import ComponentProgressBar from '../../common/ComponentProgressBar'

import useStyle from './styles'

type Props = {
  loading?: boolean,
  disabled?: boolean,
  onAdd(text: string): void
}

const InputAdd: FC<Props> = forwardRef(({
  loading,
  disabled,
  onAdd: onButtonClick,
}: Props, ref) => {
  const classes = useStyle()
  const [inputText, setInpuText] = useState('')
  const [isInvalidText, setIsInvalidText] = useState(false)

  const onSnackBarClose = useCallback(() => {
    if (isInvalidText) {
      setIsInvalidText(false)
    }
  }, [isInvalidText])

  const onTextChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    const { target: { value: newText } } = ev

    if (newText !== '') {
      if (isInvalidText) {
        setIsInvalidText(false)
      }
    }

    setInpuText(newText)
  }, [isInvalidText])

  const handleKeyPress = useCallback((ev: KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Enter') {
      onButtonClick(inputText)
    }
  }, [inputText, onButtonClick])

  return (
    <>
      <Input
        ref={ref}
        color="secondary"
        className={classes.input}
        onChange={onTextChange}
        value={inputText}
        onKeyPress={handleKeyPress}
        placeholder="New task"
        disabled={disabled}
        endAdornment={
          (
            <InputAdornment position="end">
              <IconButton disabled={disabled} onClick={() => onButtonClick(inputText)}>
                <ComponentProgressBar loading={loading}>
                  <Add className={classes.addIcon} />
                </ComponentProgressBar>
              </IconButton>
            </InputAdornment>
          )
        }
      />
      <ErrorSnackBar
        open={isInvalidText}
        autoHide
        onClose={onSnackBarClose}
      >
        Text is required
      </ErrorSnackBar>
    </>
  )
})

InputAdd.defaultProps = {
  loading: false,
  disabled: false,
}

export default InputAdd
