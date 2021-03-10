import * as React from 'react'

import Slide, { SlideProps } from '@material-ui/core/Slide'

type Props = Omit<SlideProps, 'direction'>

class SlideDown extends React.PureComponent<Props> {
  render() {
    const {
      ref,
      timeout,
      children,
    } = this.props

    return (
      // eslint-disable-next-line react/destructuring-assignment
      <Slide direction="down" ref={ref} timeout={timeout} in={this.props.in}>
        {children}
      </Slide>
    )
  }
}

export default SlideDown
