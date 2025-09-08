import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto("http://localhost:8000")

        # Wait for the page to be fully loaded
        await page.wait_for_load_state('networkidle')

        # Simulate login
        await page.evaluate("window.ng.getInjector(document.querySelector('app-root')).get(window.ng.getComponent(document.querySelector('app-root')).constructor).userService.login()")
        await page.evaluate("window.ng.getInjector(document.querySelector('app-root')).get(window.ng.getComponent(document.querySelector('app-root')).constructor).userService.setAdmin(false)")

        # Wait for the user navbar to appear
        await page.wait_for_selector('app-user-navbar')

        # Click the profile icon
        await page.click('.profile-icon')

        # Wait for the dropdown to appear
        await page.wait_for_selector('.dropdown-menu')

        # Take a screenshot
        await page.screenshot(path="jules-scratch/verification/verification.png")

        await browser.close()

asyncio.run(main())
