import { useState, useEffect } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar'
import BoardBar from '~/pages/Boards/BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { generatePlaceholderCard} from '~/utils/formatters'
import { isEmpty} from 'lodash'
// import { mockData } from '~/apis/mock-data'
import { fetchBoardDetailsAPI, createNewCardAPI, createNewColumnAPI } from '~/apis' 

function Board() {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    const boardId = '67eb57ecf3d0db9851366734'
    fetchBoardDetailsAPI(boardId).then((board) => {
      // xu li keo tha vao 1 coolumn rong
      board.columns.forEach( column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
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
  const newBoard = { ...board}
  // tim ban ghi column trong board, column ma chua card vua duoc tao 
  const columnToUpdate = newBoard.columns.find( column => column._id === createdCard.columnId)
  if (columnToUpdate) {
    columnToUpdate.cards.push(createdCard)
    columnToUpdate.cardOrderIds.push(createdCard._id)
  }
  setBoard(newBoard)
}


  return (
    <Container disableGutters maxWidth={false} sx={{ height:'100vh' }}>
      <AppBar />
      <BoardBar board={board}/>
      <BoardContent 
        board={board} 
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
      />
    </Container>
  )
}

export default Board 