import { useState } from 'react'

const LikeLine = ({ blog, blogService, setErrorMessage }) => {
  const [likes, setLikes] = useState(blog.likes)

  try {
    const handleLike = async () => {
      await blogService.update(blog.id, {
        ...blog,
        likes: blog.likes + 1
      })
      setLikes(likes + 1)
    }

    return (
      <p>
        likes {likes}
        <button onClick={handleLike}>like</button>
      </p>
    )
  } catch (error) {
    setErrorMessage('Failed to like blog: ' + error)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }
}

const DeleteButton = ({ blog, blogService, setErrorMessage, ref }) => {
  if (blog.user === null || blog.username !== window.localStorage.getItem('loggedUser').username) {
    return null
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if (confirmed) {
      const resp = await blogService.del(blog.id)
      if (resp.status === 204) {
        ref.current.style.display = 'none'
      }
    }
  }

  try {
    return (<button onClick={handleDelete}>remove</button>)
  } catch (error) {
    setErrorMessage('Failed to delete blog: ' + error)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }
}

const Blog = ({ blog, blogService, setErrorMessage, ref }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    display: ''
  }

  return (
    <div style={blogStyle} ref={ref}>
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div>
          <p>{blog.url}</p>
          <LikeLine blog={blog} blogService={blogService} setErrorMessage={setErrorMessage}></LikeLine>
          <p>{blog.user === null ? 'null' : blog.user.name}</p>
          <DeleteButton blog={blog} blogService={blogService} setErrorMessage={setErrorMessage} ref={ref}></DeleteButton>
        </div>
      )}
    </div>
  )
}

export default Blog