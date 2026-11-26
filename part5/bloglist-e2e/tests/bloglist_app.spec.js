const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // Empty the db
    await request.post('http://localhost:3003/api/testing/reset')

    // Create a user for the backend
    const newUser = {
      username: 'test_case_user',
      name: "Test Case User",
      password: 'test_case_pw'
    }
    await request.post('http://localhost:3003/api/users', {
      data: newUser
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      loginWith(page, 'test_case_user', 'test_case_pw')

      await expect(page.getByText('Test Case User logged in')).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      loginWith(page, 'mluukkai', 'wrong')

      await expect(page.getByText('wrong credentials')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      loginWith(page, 'test_case_user', 'test_case_pw')
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel('title').fill('A title')
      await page.getByLabel('author').fill('An author')
      await page.getByLabel('url').fill('https://www.example.com')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('a new blog A title by An author added')).toBeVisible()
      const blog = page.locator('.blog')
      await expect(blog).toContainText('A title')
      await expect(blog).toContainText('An author')
      await expect(blog.getByRole('button', { name: 'view' })).toBeVisible()
    })


  })
})

