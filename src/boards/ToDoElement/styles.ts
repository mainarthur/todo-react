import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles((theme) => ({
  cardRoot: {
    margin: theme.spacing(2),
    marginBottom: 20,
  },
  doneToDo: {
    textDecoration: 'line-through',
    color: theme.palette.error.main,
  },
}))

export default useStyles
