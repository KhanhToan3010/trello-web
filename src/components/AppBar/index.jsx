import ModeSelect from '~/components/ModeSelect'
import Box from '@mui/material/Box'
import AppsIcon from '@mui/icons-material/Apps'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import Workspaces from './Menus/Workspaces'
import Recent from './Menus/Recent'
import Templates from './Menus/Templates'
import Starred from './Menus/Starred'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Profiles from './Menus/Profiles'


function AppBar() {
  return (
    <Box px={2} sx={{
        height: '100%',
        height: (theme) => theme.trelloCustom.headerHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        overflowX: 'auto',
      }}>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2}}>
          <AppsIcon sx={{ color: 'primary.main'}} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1}}>
          <SvgIcon component={TrelloIcon} inheritViewBox fontSize="small" sx={{ color: 'primary.main'}} />
          <Typography variant='span' sx={{ color: 'primary.main', fontSize: '1.2rem', fontWeight: 'bold' }}>Trello</Typography>
          </Box>

            <Box sx = {{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              <Workspaces />
              <Recent />
              <Templates />
              <Starred />
              <Button variant="outlined">Create</Button>
            </Box>

        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2}}>
        <TextField id="outlined-search" label="Search" type="search" size='small' sx={{ minWidth: '120px'}} />
         <ModeSelect />
          <Tooltip title="Notifications">
            <Badge color="secondary" variant="dot" sx={{ cursor: 'pointer', color: 'primary.main' }}>
              <NotificationsNoneIcon />
            </Badge>
          </Tooltip>

          <Tooltip title="Help">
            <HelpOutlineIcon sx={{ cursor: 'pointer', color: 'primary.main' }} />
          </Tooltip>

          <Profiles sx={{ cursor: 'pointer' }} />   
        </Box>
    </Box>
  )
}

export default AppBar