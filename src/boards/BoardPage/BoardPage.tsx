import * as React from 'react'
import {
  FC,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

import BoardHeader from '../BoardHeader'
import ToDoList from '../ToDoList'

import useStyles from './styles'

import Board from '../../models/Board'
import BoardFooter from '../BoardFooter'
import { BoardsState } from '../../redux/reducers/boardsReducer'
import { RootState } from '../../redux/reducers'
import User from '../../models/User'
import { createAsyncAction } from '../../redux/helpers'
import { requestBoardsAction, setBoardsAction } from '../../redux/actions/boardsActions'
import ErrorSnackBar from '../../common/ErrorSnackBar'
import ReloadButton from '../../common/ReloadButton'
import { connectDB, defaultStoreName, getDatabaseName } from '../../indexeddb/connect'

const BoardPage: FC = () => {
  const classes = useStyles()

  const [isLoading, setIsLoading] = useState(false)
  const [isBoardsLoaded, setIsBoardsLoaded] = useState(false)
  const [isLoadError, setIsLoadError] = useState(false)

  const boards = useSelector((state: RootState) => state.boards)
  const { user } = useSelector((state: RootState) => state.app)

  const dispatch = useDispatch()

  const loadBoards = useCallback(async () => {
    try {
      const { _id: userId } = user

      const db = await connectDB(getDatabaseName(userId))
      const loadedBoards = await createAsyncAction<Board[]>(dispatch, requestBoardsAction())

      for (let i = 0; i < loadedBoards.length; i += 1) {
        const board = loadedBoards[i]
        const { _id: boardId } = board

        const transaction = db.transaction(defaultStoreName, 'readwrite')
        const store = transaction.objectStore(defaultStoreName)

        if (!board.deleted) {
          store.put(board)
        } else {
          store.delete(boardId)
        }
      }

      const transaction = db.transaction(defaultStoreName, 'readwrite')
      const store = transaction.objectStore(defaultStoreName)
      const boardsRequest = store.getAll()

      boardsRequest.addEventListener('success', () => {
        const allBoards: Board[] = boardsRequest.result

        dispatch(setBoardsAction(allBoards))
        setIsBoardsLoaded(true)
      })
    } catch (err) {
      setIsLoadError(true)
    } finally {
      if (isLoadError) {
        setIsLoadError(false)
      }
    }
  }, [user, dispatch, isLoadError])

  useEffect(() => {
    if (user && !isLoading && !isBoardsLoaded) {
      setIsLoading(true)
      loadBoards()
      setIsLoading(false)
    }
  }, [user, isLoading, isBoardsLoaded, loadBoards])

  return (
    <Grid container className={classes.root} spacing={3}>
      <Grid container className={classes.boardsWrap}>
        <Grid className={classes.boardsContent}>
          {boards && boards.map((board) => {
            const { _id: boardId, name, todos } = board

            return (
              <Paper key={boardId} elevation={3} className={classes.boardCard}>
                <BoardHeader title={name} boardId={boardId} />
                <Divider />
                <ToDoList todos={todos ?? []} />
                <Divider className={classes.divider} />
                <BoardFooter boardId={boardId} />
              </Paper>
            )
          })}
        </Grid>
      </Grid>
      <ErrorSnackBar
        open={isLoadError}
      >
        Boards Loading Error
      </ErrorSnackBar>
    </Grid>
  )
}

export default BoardPage
