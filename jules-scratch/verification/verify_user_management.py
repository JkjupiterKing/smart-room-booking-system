from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Navigate to the landing page
    page.goto("http://localhost:4200/landing-page")

    # Take a screenshot to see what the page looks like
    page.screenshot(path="jules-scratch/verification/landing-page.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
