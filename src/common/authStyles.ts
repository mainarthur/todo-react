import {
  createStyles,
  Theme,
  WithStyles,
} from '@material-ui/core'

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
    width: '10vw',
    color: '#fff',
  },
})

export type StyleProps = WithStyles<typeof styles>

export default styles
