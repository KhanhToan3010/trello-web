import ModeSelect from '../../components/ModeSelect'
import Box from '@mui/material/Box'

function AppBar() {
  return (
<Box sx={{
        height: '100%',
        backgroundColor: 'primary.light',
        height: (theme) => theme.trelloCustom.headerHeight,
        display: 'flex',
        alignItems: 'center',

      }}>
        <ModeSelect />
      </Box>
  )
}

export default AppBar