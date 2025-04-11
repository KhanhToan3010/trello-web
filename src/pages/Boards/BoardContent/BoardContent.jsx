import Box from '@mui/material/Box'
//import React, { useCallback } from 'react'
import ListColumns from './ListColumns/ListColumns'
import { DndContext, PointerSensor, useSensor, useSensors, DragOverlay, defaultDropAnimationSideEffects,
         closestCorners, pointerWithin, rectIntersection, getFirstCollision, closestCenter} from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '~/customLibraries/DndKitSensors'
import { useState, useEffect, useCallback, useRef } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep, isEmpty} from 'lodash'
import { generatePlaceholderCard} from '~/utils/formatters'

const ACTIVE_DRAG_ITEM_TYPE = {
  COULMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ 
  board,
  createNewColumn, 
  createNewCard,
  moveColumns, 
  moveCardInTheSameColumn, 
  moveCardToDiffrentColumn, 
  deleteColumnDetails 
}) {
  //const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 15 } })
  // activationConstraint: { distance: 15 } la khoang cach toi thieu 15px thi moi bat dau keo
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 15 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  //const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)
  
  const [orderedColumns, setOrderedColumns] = useState([])

  //tại cùng 1 thời điểm chỉ có 1 ptu được kéo column or card 
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  // diem dung cuoi cung cua card khi keo qua lai giua cac column - xl thuat toan flickering
  const lastOverId = useRef(null)

  useEffect(() => {
    //const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    // column da duoc sap sep o component cha (board/_id.jsx)
    setOrderedColumns(board.columns)
  }, [board])

  const findColumnByCardId = (cardId) => {
    return orderedColumns.find(column => column?.cards?.map(card => card._id).includes(cardId))
  }

  // Funtion chung xu li viec cap nhat lai state trong truong hop move card giua cac column khac nhau
  const moveCardBetweenDiffrentColumn = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData,
    triggerFrom
  ) => {
    setOrderedColumns(prevColumns => {
      // tim vitri cua overcard trong column dich ( noi actice card dang keo toi)
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)
      
      let newCardIndex 
      const isBelowOverItem = active.rect.current.translated &&
      active.rect.current.translated.top > over.rect.top + over.rect.height 
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      // clone mang OrderedColumns cũ ra một bản mới xử lí rồi return lại tránh mất mảng cũ 
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

      // nextActiveColumn : column cu
      if(nextActiveColumn){
        // xoa card dang keo owr column active 
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

        // Them PlaceHolderCard neu Column cu rong
        if(isEmpty(nextActiveColumn.cards)){
          //console.log('card cuoi cung bi keo di')
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }

        // cap nhat lai mang cardOrderIds cua column active
        nextActiveColumn.cardOrderIds= nextActiveColumn.cards.map(card => card._id)
      }
      if(nextOverColumn){
        //ktra card dang keo co ton tai o over column hay khong, neu co thi xoa
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }
        // Them card dang keo vao overcolumn theo vi tri index moi
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)

        // Xoa PlaceHolderCard neu Column co ton tai card
        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard)
        // cap nhat lai vi tri card tai column over
        nextOverColumn.cardOrderIds= nextOverColumn.cards.map(card => card._id)
        //console.log('nextOverColumn: ', nextOverColumn)
      }

      // Func duoc goi tu ham handrapEnd co nghia la keo tha xong --> call Api 1 lan de tranh anh huong performance
      if ( triggerFrom === 'handleDragEnd' ) {
        moveCardToDiffrentColumn(
          activeDraggingCardId,
          oldColumnWhenDraggingCard._id, 
          nextOverColumn._id,
          nextColumns
          )
      }
      return nextColumns
      })
  }
  const handleDragStart = (event) => {
    //console.log('drag start: ', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COULMN)
    setActiveDragItemData(event?.active?.data?.current)

    // neu keo card thi luu lai column cua card dang keo
    if( event?.active?.data?.current?.columnId ){
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }
  
  //Trigger trong qtrinh drap 1 ptu
  const handleDrapOver = (event) => {
    // neu dang keo column return luon
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COULMN) return 
    // neu dang keo card thi xu li keo qua laij giua cac column
    //console.log('drap over : ', event)
    const { active, over } = event
    // neu khong ton tai active hoac over return luon tranh loi crash trang 
    if (!active || !over) return
    // activeDraggingCardId la id cua card dang keo
    const { id: activeDraggingCardId, data: {current: activeDraggingCardData}  } = active
    // overCardId la id cua card duoc card dang keo tuong tac
    const {id: overCardId} = over 
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)
    
    if (!overColumn || !activeColumn) return
    if (activeColumn._id !== overColumn._id ){
      moveCardBetweenDiffrentColumn(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData,
        'handleDrapOver'
      ) 
    }
  }
  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || !over) return  // neu keo ra ngoai return luon trnah loi
    // Xu li keo tha CARD
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD){
      //console.log('drap and drop card, nothing action')
      //activeDraggingCardId la id cua card dang keo
      const { id: activeDraggingCardId, data: {current: activeDraggingCardData}  } = active
      // overCardId la id cua card duoc card dang keo tuong tac
      const {id: overCardId} = over 
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)
      
      if (!overColumn || !activeColumn) return

      // khi drapover co set lai state nen muon dung du lieu goc phai tao state moi luu du lieu column ban dau khi keo card 
      //hoac dung activeDrapItemData.columnId
      // console.log('oldColumnWhenDraggingCard: ', oldColumnWhenDraggingCard)
      // console.log('overColumn: ', overColumn)
      if (oldColumnWhenDraggingCard._id !== overColumn._id){
      console.log('keo tha card giuax 2 column khac nhau')
        moveCardBetweenDiffrentColumn(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData,
          'handleDragEnd'
        ) 
      } else {

        console.log('keo tha card trong cung 1 column ')
        // lay vitri cu tu oldColumnWhenDraggingCard
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)
        console.log('oldCardIndex: ', oldCardIndex)
        // lay vitri moi tu overColumn
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)
        console.log('newCardIndex: ', newCardIndex)

        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
        const dndOrderedCardIds = dndOrderedCards.map(card => card._id)
        console.log('dndOrderedCards: ', dndOrderedCards)
        
        setOrderedColumns(prevColumns => {
        const nextColumns = cloneDeep(prevColumns)
        const targetColumn = nextColumns.find(column => column._id === overColumn._id)// lay id column dang tha card
        targetColumn.cards = dndOrderedCards
        targetColumn.cardOrderIds = dndOrderedCardIds
        console.log( 'targetColumn: ', targetColumn )
        return nextColumns 
        })

      // Goi len props func moveCardInTheSameColumn nam o component cha (board/_id.jsx)
      moveCardInTheSameColumn(dndOrderedCards, dndOrderedCardIds, oldColumnWhenDraggingCard._id)
      }
    }
    
    // Xu li keo tha COLUMN trong BoradContent
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COULMN){

      //console.log('drap and drop card, nothing action')
      if (active.id !== over.id) {
        // lay vitri cu tu thanh phan active
        const oldColumnIndex = orderedColumns.findIndex(column => column._id === active.id)
        // lay vitri moi tu thanh phan over
        const newColumnIndex = orderedColumns.findIndex(column => column._id === over.id)
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)

        setOrderedColumns(dndOrderedColumns)
        // Goi len props func moveColumns nam o component cha (board/_id.jsx)
        moveColumns(dndOrderedColumns)
      }
    }
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

   const customDropAnimation= {
    sideEffects: defaultDropAnimationSideEffects({styles: {active: {opacity: 0.5}}}),
   }

   const collisionDetectionStrategy = useCallback( (args) => {
    if(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COULMN){
      return closestCorners({...args})
    }
    const pointerIntersections = pointerWithin(args)
    const intersections = pointerIntersections?.length > 0 
      ? pointerIntersections : rectIntersection(args)

    // Tim overId dau tien trong intersections ow tren
    let overId = getFirstCollision(intersections, 'id')
    //console.log('overId: ', overId)
    if(overId){
      const checkColumn = orderedColumns.find(column => column._id === overId)
      if(checkColumn){
        overId = closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter( container => {
            return (container.id !== overId) && (checkColumn?.cardOrderIds?.includes(container.id))
          })
        })[0]?.id
      }
      lastOverId.current = overId
      return [{ id: overId }]
    }

    return lastOverId.current ? [{ id: lastOverId.current }] : []
   }, [activeDragItemType])

  return (
    <DndContext 
    onDragStart={handleDragStart}
    onDragOver={handleDrapOver}
    onDragEnd={handleDragEnd} 
    sensors={sensors}
    // khong dung closestCorners -> bug flickering + sai lech du lieu
    //collisionDetection={closestCorners}// phat hien va cham giua cac card dung de keo card chua img giua cac column
    // custome nang cao thuat toan phat hien va cham fix bug flickering
    collisionDetection={collisionDetectionStrategy}
    >

      <Box sx={{
        height: '100%',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        height: (theme) => theme.trelloCustom.boardContentHeight,
        p: '10px 0'
      }}>

      <ListColumns 
        columns={orderedColumns} 
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        deleteColumnDetails={deleteColumnDetails}
       />
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