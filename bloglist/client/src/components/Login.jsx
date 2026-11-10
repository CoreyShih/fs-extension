import { TextField, Button } from '@mui/material'

const Login = ({ onLogin, onUsernameChange, onPasswordChange, username, password }) => {
  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={onLogin}>
        <div>
          <TextField label='username' variant='standard' type='text' value={username} onChange={onUsernameChange} />
        </div>
        <div>
          <TextField label='password' variant='standard' type='password' value={password} onChange={onPasswordChange} />
        </div>
        <div>
          <Button type='submit' variant='contained' style={{ marginTop: 10 }}>login</Button>
        </div>
      </form>
    </div>
  )
}

export default Login