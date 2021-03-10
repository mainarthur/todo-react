import makeStyles from '@material-ui/core/styles/makeStyles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'

const toolBarPadding = 4

const useStyle = makeStyles((theme: Theme) => ({
  title: {
    flexGrow: 1,
    color: '#fff',
  },
  toolBar: {
    paddingLeft: theme.spacing(toolBarPadding),
    paddingRight: theme.spacing(toolBarPadding),
  },
  logOutIcon: {
    fill: '#fff',
  },
}))

export default useStyle
