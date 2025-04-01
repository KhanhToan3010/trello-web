import React from 'react'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import AttachmentIcon from '@mui/icons-material/Attachment'
import CommentIcon from '@mui/icons-material/Comment'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Card as MuiCard } from '@mui/material'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'


function Card({ card }) {

  // drag and drop
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: { ...card }
  })
  const dndKitCardStyles = {
  //keo tha tren mobile - touchActions tuy nhien ko muot lam nen thay bang MouseSensor - TouchSensor
  //touchActions: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    
  }
  return (
    <MuiCard 
    ref={setNodeRef} style={dndKitCardStyles} {...attributes} {...listeners}
      sx={{ 
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
        overflow: 'unset',
        // neu card chua FE_PlaceholderCard thi set block khong chua set none
        display: card?.FE_PlaceholderCard ? 'none' : 'block',
        // Cach 2: dung css de set height cho card
        // height: card?.FE_PlaceholderCard ? '0px' : 'unset',
        border: '1px solid #e0e0e0',
        '&:hover': {borderColor: (theme) => theme.palette.primary.main}
      }}
    >
      
      
      {card?.cover && <CardMedia sx={{ height: 140 }} image={card?.cover}/>}
      
      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        <Typography>{card?.title}</Typography>
      </CardContent>
      <CardActions sx={{ p: '0 4px 8px 4px'}}>
        { !!card?.memberIds?.length && <Button size="small" startIcon={<GroupIcon />}>{card?.memberIds?.length}</Button> }
        { !!card?.comments?.length && <Button size="small" startIcon={<CommentIcon />}>{card?.comments?.length}</Button> }
        { !!card?.attachments?.length && <Button size="small" startIcon={<AttachmentIcon />}>{card?.attachments?.length}</Button> }
      </CardActions>
    </MuiCard>
  )
}

export default Card