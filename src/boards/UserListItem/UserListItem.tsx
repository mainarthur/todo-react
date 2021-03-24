import * as React from 'react'
import {
  useState,
  FC,
  useEffect,
} from 'react'

import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Skeleton from '@material-ui/lab/Skeleton'

import PersonIcon from '@material-ui/icons/Person'

import User from '../../models/User'
import useStyles from './styles'

interface Props {
  userId: string
}

const UserListItem: FC<Props> = ({ userId }: Props) => {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(false)

  const classes = useStyles(user as any)

  useEffect(() => {
    if (!user && !isLoading) {
      setIsLoading(true)
    }
  }, [user, isLoading])

  if (!isLoading || !user) {
    return <Skeleton variant="rect" animation="wave" height={72} />
  }

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar>
          <PersonIcon className={classes.avatar} />
        </Avatar>
      </ListItemAvatar>
    </ListItem>
  )
}

export default UserListItem
