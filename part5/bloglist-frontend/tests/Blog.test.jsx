import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../src/components/Blog'
import BlogForm from '../src/components/BlogForm'

test('renders title and author, but not URL and likes by default', () => {
  const blog = {
    title: 'A title',
    author: 'An author',
    url: 'http://example.com',
    likes: 0,
    user: {
      username: 'testuser'
    }
  }

  const { container } = render(<Blog blog={blog} />)

  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent('A title')
  expect(div).toHaveTextContent('An author')
  expect(div).not.toHaveTextContent('http://example.com')
  expect(div).not.toHaveTextContent('likes 0')
})

test('renders URL and likes when the view button is clicked', async () => {
  const blog = {
    title: 'A title',
    author: 'An author',
    url: 'http://example.com',
    likes: 0,
    user: {
      username: 'testuser'
    }
  }

  const { container } = render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent('A title')
  expect(div).toHaveTextContent('An author')
  expect(div).toHaveTextContent('http://example.com')
  expect(div).toHaveTextContent('likes 0')
})

test('clicking the like button twice calls the event handler twice', async () => {
  const blog = {
    title: 'A title',
    author: 'An author',
    url: 'http://example.com',
    likes: 0,
    user: {
      username: 'testuser'
    }
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} handleLike={mockHandler} />)

  const user = userEvent.setup()
  await user.click(screen.getByText('view'))

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler).toHaveBeenCalledTimes(2)
})

test('calls the create handler with the new blog details', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  await user.type(screen.getByLabelText('title:'), 'A new title')
  await user.type(screen.getByLabelText('author:'), 'A new author')
  await user.type(screen.getByLabelText('url:'), 'https://example.com')
  await user.click(screen.getByRole('button', { name: 'create' }))

  expect(createBlog).toHaveBeenCalledWith({
    title: 'A new title',
    author: 'A new author',
    url: 'https://example.com',
  })
})
