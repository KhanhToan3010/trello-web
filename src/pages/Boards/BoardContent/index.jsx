import Box from '@mui/material/Box';

function BoardContent() {
  return (
    <Box sx={{
      height: '100%',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
      height: (theme) => `calc(100vh - ${theme.trelloCustom.headerHeight} - ${theme.trelloCustom.boardBarHeight})`,
      display: 'flex',
      alignItems: 'center'
    }}>
      Board Content
    </Box>
  )
}

export default BoardContent