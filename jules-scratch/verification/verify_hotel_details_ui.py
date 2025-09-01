from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:4200/hotel-details/1", wait_until="networkidle", timeout=60000)
    page.wait_for_selector(".hotel-details-container", timeout=60000)
    page.screenshot(path="jules-scratch/verification/verification.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
