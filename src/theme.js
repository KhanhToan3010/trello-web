import { experimental_extendTheme as extendTheme} from '@mui/material/styles'
import { deepOrange, orange, cyan, teal } from '@mui/material/colors'
import { colors } from '@mui/material'
import { Height } from '@mui/icons-material'

// Create a theme instance.
const theme = extendTheme({
    trelloCustom:{
      headerHeight: '62px',
      boardBarHeight: '68px',
    },
    colorSchemes: {
      light: {
        palette: {
          primary: teal,
          secondary: deepOrange
        }
      },
      dark: {
        palette: {
          primary: cyan,
          secondary: orange
        }
      }
    },
    components: {
      MuiCssBaseline: {
        styleOverrides:{
          body:{
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '*::-webkit-scrollbar-thumb': {
           backgroundColor: '#bdc3c7',
           borderRadius: '8px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#34495e'
           }
        }
      }
    },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          }
        }
      },

      MuiInputLabel: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.primary.main,
            fontSize: '0.875rem',
          }),
        }
      },
      
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }) => {
            return {
              color: theme.palette.primary.main,
              fontSize: '0.875rem',
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.light,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
            }
          }
        }
      }
    }
  })

export default theme;