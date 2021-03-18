import * as React from 'react'
import { FC, useState } from 'react'

import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

import useStyles from './styles'
import InputAdd from '../InputAdd'

type Props = {
  boardId: string
}

const BoardFooter: FC<Props> = ({ boardId }: Props) => {
  const classes = useStyles()

  const [showInput, setShowInput] = useState(false)

  const handleAddCard = () => {
    setShowInput(true)
  }
  const handleCloseInput = () => {
    setShowInput(false)
  }

  if (!showInput) {
    return (
      <CardActionArea>
        <CardContent onClick={handleAddCard}>
          <Typography component="span" variant="h6">
            Add new ToDo
          </Typography>
        </CardContent>
      </CardActionArea>
    )
  }
  return (
    <form className={classes.boardButton}>
      <InputAdd onAdd={handleCloseInput} />
    </form>
  )
}

export default BoardFooter
