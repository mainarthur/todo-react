import * as React from 'react'
import {
  FC,
  useState,
  useRef,
  useEffect,
} from 'react'

import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

import useStyles from './styles'
import InputAdd from '../InputAdd'

type Props = {
  onAdd: (text: string) => void
  placeholder: string
  addText: string
}

const AddNew: FC<Props> = ({
  onAdd,
  placeholder,
  addText,
}: Props) => {
  const classes = useStyles()

  const [isInputDisplayed, setIsInputDsiplayed] = useState(false)
  const inputRef = useRef<HTMLDivElement>()

  const handleAddCard = () => {
    setIsInputDsiplayed(true)
  }

  const handleOnAdd = (text: string) => {
    setIsInputDsiplayed(false)
    onAdd(text)
  }
  const handleCloseInput = () => {
    setIsInputDsiplayed(false)
  }

  useEffect(() => {
    if (isInputDisplayed) {
      if (inputRef.current) {
        const input = inputRef.current.querySelector('input')

        if (input) {
          input.focus()
        }
      }
    }
  }, [isInputDisplayed])

  if (!isInputDisplayed) {
    return (
      <CardActionArea>
        <CardContent onClick={handleAddCard}>
          <Typography component="span" variant="h6">
            {addText}
          </Typography>
        </CardContent>
      </CardActionArea>
    )
  }
  return (
    <Box className={classes.boardButton}>
      <InputAdd
        placeholder={placeholder}
        ref={inputRef}
        onAdd={handleOnAdd}
        onBlur={handleCloseInput}
      />
    </Box>
  )
}

export default AddNew
