import Box from '@mui/material/Box'
import React from 'react'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'

function BoardContent({ board }) {
  const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
  return (
    <Box sx={{
      height: '100%',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
      height: (theme) => theme.trelloCustom.boardContentHeight,
      p: '10px 0'
    }}>

    <ListColumns columns={orderedColumns} board={board} />
    </Box>
  )
}

export default BoardContent