import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import { SuccessNotification, ErrorNotification } from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  // const [newBlog, setNewBlog] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [username, setUsername] = useState('test_case_user')
  const [password, setPassword] = useState('test_case_pw')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()
  useEffect(() => {
    blogService.getAll().then(initialBlogs =>
      setBlogs(initialBlogs)
    )
  }, [])

  const handleLike = async blog => {
    try {
      const updatedBlog = await blogService.update(blog.id, {
        ...blog,
        likes: blog.likes + 1
      })
      setBlogs(currentBlogs =>
        currentBlogs.map(currentBlog =>
          currentBlog.id === updatedBlog.id ? updatedBlog : currentBlog
        )
      )
    } catch (error) {
      console.error(error)
      setErrorMessage('Failed to like blog: ' + error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleDelete = async blog => {
    const confirmed = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if (!confirmed) {
      return
    }

    try {
      const response = await blogService.del(blog.id)
      if (response.status === 204) {
        setBlogs(currentBlogs =>
          currentBlogs.filter(currentBlog => currentBlog.id !== blog.id)
        )
      }
    } catch (error) {
      console.error(error)
      setErrorMessage('Failed to delete blog: ' + error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      console.error(error)
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const createBlog = async blogObject => {
    blogFormRef.current.toggleVisibility()

    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      setSuccessMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
      return true
    } catch (error) {
      console.error(error)
      setErrorMessage('failed to create blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return false
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  return (
    <div>

      {!user && (<div>
        <h2>Log in to application</h2>
        <ErrorNotification message={errorMessage} /></div>
      )}
      {!user && loginForm()}

      {user && (
        <div>
          <h2>blogs</h2>
          <SuccessNotification message={successMessage} />
          <ErrorNotification message={errorMessage} />
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

          <h2>create new</h2>
          <Togglable buttonLabel="create new blog" hideLabel="cancel" ref={blogFormRef}>
            <BlogForm
              createBlog={createBlog}
            />
          </Togglable>

          <ul>
            {blogs.sort((a, b) => (b.likes - a.likes)).map(blog => (
              <Blog
                key={blog.id}
                blog={blog}
                handleLike={handleLike}
                handleDelete={handleDelete}
              />
            ))}
          </ul>
        </div>
      )}

      {/* <Footer /> */}
    </div>
  )
}

export default App