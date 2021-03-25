import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  avatar: {
    backgroundColor: (props: any) => [[props.avatarColor], '!important'],
  },
})

export default useStyles
