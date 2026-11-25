const BlogForm = ({ createBlog }) => {
  const handleSubmit = async (event) => {
    event.preventDefault()
    const blog = {
      title: event.target.elements.namedItem('title').value,
      author: event.target.elements.namedItem('author').value,
      url: event.target.elements.namedItem('url').value,
    }

    const created = await createBlog(blog)
    if (created) {
      event.target.reset()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div><label>title:<input name="title" /></label></div>
      <div><label>author:<input name="author" /></label></div>
      <div><label>url:<input name="url" /></label></div>
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm