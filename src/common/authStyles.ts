import makeStyles from '@material-ui/core/styles/makeStyles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'

const useStyle = makeStyles((theme: Theme) => ({
  root: {
    minHeight: '100vh',
  },
  paper: {
    padding: theme.spacing(3),
    minWidth: '20vw',
  },
  textField: {
    width: '100%',
  },
  gridItem: {
    width: '100%',
  },
  button: {
    width: '100%',
    color: '#fff',
  },
  buttonGrid: {
    minWidth: '85.75px',
    width: '100%',
    maxWidth: '133.75px',
    boxSizing: 'border-box',
  },
  progressBar: {
    marginLeft: theme.spacing(0.5),
  },
}))

export default useStyle
