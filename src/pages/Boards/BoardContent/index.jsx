import Box from '@mui/material/Box';

function BoardContent() {
  return (
    <Box sx={{
      height: '100%',
      backgroundColor: 'primary.main',
      height: (theme) => `calc(100vh - ${theme.trelloCustom.headerHeight} - ${theme.trelloCustom.boardBarHeight})`,
      display: 'flex',
      alignItems: 'center'
    }}>
      Board Content
    </Box>
  )
}

export default BoardContent