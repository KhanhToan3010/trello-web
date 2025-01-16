import Button from '@mui/material/Button'
import { AccessAlarm, ThreeDRotation } from '@mui/icons-material'
import Typography from '@mui/material/Typography'

function App() {
  return (
    <>
      <div>Khánh Toàn Dev Frontend</div>

      <Typography variant="body2" color="text.secondary" >Hello World</Typography>
      <Button variant="text">Text</Button>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
      <br />
      <AccessAlarm/>
      <ThreeDRotation/>
    </>
  )
}

export default App
