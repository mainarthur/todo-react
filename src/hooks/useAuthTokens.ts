import { useSelector } from 'react-redux'
import { RootState } from '../redux/reducers'

const useAuthTokens = () => useSelector((state: RootState) => state.tokens)

export default useAuthTokens
