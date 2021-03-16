import Action from './Action'

interface AsyncAction<ResultType, PayloadType = {}> extends Action<PayloadType> {
  next(err?: any, result?: ResultType): void
}

export default AsyncAction
