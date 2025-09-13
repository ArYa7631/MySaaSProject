import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing authentication state
    await page.context().clearCookies()
    await page.goto('/')
  })

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/login')
    
    await expect(page).toHaveTitle(/Login/)
    await expect(page.locator('h1')).toContainText('Sign In')
  })

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/register')
    
    await expect(page).toHaveTitle(/Register/)
    await expect(page.locator('h1')).toContainText('Create Account')
  })

  test('should show validation errors for invalid login', async ({ page }) => {
    await page.goto('/login')
    
    // Try to submit empty form
    await page.click('button[type="submit"]')
    
    // Should show validation errors
    await expect(page.locator('text=Email is required')).toBeVisible()
    await expect(page.locator('text=Password is required')).toBeVisible()
  })

  test('should show validation errors for invalid registration', async ({ page }) => {
    await page.goto('/register')
    
    // Try to submit empty form
    await page.click('button[type="submit"]')
    
    // Should show validation errors
    await expect(page.locator('text=Email is required')).toBeVisible()
    await expect(page.locator('text=Password is required')).toBeVisible()
    await expect(page.locator('text=Community name is required')).toBeVisible()
    await expect(page.locator('text=Domain is required')).toBeVisible()
  })

  test('should validate email format', async ({ page }) => {
    await page.goto('/register')
    
    // Enter invalid email
    await page.fill('input[name="email"]', 'invalid-email')
    await page.fill('input[name="password"]', 'password123')
    await page.fill('input[name="password_confirmation"]', 'password123')
    await page.fill('input[name="name"]', 'Test Community')
    await page.fill('input[name="domain"]', 'test-community')
    
    await page.click('button[type="submit"]')
    
    // Should show email validation error
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible()
  })

  test('should validate password confirmation', async ({ page }) => {
    await page.goto('/register')
    
    // Enter mismatched passwords
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.fill('input[name="password_confirmation"]', 'different-password')
    await page.fill('input[name="name"]', 'Test Community')
    await page.fill('input[name="domain"]', 'test-community')
    
    await page.click('button[type="submit"]')
    
    // Should show password confirmation error
    await expect(page.locator('text=Passwords do not match')).toBeVisible()
  })

  test('should navigate between login and register pages', async ({ page }) => {
    await page.goto('/login')
    
    // Click link to register page
    await page.click('text=Create an account')
    await expect(page).toHaveURL('/register')
    
    // Click link back to login page
    await page.click('text=Already have an account?')
    await expect(page).toHaveURL('/login')
  })

  test('should handle successful login', async ({ page }) => {
    // Mock successful login response
    await page.route('**/api/v1/auth/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            user: {
              id: 1,
              email: 'test@example.com',
              first_name: 'Test',
              last_name: 'User',
              community_id: 1,
            },
            token: 'mock-token',
            community: {
              id: 1,
              name: 'Test Community',
            },
          },
        }),
      })
    })

    await page.goto('/login')
    
    // Fill in login form
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Should redirect to admin dashboard
    await expect(page).toHaveURL('/admin')
  })

  test('should handle successful registration', async ({ page }) => {
    // Mock successful registration response
    await page.route('**/api/v1/auth/register', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            user: {
              id: 1,
              email: 'new@example.com',
              first_name: 'New',
              last_name: 'User',
              community_id: 1,
            },
            token: 'mock-token',
            community: {
              id: 1,
              name: 'New Community',
            },
          },
        }),
      })
    })

    await page.goto('/register')
    
    // Fill in registration form
    await page.fill('input[name="email"]', 'new@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.fill('input[name="password_confirmation"]', 'password123')
    await page.fill('input[name="name"]', 'New Community')
    await page.fill('input[name="domain"]', 'new-community')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Should redirect to admin dashboard
    await expect(page).toHaveURL('/admin')
  })

  test('should handle login error', async ({ page }) => {
    // Mock failed login response
    await page.route('**/api/v1/auth/login', async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Invalid credentials',
        }),
      })
    })

    await page.goto('/login')
    
    // Fill in login form
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'wrong-password')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Should show error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible()
  })

  test('should handle registration error', async ({ page }) => {
    // Mock failed registration response
    await page.route('**/api/v1/auth/register', async route => {
      await route.fulfill({
        status: 422,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Email already exists',
        }),
      })
    })

    await page.goto('/register')
    
    // Fill in registration form
    await page.fill('input[name="email"]', 'existing@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.fill('input[name="password_confirmation"]', 'password123')
    await page.fill('input[name="name"]', 'Test Community')
    await page.fill('input[name="domain"]', 'test-community')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Should show error message
    await expect(page.locator('text=Email already exists')).toBeVisible()
  })

  test('should handle logout', async ({ page }) => {
    // Mock successful logout response
    await page.route('**/api/v1/auth/logout', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      })
    })

    // Mock authenticated user
    await page.addInitScript(() => {
      localStorage.setItem('authToken', 'mock-token')
      localStorage.setItem('userData', JSON.stringify({
        id: 1,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        community_id: 1,
      }))
    })

    await page.goto('/admin')
    
    // Click logout button
    await page.click('[data-testid="user-menu"]')
    await page.click('text=Logout')
    
    // Should redirect to home page
    await expect(page).toHaveURL('/')
  })

  test('should redirect authenticated users from login page', async ({ page }) => {
    // Mock authenticated user
    await page.addInitScript(() => {
      localStorage.setItem('authToken', 'mock-token')
      localStorage.setItem('userData', JSON.stringify({
        id: 1,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        community_id: 1,
      }))
    })

    await page.goto('/login')
    
    // Should redirect to admin dashboard
    await expect(page).toHaveURL('/admin')
  })

  test('should redirect authenticated users from register page', async ({ page }) => {
    // Mock authenticated user
    await page.addInitScript(() => {
      localStorage.setItem('authToken', 'mock-token')
      localStorage.setItem('userData', JSON.stringify({
        id: 1,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        community_id: 1,
      }))
    })

    await page.goto('/register')
    
    // Should redirect to admin dashboard
    await expect(page).toHaveURL('/admin')
  })
})
