import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom'
import { Container, AppBar, Toolbar, Button, Typography } from '@mui/material'
import { ErrorBoundary } from 'react-error-boundary'
import Notification from './components/Notification'
import Login from './components/Login'
import Blog from './components/Blog'
import BlogList from './components/BlogList'
import NewBlogForm from './components/NewBlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null })
  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const notifyWith = (message, isError = false) => {
    setNotification({ message, isError })
    setTimeout(() => {
      setNotification({ message: null })
    }, 5000)
  }

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      notifyWith('login successful')
      navigate('/')
    } catch {
      notifyWith('wrong username or password', true)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    blogService.setToken(null)
    setUser(null)
    notifyWith('logout successful')
    navigate('/')
  }

  const createBlog = async newBlog => {
    try {
      const createdBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(createdBlog).sort((a, b) => b.likes - a.likes))
      notifyWith(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
      navigate('/')
    } catch {
      notifyWith('title and url required', true)
    }
  }

  const likeBlog = async blog => {
    try {
      const likedBlog = { ...blog, likes: blog.likes + 1 }
      await blogService.update(blog.id, likedBlog)
      const updatedBlogs = blogs.map(b => b.id === blog.id ? likedBlog : b)
      setBlogs(updatedBlogs.sort((a, b) => b.likes - a.likes))
      notifyWith(`Liked ${blog.title} by ${blog.author}`)
    } catch {
      notifyWith('failed to like blog', true)
    }
  }

  const removeBlog = async blog => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        notifyWith(`${blog.title} by ${blog.author} removed`)
        navigate('/')
      } catch {
        notifyWith('failed to remove blog', true)
      }
    }
  }

  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find(blog => blog.id === match.params.id) : null

  const hoverStyle = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Container>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>Blog App</Typography>
          <Button color='inherit' component={Link} to='/' sx={hoverStyle}>blogs</Button>
          {user && <Button color='inherit' component={Link} to='/create' sx={hoverStyle}>new blog</Button>}
          {!user && <Button color='inherit' component={Link} to='/login' sx={hoverStyle}>login</Button>}
          {user && <Button color='inherit' onClick={handleLogout} sx={hoverStyle}>logout</Button>}
        </Toolbar>
      </AppBar>
      <ErrorBoundary fallback={<h2>Something went wrong :(</h2>}>
        {user && <Typography variant='body1'>{`${user.name} logged in`}</Typography>}
        <Notification notification={notification} />
        <Routes>
          <Route path='/' element={
            <BlogList
              blogs={blogs}
              user={user}
              onLike={likeBlog}
              onRemove={removeBlog}
            />
          } />
          <Route path='/create' element={
            <NewBlogForm createBlog={createBlog} />
          } />
          <Route path='/login' element={
            <Login
              onLogin={handleLogin}
              onUsernameChange={({ target }) => setUsername(target.value)}
              onPasswordChange={({ target }) => setPassword(target.value)}
              username={username}
              password={password}
            />
          } />
          <Route path='/blogs/:id' element={
            <Blog
              blog={blog}
              user={user}
              onLike={() => likeBlog(blog)}
              onRemove={() => removeBlog(blog)}
            />
          } />
        </Routes>
      </ErrorBoundary>
    </Container>
  )
}

export default App