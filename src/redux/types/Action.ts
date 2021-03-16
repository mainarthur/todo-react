export default interface Action<PayloadType = {}> {
  type: string
  payload?: PayloadType
}
