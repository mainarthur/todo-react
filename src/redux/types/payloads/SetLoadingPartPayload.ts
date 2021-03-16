import { LoadingPart } from '../../../todo/constants'

export default interface SetLoadingPartPayload {
  ids: string[],
  loadingPart: LoadingPart
}
