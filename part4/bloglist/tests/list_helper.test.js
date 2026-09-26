const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of a bigger list is calculated right', () => {
    const x = 10
    const biggerList = [].concat(... new Array(x).fill(listWithOneBlog))
    const result = listHelper.totalLikes(biggerList)
    assert.strictEqual(result, listWithOneBlog[0].likes * x)
  })
})

const { blogs } = require('./data')

describe('Favorite blog', () => {
  test('of empty list returns null', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.strictEqual(result, blogs[2])
  })
})

describe('Author with the most blogs', () => {
  test('of empty list returns null', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result,
      {
        author: "Robert C. Martin",
        blogs: 3
      }
    )
  })


})

describe('Author with the most likes', () => {
  test('of empty list returns null', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, null)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result,
      {
        author: "Edsger W. Dijkstra",
        likes: 17
      }
    )
  })
})