import * as React from 'react'
import {
  useState,
  FC,
  useEffect,
} from 'react'
import { useDispatch } from 'react-redux'

import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Skeleton from '@material-ui/lab/Skeleton'

import PersonIcon from '@material-ui/icons/Person'

import User from '../../models/User'
import useStyles from './styles'
import { createAsyncAction } from '../../redux/helpers'
import { requestUserAction } from '../../redux/actions/appActions'

interface Props {
  userId: string
}

const UserListItem: FC<Props> = ({ userId }: Props) => {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()

  const classes = useStyles((user || { avatarColor: '#000' }) as any)

  useEffect(() => {
    if (!user && !isLoading) {
      setIsLoading(true);
      (async () => {
        try {
          const loadedUser = await createAsyncAction<User>(dispatch, requestUserAction({
            id: userId,
          }))
          setUser(loadedUser)
        } finally {
          setIsLoading(false)
        }
      })()
    }
  }, [userId, user, isLoading, dispatch])

  if (isLoading || !user) {
    return <Skeleton variant="rect" animation="wave" height={72} />
  }

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar className={classes.avatar}>
          <PersonIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={user?.name} secondary={user?.email} />
    </ListItem>
  )
}

export default UserListItem
