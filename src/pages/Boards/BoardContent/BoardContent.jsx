import Box from '@mui/material/Box'
import React from 'react'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { DndContext, PointerSensor, useSensor, useSensors, MouseSensor, TouchSensor, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core'
import { useState, useEffect } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COULMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board }) {
  //const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 15 } })
  // activationConstraint: { distance: 15 } la khoang cach toi thieu 15px thi moi bat dau keo
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 15 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  //const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)
  
  const [orderedColumns, setOrderedColumns] = useState([])

  //tại cùng 1 thời điểm chỉ có 1 ptu được kéo column or card 
  const [activeDragItemId, setactiveDragItemId] = useState(null)
  const [activeDragItemType, setactiveDragItemType] = useState(null)
  const [activeDragItemData, setactiveDragItemData] = useState(null)

  useEffect(() => {
    //const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const handleDragStart = (event) => {
    console.log('drag start: ', event)
    setactiveDragItemId(event?.active?.id)
    setactiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COULMN)
    setactiveDragItemData(event?.active?.data?.current)
  }
  const handleDragEnd = (event) => {
    const { active, over } = event
    // neu keo ra ngoai return luon trnah loi
    if (!over) return
    if (active.id !== over.id) {
      //console.log('move column')
      // lay vitri cu tu thanh phan active
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
      // lay vitri moi tu thanh phan over
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)

      const dndorderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      // const dndorderedColumnsIsd = dndorderedColumns.map(c => c._id)
      // console.log('dndorderedColumns: ', dndorderedColumns)
      // console.log('dndorderedColumnsIsd: ', dndorderedColumnsIsd)
      setOrderedColumns(dndorderedColumns)
    }
    setactiveDragItemId(null)
    setactiveDragItemType(null)
    setactiveDragItemData(null)
  }

   const customDropAnimation= {
    sideEffects: defaultDropAnimationSideEffects({styles: {active: {opacity: 0.5}}}),
   }

  return (
    <DndContext 
    onDragStart={handleDragStart}
    onDragEnd={handleDragEnd} 
    sensors={sensors}>
      <Box sx={{
        height: '100%',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        height: (theme) => theme.trelloCustom.boardContentHeight,
        p: '10px 0'
      }}>

      <ListColumns columns={orderedColumns} board={board} />
      <DragOverlay dropAnimation={customDropAnimation}>
        {!activeDragItemType && null}
        {( activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COULMN ) && <Column column={activeDragItemData} />}
        {( activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD ) && <Card card={activeDragItemData} />}
      </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent