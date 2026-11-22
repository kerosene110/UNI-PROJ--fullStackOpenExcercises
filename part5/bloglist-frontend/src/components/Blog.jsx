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
        {likes}
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

const Blog = ({ blog, blogService }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div>
          <p>{blog.url}</p>
          <LikeLine blog={blog} blogService={blogService}></LikeLine>
          <p>{blog.user === null ? 'null' : blog.user.name}</p>
        </div>
      )}
    </div>
  )
}

export default Blog