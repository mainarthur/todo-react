import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  avatar: {
    fill: (props) => props?.avatarColor ?? '#000',
  },
})

export default useStyles
