import * as React from 'react'

import IconButton from '@material-ui/core/IconButton'

import ReloadIcon from '@material-ui/icons/Cached'

import createStyles from '@material-ui/core/styles/createStyles'
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles'

const styles = () => createStyles({
  reloadIcon: {
    fill: '#fff',
  },
})

interface OwnProps {
  onReloadTodosClick(): void
}

type Props = OwnProps & WithStyles<typeof styles>

class ReloadButton extends React.PureComponent<Props> {
  render() {
    const {
      onReloadTodosClick,
      classes,
    } = this.props

    return (
      <IconButton onClick={onReloadTodosClick}>
        <ReloadIcon className={classes.reloadIcon} />
      </IconButton>
    )
  }
}

export default withStyles(styles)(ReloadButton)
