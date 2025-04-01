import Box from '@mui/material/Box'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
//import theme from '~/theme'

function ListColumns({ columns }) {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm) 
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const addNewColumn = () => {
    if(!newColumnTitle) {
      //alert('Please enter column title!')
      toast.warning('Please enter column title!')

      return
    }
      
    console.log('newColumnTitle: ', newColumnTitle)
    // CAll API to add new column
    // Close form and clear input
    toggleOpenNewColumnForm()
    setNewColumnTitle('')
  }
  return (
    <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        bgcolor: 'inherit',
        height: '100%',
        width: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': { m: 2 }
      }}>

        {columns?.map(column =>  <Column key={column._id} column={column} />)}

        {/* Box Add Column */}
        {!openNewColumnForm
          ? <Box onClick={toggleOpenNewColumnForm} sx={{
              minWidth: '250px',
              maxWidth: '250px',
              bgcolor: '#ffffff3d',
              mx: 2,
              borderRadius: '6px',
              height: 'fit-content',
            }}>
              <Button
              startIcon={ <NoteAddIcon /> }
              sx={{
                color: 'white',
                width: '100%',
                justifyContent: 'flex-start',
                pl: 2.5,
                py: 1,
    
              }}
              >
              Add new column
              </Button>
            </Box>
          : <Box sx={{
            minWidth: '250px',
            maxWidth: '250px',
            bgcolor: '#ffffff3d',
            mx: 2,
            p: 1,
            borderRadius: '6px',
            height: 'fit-content',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}>
            <TextField 
              label="Enter column title" 
              type="text" 
              size='small' 
              variant='outlined'
              autoFocus
              value={newColumnTitle}
              onChange={(e ) => setNewColumnTitle(e.target.value)}
              sx={{ 
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& label.Mui-focused': {color: 'white'},
                '& .MuiOutlinedInput-root': { 
                  '& fieldset': { borderColor: 'white'},
                  '&:hover fieldset': { borderColor: 'white'},
                  '&.Mui-focused fieldset': { borderColor: 'white'}
                  
                }
              }} 
          />
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              onClick={addNewColumn}
              variant='contained' size='small'
              sx={{
                boxShadow: 'none',
                border: 'none',
              }}
            >
              Add Column
            </Button>
            <CloseIcon
                fontSize='small'
                sx={{ color: 'white', cursor: 'pointer', '&:hover': { color: 'lightgray' }}}
                onClick={toggleOpenNewColumnForm}
              />
          </Box>
          </Box>
        }
      </Box>
    </SortableContext>
  )
}

export default ListColumns