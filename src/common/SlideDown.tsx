import * as React from 'react'
import { FC } from 'react'

import Slide, { SlideProps } from '@material-ui/core/Slide'

type Props = Omit<SlideProps, 'direction'>

const SlideDown: FC<Props> = (props: Props) => {
  const { children } = props
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Slide direction="down" {...props}>
      {children}
    </Slide>
  )
}

export default SlideDown
