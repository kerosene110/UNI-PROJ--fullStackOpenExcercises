import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  // const [newBlog, setNewBlog] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('test_case_user')
  const [password, setPassword] = useState('test_case_pw')
  const [user, setUser] = useState(null)


  useEffect(() => {
    blogService.getAll().then(initialBlogs =>
      setBlogs(initialBlogs)
    )
  }, [])


  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
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
        <Notification message={errorMessage} /></div>
      )
        && loginForm()
      }

      {user && (
        <div>
          <h2>blogs</h2>
          <p>{user.name} logged in</p>

          <ul>
            {blogsToShow.map(blog => (
              <Blog
                key={blog.id}
                blog={blog}
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