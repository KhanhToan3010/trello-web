import React from 'react'
import Box from '@mui/material/Box';
import Container from '@mui/material/Container'
import ModeSelect from '../../components/ModeSelect'

function Board() {
  return (
    <Container disableGutters maxWidth={true} sx={{ height:'100vh' }}>
      <Box sx={{
        height: '100%',
        backgroundColor: 'primary.light',
        height: (theme) => theme.trelloCustom.headerHeight,
        display: 'flex',
        alignItems: 'center',

      }}>
        <ModeSelect />
      </Box>
      <Box sx={{
        height: '100%',
        backgroundColor: 'primary.dark',
        height: (theme) => theme.trelloCustom.boardBarHeight,
        display: 'flex',
        alignItems: 'center'
      }}>
        Board Bar
      </Box>
      <Box sx={{
        height: '100%',
        backgroundColor: 'primary.main',
        height: (theme) => `calc(100vh - ${theme.trelloCustom.headerHeight} - ${theme.trelloCustom.boardBarHeight})`,
        display: 'flex',
        alignItems: 'center'
      }}>
        Board Content
      </Box>
    </Container>
  )
}

export default Board