import { render } from '@testing-library/react'
import Blog from '../src/components/Blog'

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
  expect(div).not.toHaveTextContent('0')
})