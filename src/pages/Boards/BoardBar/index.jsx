import Box from '@mui/material/Box';

function BoardBar() {
  return (
<Box sx={{
        height: '100%',
        backgroundColor: 'primary.dark',
        height: (theme) => theme.trelloCustom.boardBarHeight,
        display: 'flex',
        alignItems: 'center'
      }}>
        Board Bar
      </Box>
  )
}

export default BoardBar