import { useState } from 'react'

const LikeLine = ({ blog, handleLike }) => {
  return (
    <p>
      likes {blog.likes}
      <button onClick={() => handleLike(blog)}>like</button>
    </p>
  )
}

const DeleteButton = ({ blog, handleDelete }) => {
  if (blog.user === null ||
    window.localStorage.getItem('loggedUser') === null ||
    blog.username !== window.localStorage.getItem('loggedUser').username) {
    return null
  }

  return (<button onClick={() => handleDelete(blog)}>remove</button>)
}

const Blog = ({ blog, handleLike, handleDelete }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    display: ''
  }

  // Add css classes to help with testing
  return (
    <div style={blogStyle} className='blog'>
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div>
          <p>{blog.url}</p>
          <LikeLine blog={blog} handleLike={handleLike}></LikeLine>
          <p>{blog.user === null ? 'null' : blog.user.name}</p>
          <DeleteButton blog={blog} handleDelete={handleDelete}></DeleteButton>
        </div>
      )}
    </div>
  )
}

export default Blog