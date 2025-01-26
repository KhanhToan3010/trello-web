import { experimental_extendTheme as extendTheme} from '@mui/material/styles'
import { deepOrange, orange, cyan, teal } from '@mui/material/colors'

const APP_BAR_HEIGHT = '60px'
const BOARD_BAR_HEIGHT = '54px'
const BOARD_CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT} - ${BOARD_BAR_HEIGHT})`

// Create a theme instance.
const theme = extendTheme({
    trelloCustom:{
      appBarHeight: APP_BAR_HEIGHT,
      boardBarHeight: APP_BAR_HEIGHT,
      boardContentHeight: BOARD_CONTENT_HEIGHT
    },
    // colorSchemes: {
    //   light: {
    //     palette: {
    //       primary: teal,
    //       secondary: deepOrange
    //     }
    //   },
    //   dark: {
    //     palette: {
    //       primary: cyan,
    //       secondary: orange
    //     }
    //   }
    // },
    components: {
      MuiCssBaseline: {
        styleOverrides:{
          body:{
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '*::-webkit-scrollbar-thumb': {
           backgroundColor: '#dcd3e1',
           borderRadius: '8px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'white'
           }
        }
      }
    },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderWidth: '0.5px',
            '&:hover': { borderWidth: '0.5px' },  
          }
        }
      },

      MuiInputLabel: {
        styleOverrides: {
          root: ({ theme }) => ({
            //color: theme.palette.primary.main,
            fontSize: '0.875rem',
          }),
        }
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            '&.MuiTypography-body1': {
              fontSize: '0.875rem',
          }}
        }
      },
      
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }) => {
            return {
              //color: theme.palette.primary.main,
              fontSize: '0.875rem',
              '& fieldset': {
                borderWidth: '0.5px !important',
              },
              '&:hover fieldset': {
                borderWidth: '1px !important',
              },
              '&.Mui-focused fieldset': {
                borderWidth: '1px !important',
              }
              // '.MuiOutlinedInput-notchedOutline': {
              //   borderColor: theme.palette.primary.light,
              // },
              // '&:hover .MuiOutlinedInput-notchedOutline': {
              //   borderColor: theme.palette.primary.main,
              // },
            }
          }
        }
      }
    }
  })

export default theme;