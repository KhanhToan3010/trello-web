import { useState, useEffect } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar'
import BoardBar from '~/pages/Boards/BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { generatePlaceholderCard} from '~/utils/formatters'
import { isEmpty} from 'lodash'
import { mapOrder } from '~/utils/sorts'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
// import { mockData } from '~/apis/mock-data'
import { fetchBoardDetailsAPI, createNewCardAPI, createNewColumnAPI, updateBoardDetailsAPI, updateColumnDetailsAPI,
  moveCardToDifffrentColumnAPI
 } from '~/apis' 

function Board() {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    const boardId = '67eb57ecf3d0db9851366734'

    fetchBoardDetailsAPI(boardId).then((board) => {
      // sap sep cac column truoc khi du lieu dua xuong component con 
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      // xu li keo tha vao 1 coolumn rong
      board.columns.forEach( column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          // sap sep cac card trong column truoc khi du lieu dua xuong component con
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })

      setBoard(board)
    })
  }, [])

// Call Api tao moi cloumn va update state cua board
const createNewColumn =  async (newColumnData) => {
  const createdColumn = await createNewColumnAPI({
    ...newColumnData,
    boardId: board._id
  })
  
  // xu li keo tha card vao 1 column rong ( column moi duoc tao )
  createdColumn.cards = [generatePlaceholderCard(createdColumn)]
  createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

  // Update state cua board, thay vi phai refreshtrang ( fetch lai board ) 
  // ta update lai satate board 
  const newBoard = { ...board}
  newBoard.columns.push(createdColumn)
  newBoard.columnOrderIds.push(createdColumn._id)
  setBoard(newBoard)
}

// Call Api tao moi card va update state cua Card
const createNewCard =  async (newCardData) => {
  const createdCard = await createNewCardAPI({
    ...newCardData,
    boardId: board._id
  })
 

  // Update state cua board
  const newBoard = { ...board }
  // tim ban ghi column trong board, column ma chua card vua duoc tao 
  const columnToUpdate = newBoard.columns.find( column => column._id === createdCard.columnId)
  if (columnToUpdate) {

    if (columnToUpdate.cards.some( card => card.FE_PlaceholderCard)) {
      columnToUpdate.cards = [createdCard]
      columnToUpdate.cardOrderIds = [createdCard._id]

    } else {
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard._id)
    }
  }
  console.log('columnToUpDate: ',columnToUpdate)
  setBoard(newBoard)
}

// Call Api khi keo tha column va update state cua board

const moveColumns = (dndOrderedColumns) => {

  // Update columnOrderIds trong board
  const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
  const newBoard = { ...board}
  newBoard.columns = dndOrderedColumns
  newBoard.columnOrderIds = dndOrderedColumnsIds
  setBoard(newBoard)
  
  // Call API update columnOrderIds trong DB
  updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds })

  }

//call API khi keo card trong cung column -> update cardOrderIds trong column do
const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
  // Update cho chuan du lieu trong state board
  const newBoard = { ...board }
  const columnToUpdate = newBoard.columns.find( column => column._id === columnId)
  if (columnToUpdate) {
    columnToUpdate.cards = dndOrderedCards
    columnToUpdate.cardOrderIds = dndOrderedCardIds
  }
  setBoard(newBoard)

  // call API update cardOrderIds trong DB
 updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
}

// step1: update cardOrderIds trong column ban dau ( xoa card._id ra khoi mang)
// step 2: update cardOrderIds trong column ma card di den ( them card._id vao mang )
// step 3: update columnId cua card da keo
const moveCardToDiffrentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
   // Update columnOrderIds trong board
   const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
   const newBoard = { ...board}
   newBoard.columns = dndOrderedColumns
   newBoard.columnOrderIds = dndOrderedColumnsIds
   setBoard(newBoard)

   // Call Api update columnOrderIds trong DB
  let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds
  // khi keo card cuoi cung ra khoi column ( column rong se chua palaceholder card ) --> xoa placeholder card truoc khi gui ve BE
  if (prevCardOrderIds[0].includes('placeholder-card')) { prevCardOrderIds = []}

   moveCardToDifffrentColumnAPI({
    currentCardId,
    prevColumnId,
    prevCardOrderIds,
    nextColumnId,
    nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
   })

}

if (!board) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: 2 }}> 
      <CircularProgress />
    </Box>
  )
}
  return (
    <Container disableGutters maxWidth={false} sx={{ height:'100vh' }}>
      <AppBar />
      <BoardBar board={board}/>
      <BoardContent 
        board={board} 
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDiffrentColumn={moveCardToDiffrentColumn}
      />
    </Container>
  )
}

export default Board 