const { test, expect, beforeEach, describe } = require('@playwright/test')

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
      await page.getByLabel('username').fill('test_case_user')
      await page.getByLabel('password').fill('test_case_pw')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Test Case User logged in')).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong credentials')).toBeVisible()
    })
  })
})

