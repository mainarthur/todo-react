import makeStyles from '@material-ui/core/styles/makeStyles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'

const useStyle = makeStyles((theme: Theme) => ({
  paper: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  list: {
    width: '100%',
    paddingBottom: 0,
  },
  root: {
    minWidth: `calc(25vw + ${theme.spacing(4)}px)`,
  },
  reloadIcon: {
    fill: '#fff',
  },
  noToDoText: {
    padding: theme.spacing(5),
    textAlign: 'center',
  },
  bottomDnd: {
    height: theme.spacing(1),
    width: '100%',
  },
}))

export default useStyle
