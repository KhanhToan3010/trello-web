import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import theme from './theme'
// Cau hinh React Toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Mui Dialog Confirm
import { ConfirmProvider } from 'material-ui-confirm'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CssVarsProvider theme={theme}>
    <ConfirmProvider defaultOptions={{
       allowClose: false,
       confirmDeleteColumn: 'Delete',
       dialogProps: { maxWidth: 'xs' },
       confirmationButtonProps: { color: 'warning', variant: 'outlined' }
    }}>  
      <CssBaseline /> 
      <App />
      <ToastContainer autoClose={3000} position="bottom-right" />
      </ConfirmProvider>
    </CssVarsProvider>
  </React.StrictMode>
)
