import createStyles from '@material-ui/core/styles/createStyles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { WithStyles } from '@material-ui/core/styles/withStyles'

const styles = (theme: Theme) => createStyles({
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
})

export type StyleProps = WithStyles<typeof styles>

export default styles
