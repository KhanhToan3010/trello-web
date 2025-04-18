import React, { useState } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Typography from '@mui/material/Typography'
import ContentCut from '@mui/icons-material/ContentCut'
import Cloud from '@mui/icons-material/Cloud'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Tooltip from '@mui/material/Tooltip'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import AddCardIcon from '@mui/icons-material/AddCard'
import Button from '@mui/material/Button'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import Box from '@mui/material/Box'
import ListCards from './ListCards/ListCards'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'
import { useConfirm } from 'material-ui-confirm'



function Column({ column, createNewCard, deleteColumnDetails}) {

  // drag and drop
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { ...column }
  })
  const dndKitColumnStyles = {

  //keo tha tren mobile - touchActions tuy nhien ko muot lam nen thay bang MouseSensor - TouchSensor
  //touchActions: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5 : 1
  }

  // dropdown menu
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => { setAnchorEl(event.currentTarget)}
  const handleClose = () => { setAnchorEl(null)}

  // card da duoc sap sep o cong component cha (board/_id.jsx)
  const oderedCards = column.cards

  // Add new card
  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm) 
  const [newCardTitle, setNewCardTitle] = useState('')
  const addNewCard = async () => {
    if(!newCardTitle) {
      //alert('Please enter Card title!')
      toast.warning('Please enter Card title!')
      return
    }
      
    console.log('newCardTitle: ', newCardTitle)
    // Tao du lieu Column de goi API
    const newCardData =  {
      title: newCardTitle,
      columnId: column._id
    }

    await createNewCard(newCardData)

    // Close form and clear input
    toggleOpenNewCardForm()
    setNewCardTitle('')
  }

  // Delete column and cards
  const confirmDeleteColumn = useConfirm()
  const handleDeleteColumn = () => {
    confirmDeleteColumn({
      title: 'Delete column ?',
      description: 'Are you sure you want to delete this column?',

      confirmationText: 'Delete',
      cancellationText: 'Cancel'
      // confirmationKeyword: 'Delete',
      // confirmationKeywordTextFieldProps: { label: 'Enter "Delete" to confirm' },
    }).then( () => {
       // goi en props func deleteColumnDetails o component cha cao nhat _id.jsx
      deleteColumnDetails(column._id)
    }
    ).catch(() => {}) 

    
  }


  return ( 
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes} >
        <Box
          {...listeners}
          sx={{
            minWidth: '300px',
            maxWidth: '300px',
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
            ml: 2,
            borderRadius: '6px',
            height: 'fit-content',
            maxHeight: (theme) =>  `calc(${theme.trelloCustom.boardContentHeight} - ${theme.spacing(5)})`
          }}>
          {/* Box Header */}
          <Box sx={{
            height: (theme) => theme.trelloCustom.columnHeaderHeight,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <Typography variant='h6' sx={{
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              {column?.title}
            </Typography>
          
            <Box>
            <Tooltip title="More options">
              <ExpandMoreIcon sx={{ cursor: 'pointer',color:'primary.main' }}
                id="basic-column-dropdown"
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip> 
              <Menu
                id="basic-menu-column-dropdown"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-column-dropdown',
                }}
              >
              <MenuItem  
                onClick={toggleOpenNewCardForm}
                sx={{ 
                  '&:hover': {
                    color: 'success.light',
                    '& .add-card-icon': {color: 'success.light'} 
                    }
                  }}
              >
                <ListItemIcon><AddCardIcon className='add-card-icon' fontSize="small" /></ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentCut fontSize="small" /></ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentCopy fontSize="small" /></ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentPaste fontSize="small" /></ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>
                <Divider />
              <MenuItem 
                onClick={ handleDeleteColumn }
               sx={{ 
                '&:hover': {
                  color: 'warning.dark',
                  '& .delete-forever-icon': {color: 'warning.dark'} 
                  }
                }}
              >
                  <ListItemIcon>
                    <DeleteForeverIcon className='delete-forever-icon' fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Delete this column</ListItemText>
              </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <Cloud fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Archive this column</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          {/* Box List Cards */}
          <ListCards cards={oderedCards} />
          {/* Box Footer */}
          <Box sx={{
            height: (theme) => theme.trelloCustom.columnFooterHeight,
            p: 2 
          }}>

            {!openNewCardForm
              ?<Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between', height:'100%' }}>
                <Button startIcon={<AddCardIcon />} onClick={toggleOpenNewCardForm}>Add new card</Button>
                <Tooltip title='Drap to move'>
                  <DragHandleIcon sx={{ cursor: 'pointer', color: 'primary.main' }} />
                </Tooltip>
              </Box>
              :<Box sx={{ height: '100%', display: 'flex', alignItems: 'center', gap: 1}}> 
                <TextField 
              label="Enter card title" 
              type="text" 
              size='small' 
              variant='outlined'
              autoFocus
              data-no-dnd= "true"
              value={newCardTitle}
              onChange={(e ) => setNewCardTitle(e.target.value)}
              sx={{ 
                '& label': { color: 'text.primary' },
                '& imput': {
                  color: (theme) => theme.palette.primary.main,
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white')
                },
                '& label.Mui-focused': {color: (theme) => theme.palette.primary.main},
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: (theme) => theme.palette.primary.main},
                  '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main},
                  '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main}
                },
                '& MuiOutlinedInput-input': { borderRadius: 1}
              }} 
          />
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center',  }}>
            <Button
              onClick={addNewCard}
              variant='contained' size='small'
              sx={{
                boxShadow: 'none',
                border: 'none',
              }}
            >
              Add
            </Button>
            <CloseIcon
                fontSize='small'
                sx={{ 
                  cursor: 'pointer', 
                  color: (theme) => theme.palette.warning.light
                  }}
                onClick={toggleOpenNewCardForm}
              />
          </Box>
              </Box>
            }
            
          </Box>
        </Box>
    </div>
  )
}

export default Column