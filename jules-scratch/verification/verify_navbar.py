import re
from playwright.sync_api import Page, expect
import random
import string

def get_random_string(length):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))

def test_user_navbar_flow(page: Page):
    # Navigate to the landing page
    page.goto("http://localhost:4200/landing-page")

    # Register a new user
    username = get_random_string(8)
    password = "password"
    email = username + "@example.com"

    page.get_by_text("Register").click()
    page.get_by_label("Username:").fill(username)
    page.get_by_label("Email:").fill(email)
    page.get_by_label("Password:").fill(password)
    page.get_by_role("button", name="Register").click()

    # Wait for registration to complete and login modal to appear
    expect(page.get_by_text("Login")).to_be_visible()

    # Log in as the new user
    page.get_by_label("Username:").fill(username)
    page.get_by_label("Password:").fill(password)
    page.get_by_role("button", name="Login").click()

    # Wait for navigation to complete
    page.wait_for_url("http://localhost:4200/landing-page")

    # Check that the user navbar is visible and public navbar is not
    expect(page.get_by_text("Login")).not_to_be_visible()
    expect(page.get_by_text("Register")).not_to_be_visible()
    user_navbar = page.locator("app-user-navbar")
    expect(user_navbar).to_be_visible()

    # Check for user initial in avatar
    avatar = user_navbar.locator(".avatar")
    expect(avatar).to_be_visible()
    expect(avatar).to_have_text(username[0].upper())

    # Open dropdown and take screenshot
    avatar.click()
    dropdown = user_navbar.locator(".dropdown-menu")
    expect(dropdown).to_be_visible()
    page.screenshot(path="../jules-scratch/verification/01_navbar_dropdown.png")

    # Click Booking Management and verify navigation
    dropdown.get_by_text("Booking Management").click()
    expect(page).to_have_url(re.compile(".*booking-management"))

    # Verify navbar is still present and take another screenshot
    expect(page.locator("app-user-navbar")).to_be_visible()
    page.screenshot(path="../jules-scratch/verification/02_booking_management_page.png")
