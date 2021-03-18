import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyle = makeStyles(() => ({
  root: {
    display: 'flex',
  },
  content: {
    flex: '1 1 auto',
    padding: '64px 15px 15px',
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
  },
}))

export default useStyle
