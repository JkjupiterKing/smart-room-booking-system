from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:4200/hotel-details/1", wait_until="networkidle", timeout=60000)
    page.wait_for_selector(".hotel-details-container", timeout=60000)

    # Fill in the form
    page.fill('input[name="checkInDate"]', '2025-10-01')
    page.fill('input[name="checkOutDate"]', '2025-10-05')
    page.fill('input[name="guests"]', '2')

    # Click the "Check Availability" button
    page.click('button:has-text("Check Availability")')

    # Wait for the result to appear
    page.wait_for_selector(".availability-result", timeout=60000)

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/verification.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
