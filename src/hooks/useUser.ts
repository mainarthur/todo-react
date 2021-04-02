import { useSelector } from 'react-redux'
import { RootState } from '../redux/reducers'

const useUser = () => useSelector((state: RootState) => state.app).user

export default useUser
