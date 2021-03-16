import makeStyles from '@material-ui/core/styles/makeStyles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'

const useStyle = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(4),
    marginLeft: 0,
    marginRight: 0,
    width: '100%',
  },
}))

export default useStyle
