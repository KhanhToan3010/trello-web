import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import AvatarGroup from '@mui/material/AvatarGroup'
import Button from '@mui/material/Button'
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'

const BOARDBAR_STYLE = {
  color: 'white',
  bgcolor: 'transparent',
  paddingX: '5px',
  borderRadius: '5px',
  '& .MuiSvgIcon-root': {
    color: 'white'
    },
  '&:hover': {
    bgcolor: 'primary.50'
  },
}

function BoardBar() {
  return (
<Box sx={{
        height: '100%',
        height: (theme) => theme.trelloCustom.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2, 
        paddingX: 2,
        overflowX: 'auto',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        borderBottom: '1px solid white',
      }}>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2}}>
      <Chip 
        sx={ BOARDBAR_STYLE }
        icon={<DashboardIcon />} 
        label= " KhanhToanDev DashBoard" 
        //clickable
        onClick={() => {}}
      />

      <Chip 
        sx={ BOARDBAR_STYLE }
        icon={<VpnLockIcon />} 
        label= " Public/Private Workspalce" 
        //clickable
        onClick={() => {}}
      />

      <Chip 
        sx={ BOARDBAR_STYLE }
        icon={<AddToDriveIcon />} 
        label= " Add To Google Drive" 
        //clickable
        onClick={() => {}}
      />
      <Chip 
        sx={ BOARDBAR_STYLE }
        icon={<BoltIcon />} 
        label= " Automation " 
        //clickable
        onClick={() => {}}
      />
      <Chip 
        sx={ BOARDBAR_STYLE }
        icon={<FilterListIcon />} 
        label= " Filters" 
        //clickable
        onClick={() => {}}
      />

      
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2}}>
        <Button 
          variant="outlined" 
          startIcon={<PersonAddAltOutlinedIcon />}
          sx={{ 
            color: 'white',
             borderColor: 'white',
             '&:hover': {
               borderColor: 'white',
             }
          }}
          >
            Invite
        </Button>
        <AvatarGroup
          max={5} 
          sx={{ 
            gap: '10px',
            '& .MuiAvatar-root': {
              width: '28px',
              height: '28px',
              fontSize: '16 ',
              border: 'none',
              color: 'white',
              fontSize: '12px',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#a4b0be'}
            },
          }}
        >
          <Tooltip title="khanhtoandev">
            <Avatar
              alt='khanhtoandev'
              src='https://tophinhanh.net/wp-content/uploads/2023/10/facebook-doi-5.jpg'
            />
          </Tooltip>
          <Tooltip title="khanhtoandev">
            <Avatar
              alt='khanhtoandev'
              src='https://tophinhanh.net/wp-content/uploads/2023/10/avatar-doi-nguoi-that-3.jpg'
            />
          </Tooltip>
          <Tooltip title="khanhtoandev">
            <Avatar
              alt='khanhtoandev'
              src='https://tophinhanh.net/wp-content/uploads/2023/10/avatar-doi-nguoi-that-4.jpg'
            />
          </Tooltip>
          <Tooltip title="khanhtoandev">
            <Avatar
              alt='khanhtoandev'
              src='https://tophinhanh.net/wp-content/uploads/2023/10/avatar-doi-nguoi-that-7.jpg'
            />
          </Tooltip>
          <Tooltip title="khanhtoandev">
            <Avatar
              alt='khanhtoandev'
              src='https://tophinhanh.net/wp-content/uploads/2023/10/facebook-doi-5.jpg'
            />
          </Tooltip>
          <Tooltip title="khanhtoandev">
            <Avatar
              alt='khanhtoandev'
              src='https://tophinhanh.net/wp-content/uploads/2023/10/facebook-doi-5.jpg'
            />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar