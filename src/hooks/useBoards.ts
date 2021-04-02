import { useSelector } from 'react-redux'
import { RootState } from '../redux/reducers'

const useBoards = () => useSelector((state: RootState) => state.boards) ?? []


export default useBoards
