import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles((theme) => ({
  boardCard: {
    width: '380px',
    display: 'flex',
    maxHeight: '100%',
    overflowX: 'hidden',
    overflowY: 'hidden',
    marginLeft: '8px',
    marginRight: '8px',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      width: '300px',
    },
  },
  boardHeader: {
    padding: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  boardHeaderButton: {
    marginRight: '-12px',
  },
  boardButton: {
    padding: theme.spacing(2),
    justifyContent: 'center',
  },
  divider: {
    marginTop: theme.spacing(2),
  },
  cardRoot: {
    margin: theme.spacing(2),
    marginBottom: 20,
  },
  content: {
    flex: '1 0 auto',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: theme.spacing(2),
  },
  bottomBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(1),
  },
}))

export default useStyles
