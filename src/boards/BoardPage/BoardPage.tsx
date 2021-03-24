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

import clsx from 'clsx'

import BoardHeader from '../BoardHeader'
import ToDoList from '../ToDoList'

import useStyles from './styles'

import Board from '../../models/Board'
import BoardFooter from '../BoardFooter'
import { RootState } from '../../redux/reducers'
import { createAsyncAction } from '../../redux/helpers'
import { requestBoardsAction } from '../../redux/actions/boardsActions'
import ErrorSnackBar from '../../common/ErrorSnackBar'
import AddNewBoard from '../AddNewBoard'

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
      await createAsyncAction<Board[]>(dispatch, requestBoardsAction(user))

      setIsBoardsLoaded(true)

      if (isLoadError) {
        setIsLoadError(false)
      }
    } catch (err) {
      if (!isLoadError) {
        setIsLoadError(true)
      }
    } finally {
      setIsLoading(false)
    }
  }, [user, dispatch, isLoadError])

  useEffect(() => {
    if (user && !isLoading && !isBoardsLoaded) {
      setIsLoading(true)
      loadBoards()
    }
  }, [user, isLoading, isBoardsLoaded, loadBoards])

  return (
    <Grid container className={classes.root} spacing={3}>
      <Grid container className={classes.boardsWrap}>
        <Grid className={classes.boardsContent}>
          {boards && boards.map((board) => (
            <Paper key={board.id} elevation={3} className={classes.boardCard}>
              <BoardHeader title={board.name} board={board} />
              <Divider />
              <ToDoList boardId={board.id} />
              <Divider className={classes.divider} />
              <BoardFooter boardId={board.id} />
            </Paper>
          ))}
          <Paper elevation={3} className={clsx(classes.boardCard, classes.addNewBoardCard)}>
            <AddNewBoard />
          </Paper>
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
