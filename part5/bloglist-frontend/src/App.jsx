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
  const [showAll, setShowAll] = useState(true)
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

  const blogsToShow = showAll ? blogs : [{ title: 'aa', author: 'bb' }]

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
              blogs={blogs}
              setBlogs={setBlogs}
              setSuccessMessage={setSuccessMessage}
              setErrorMessage={setErrorMessage}
              blogFormRef={blogFormRef}
            />
          </Togglable>

          <ul>
            {blogsToShow.sort((a, b) => (b.likes - a.likes)).map(blog => (
              <Blog
                key={blog.id}
                blog={blog}
                blogService={blogService}
                setErrorMessage={setErrorMessage}
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