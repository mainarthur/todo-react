import makeStyles from '@material-ui/core/styles/makeStyles'

import { Theme } from '@material-ui/core/styles/createMuiTheme'

const useStyle = makeStyles((theme: Theme) => ({
  addIcon: {
    fill: theme.palette.secondary.main,
  },
  paper: {
    minWidth: '25vw',
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  input: {
    width: '100%',
  },
}))

export default useStyle
