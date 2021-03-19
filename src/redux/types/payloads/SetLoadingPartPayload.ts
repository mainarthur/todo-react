import { LoadingPart } from '../../../common/constants'

export default interface SetLoadingPartPayload {
  ids: string[],
  loadingPart: LoadingPart
}
