import Action from './Action'

interface ActionGenerator<PayloadType> {
  (payload?: PayloadType): Action<PayloadType>
  type: string
  match(a: Action): a is Action<PayloadType>
}

export default ActionGenerator
