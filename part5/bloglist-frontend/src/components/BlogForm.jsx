import blogService from '../services/blogs'

const BlogForm = ({
  blogs,
  setBlogs,
  setSuccessMessage,
  setErrorMessage,
  blogFormRef,
}) => {

  const handleBlogCreate = async (event) => {
    event.preventDefault()
    const title = event.target.title.value
    const author = event.target.author.value
    const url = event.target.url.value

    try {
      blogFormRef.current.toggleVisibility()
      const newBlog = await blogService.create({ title, author, url })
      setBlogs(blogs.concat(newBlog))
      setSuccessMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
      event.target.reset()

    } catch (error) {
      console.error(error)
      setErrorMessage('failed to create blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  return (
    <form onSubmit={handleBlogCreate}>
      <div><label>title:<input name="title" /></label></div>
      <div><label>author:<input name="author" /></label></div>
      <div><label>url:<input name="url" /></label></div>
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm