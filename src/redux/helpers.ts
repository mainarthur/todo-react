import { Dispatch } from 'redux'
import Action from './Action'

function createAction<PayloadType>(name: string, prepare = (payload: PayloadType) => payload) {
  function action(payload): Action<PayloadType> {
    return {
      type: name,
      payload: prepare(payload)
    }
  }

  action.toString = () => name

  return action
}

function createAsyncAction<ResultType, PayloadType>(dispatch: Dispatch<any>, action: Action<PayloadType>) {
  return new Promise<ResultType>((res, rej) => {
    dispatch({
      ...action,
      next: (err, data: ResultType) => {
        if (err) {
          rej(err)
        } else {
          res(data)
        }
      },
    })
  })
}

export createAsyncAction
