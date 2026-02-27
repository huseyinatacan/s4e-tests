// @ts-check
const { test, expect } = require("@playwright/test");

/**
 * Cleans up assets added during testing.
 * @param {import('@playwright/test').Page} page
 */
async function cleanupAssets(page) {


    await page.goto("/asset-manager");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);

    if (!(await page.getByText('No Data Found').isVisible())) {
        await page.getByRole('combobox', { name: 'Rows per page:' }).click();
        await page.getByRole('option', { name: '100' }).click();
        await page.waitForTimeout(2000);
    }


    while (!(await page.getByText('No Data Found').isVisible())) {
        // If the select-all checkbox doesn't exist, there are no assets left
        const selectAll = page.getByRole('checkbox', { name: 'select all assets' });
        if (!(await selectAll.isVisible({ timeout: 3000 }).catch(() => false))) {
            break;
        }

        await selectAll.click();
        await page.waitForTimeout(1000);


        await page.locator('.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeMedium.css-mw9dnl').click();


        const confirmDeleteBtn = page.getByRole('button', { name: 'Delete' }).last();
        await confirmDeleteBtn.waitFor({ state: 'visible', timeout: 5000 });
        await confirmDeleteBtn.click();


        await page.waitForTimeout(2000);

    }
}

test.describe("Asset Manager", () => {


    test.setTimeout(120_000); // 2 minutes per test (cleanup hooks take time)

    test.beforeEach(async ({ page }) => {
        await cleanupAssets(page);
    });
    test.afterEach(async ({ page }) => {
        await cleanupAssets(page);
    });


    /*test("Entering the test mode", async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("domcontentloaded");


        await page.getByText('Test Mode').click(); // Go to test mode
        await page.waitForTimeout(1000);

        await page.getByRole('button', { name: 'T', exact: true }).click(); // Click the avatar


        await page.waitForTimeout(1000); // Wait for the dropdown menu


        const emailText = page.getByText('@');
        const email = await emailText.first().textContent();
        console.log(email);
        expect(email).toMatch("test@s4e.io");

        console.log("Email in  test mode:", email);
    });*/

    /*test("Entering the Asset Manager", async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("domcontentloaded");


        await page.getByRole('button', { name: 'Asset Manager' }).first().click();
        await page.waitForLoadState("domcontentloaded");
        await expect(page.getByRole('heading', { name: 'Asset Manager' })).toBeVisible();

        const url = page.url();
        expect(url).toMatch(/asset-manager/i);

        console.log("URL:", url);


    });*/

    // Adding Assets


    test("Add Asset with Normal input", async ({ page }) => {
        await page.goto("/asset-manager");
        await page.waitForLoadState("domcontentloaded");
        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.getByRole('textbox', { name: /domain/i }).fill('test.com');
        await page.getByRole('textbox', { name: /description/i }).fill('Test asset description');
        await page.locator('#asset-add-terms-check').click();
        await page.locator('#asset-add-allow-scan-check').click();
        await page.locator('#asset-add-authority-check').click();
        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.waitForTimeout(1000);
        await expect(page.getByText('Asset Verification')).toBeVisible();
        await page.getByRole('button', { name: 'close' }).click();

    });

    test("Add Asset with same domain", async ({ page }) => {
        await page.goto("/asset-manager");
        await page.waitForLoadState("domcontentloaded");
        await page.getByRole('button', { name: 'Add Asset' }).waitFor({ state: 'visible' });
        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.getByRole('textbox', { name: /domain/i }).fill('test.com');
        await page.getByRole('textbox', { name: /description/i }).fill('Test asset description');
        await page.locator('#asset-add-terms-check').click();
        await page.locator('#asset-add-allow-scan-check').click();
        await page.locator('#asset-add-authority-check').click();
        await page.getByRole('button', { name: 'Add Asset' }).click();

        await expect(page.getByText('Asset Verification')).toBeVisible();
        await page.getByRole('button', { name: 'close' }).click();


        // Adding the same domain again
        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.getByRole('textbox', { name: /domain/i }).fill('test.com');
        await page.getByRole('textbox', { name: /description/i }).fill('Test asset description');
        await page.locator('#asset-add-terms-check').click();
        await page.locator('#asset-add-allow-scan-check').click();
        await page.locator('#asset-add-authority-check').click();
        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.getByRole('button', { name: 'Back' }).waitFor({ state: 'visible' });
        await expect(page.getByRole('button', { name: 'Back' })).toBeVisible();

        await page.getByRole('button', { name: 'Back' }).click();
        await page.getByRole('button', { name: 'close' }).waitFor({ state: 'visible' });
        await page.getByRole('button', { name: 'close' }).click();


    });

    // 
    test("Add Asset with same domain (case-insensitive)", async ({ page }) => {
        await page.goto("/asset-manager");
        await page.waitForLoadState("domcontentloaded");
        await page.getByRole('button', { name: 'Add Asset' }).waitFor({ state: 'visible' });
        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.getByRole('textbox', { name: /domain/i }).fill('test.com');
        await page.getByRole('textbox', { name: /description/i }).fill('Test asset description');
        await page.locator('#asset-add-terms-check').click();
        await page.locator('#asset-add-allow-scan-check').click();
        await page.locator('#asset-add-authority-check').click();
        await page.getByRole('button', { name: 'Add Asset' }).click();

        await expect(page.getByText('Asset Verification')).toBeVisible();
        await page.getByRole('button', { name: 'close' }).click();


        // Adding the same domain in UPPERCASE — system should treat it as duplicate
        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.getByRole('textbox', { name: /domain/i }).fill('TEST.com');
        await page.getByRole('textbox', { name: /description/i }).fill('Test asset description');
        await page.locator('#asset-add-terms-check').click();
        await page.locator('#asset-add-allow-scan-check').click();
        await page.locator('#asset-add-authority-check').click();
        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.getByRole('button', { name: 'Back' }).waitFor({ state: 'visible' });
        await expect(page.getByRole('button', { name: 'Back' })).toBeVisible();

        await page.getByRole('button', { name: 'Back' }).click();
        await page.getByRole('button', { name: 'close' }).waitFor({ state: 'visible' });
        await page.getByRole('button', { name: 'close' }).click();


    });

    test("Add Asset with Normal IP", async ({ page }) => {
        await page.goto("/asset-manager");
        await page.waitForLoadState("domcontentloaded");
        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.getByRole('textbox', { name: /domain/i }).fill('8.8.8.8');
        await page.getByRole('textbox', { name: /description/i }).fill('Test asset description');
        await page.locator('#asset-add-terms-check').click();
        await page.locator('#asset-add-allow-scan-check').click();
        await page.locator('#asset-add-authority-check').click();
        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.waitForTimeout(1000);
        await expect(page.getByText('Asset Verification')).toBeVisible();
        await page.getByRole('button', { name: 'close' }).click();

    });

    test("Add Asset with not so random Integer", async ({ page }) => {
        await page.goto("/asset-manager");
        await page.waitForLoadState("domcontentloaded");
        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.getByRole('textbox', { name: /domain/i }).fill('134744072.');// System should warn user
        await page.getByRole('textbox', { name: /description/i }).fill('Test asset description');
        await page.locator('#asset-add-terms-check').click();
        await page.locator('#asset-add-allow-scan-check').click();
        await page.locator('#asset-add-authority-check').click();
        await expect(page.getByText('Please enter a valid domain or IP address or IP address range')).toBeVisible();

    });

    test("Try to add asset with missing IP octet", async ({ page }) => {
        await page.goto("/asset-manager");
        await page.waitForLoadState("domcontentloaded");
        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.getByRole('textbox', { name: /domain/i }).fill('8.8.8');// System should warn user
        await page.getByRole('textbox', { name: /description/i }).fill('Test asset description');
        await page.locator('#asset-add-terms-check').click();
        await page.locator('#asset-add-allow-scan-check').click();
        await page.locator('#asset-add-authority-check').click();
        await expect(page.getByText('Please enter a valid domain or IP address or IP address range')).toBeVisible();

    });

    test("Try to add asset with missing IP two octet", async ({ page }) => {
        await cleanupAssets(page);
        await page.goto("/asset-manager");
        await page.waitForLoadState("domcontentloaded");
        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.getByRole('textbox', { name: /domain/i }).fill('8.8.');// System should warn user
        await page.getByRole('textbox', { name: /description/i }).fill('Test asset description');
        await page.locator('#asset-add-terms-check').click();
        await page.locator('#asset-add-allow-scan-check').click();
        await page.locator('#asset-add-authority-check').click();
        await expect(page.getByText('Please enter a valid domain or IP address or IP address range')).toBeVisible();

    });

    test("Try to add asset with invalid IP (contain negative value) ", async ({ page }) => {
        await page.goto("/asset-manager");
        await page.waitForLoadState("domcontentloaded");
        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.getByRole('textbox', { name: /domain/i }).fill('8.8.-8.8');// System should warn user
        await page.getByRole('textbox', { name: /description/i }).fill('Test asset description');
        await page.locator('#asset-add-terms-check').click();
        await page.locator('#asset-add-allow-scan-check').click();
        await page.locator('#asset-add-authority-check').click();
        await expect(page.getByText('Please enter a valid domain or IP address or IP address range')).toBeVisible();

    });

    test("Try to add asset with invalid IP (contains value bigger than 255) ", async ({ page }) => {
        await page.goto("/asset-manager");
        await page.waitForLoadState("domcontentloaded");
        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.getByRole('textbox', { name: /domain/i }).fill('8.8.8.256');// System should warn user
        await page.getByRole('textbox', { name: /description/i }).fill('Test asset description');
        await page.locator('#asset-add-terms-check').click();
        await page.locator('#asset-add-allow-scan-check').click();
        await page.locator('#asset-add-authority-check').click();
        await expect(page.getByText('Please enter a valid domain or IP address or IP address range')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Add Asset' })).toBeDisabled();

    });

    test("Try to add asset with invalid IP (last octet -1) ", async ({ page }) => {
        await page.goto("/asset-manager");
        await page.waitForLoadState("domcontentloaded");
        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.getByRole('textbox', { name: /domain/i }).fill('8.8.8.-1');// System should warn user
        await page.getByRole('textbox', { name: /description/i }).fill('Test asset description');
        await page.locator('#asset-add-terms-check').click();
        await page.locator('#asset-add-allow-scan-check').click();
        await page.locator('#asset-add-authority-check').click();
        await expect(page.getByText('Please enter a valid domain or IP address or IP address range')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Add Asset' })).toBeDisabled();

    });

    test("Try to add asset with invalid IP (last octet 255) ", async ({ page }) => {
        await page.goto("/asset-manager");
        await page.waitForLoadState("domcontentloaded");
        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.getByRole('textbox', { name: /domain/i }).fill('8.8.8.255');
        await page.getByRole('textbox', { name: /description/i }).fill('Test asset description');
        await page.locator('#asset-add-terms-check').click();
        await page.locator('#asset-add-allow-scan-check').click();
        await page.locator('#asset-add-authority-check').click();
        await expect(page.getByText('Please enter a valid domain or IP address or IP address range')).not.toBeVisible();
        await expect(page.getByRole('button', { name: 'Add Asset' })).not.toBeDisabled();

    });

    test("Try to add asset with invalid IPv6 (contains letter other than a-f) ", async ({ page }) => {
        await page.goto("/asset-manager");
        await page.waitForLoadState("domcontentloaded");
        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.getByRole('textbox', { name: /domain/i }).fill('2001:0db8:85a3:0000:0000:8a2e:0370:733g');// System should warn user
        await page.getByRole('textbox', { name: /description/i }).fill('Test asset description');
        await page.locator('#asset-add-terms-check').click();
        await page.locator('#asset-add-allow-scan-check').click();
        await page.locator('#asset-add-authority-check').click();
        await expect(page.getByText('Please enter a valid domain or IP address or IP address range')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Add Asset' })).toBeDisabled();

    });

    test("Add Multiple Assets with Normal input", async ({ page }) => {
        await page.goto("/asset-manager");
        await page.waitForLoadState("domcontentloaded");
        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.getByRole('textbox', { name: /domain/i }).fill('test.com\n8.8.8.8');
        await page.getByRole('textbox', { name: /description/i }).fill('Test asset description');
        await page.locator('#asset-add-terms-check').click();
        await page.locator('#asset-add-allow-scan-check').click();
        await page.locator('#asset-add-authority-check').click();
        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.waitForTimeout(1000);
        await expect(page.getByRole('heading', { name: '2' }).first()).toBeVisible();

    });

    test("Add Multiple Assets with same domain", async ({ page }) => {
        await page.goto("/asset-manager");
        await page.waitForLoadState("domcontentloaded");
        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.getByRole('textbox', { name: /domain/i }).fill('test.com\n8.8.8.8\n8.8.8.8\ntest.com');
        await page.getByRole('textbox', { name: /description/i }).fill('Test asset description');
        await page.locator('#asset-add-terms-check').click();
        await page.locator('#asset-add-allow-scan-check').click();
        await page.locator('#asset-add-authority-check').click();
        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.waitForTimeout(1000);
        await expect(page.getByRole('heading', { name: '2' }).first()).toBeVisible();

    });

    test("Add Multiple Assets with same domain with uppercase letters", async ({ page }) => {// System handles the same domain name but shows error when using uppercase
        await page.goto("/asset-manager");
        await page.waitForLoadState("domcontentloaded");
        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.getByRole('textbox', { name: /domain/i }).fill('test.com\n8.8.8.8\nTEST.com');
        await page.getByRole('textbox', { name: /description/i }).fill('Test asset description');
        await page.locator('#asset-add-terms-check').click();
        await page.locator('#asset-add-allow-scan-check').click();
        await page.locator('#asset-add-authority-check').click();
        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.waitForTimeout(1000);
        await expect(page.getByRole('heading', { name: '2' }).first()).toBeVisible();
    });





    //CIDR

    test("Add Multiple Assets using CIDR notation", async ({ page }) => {
        await page.goto("/asset-manager");
        await page.waitForLoadState("domcontentloaded");
        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.getByRole('textbox', { name: /domain/i }).fill('8.8.8.8/24');
        await page.getByRole('textbox', { name: /description/i }).fill('Test asset description');
        await page.locator('#asset-add-terms-check').click();
        await page.locator('#asset-add-allow-scan-check').click();
        await page.locator('#asset-add-authority-check').click();
        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.waitForTimeout(1000);
        await expect(page.getByRole('heading', { name: '256' }).first()).toBeVisible();

    });

    test("Add Multiple Assets using CIDR notation(negative number)", async ({ page }) => {
        await page.goto("/asset-manager");
        await page.waitForLoadState("domcontentloaded");
        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.getByRole('textbox', { name: /domain/i }).fill('8.8.8.8/-1');
        await page.getByRole('textbox', { name: /description/i }).fill('Test asset description');
        await page.locator('#asset-add-terms-check').click();
        await page.locator('#asset-add-allow-scan-check').click();
        await page.locator('#asset-add-authority-check').click();
        await page.getByRole('button', { name: 'Add Asset' }).click();
        await expect(page.getByText('Please enter a valid domain or IP address or IP address range')).toBeVisible();


    });

    test("Add Multiple Assets using CIDR notation(large number)", async ({ page }) => {
        await page.goto("/asset-manager");
        await page.waitForLoadState("domcontentloaded");
        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.getByRole('textbox', { name: /domain/i }).fill('8.8.8.8/999');
        await page.getByRole('textbox', { name: /description/i }).fill('Test asset description');
        await page.locator('#asset-add-terms-check').click();
        await page.locator('#asset-add-allow-scan-check').click();
        await page.locator('#asset-add-authority-check').click();
        await page.getByRole('button', { name: 'Add Asset' }).click();
        await expect(page.getByText('Please enter a valid domain or IP address or IP address range')).toBeVisible();


    });

    test("Add Normal IP first then Multiple Assets using CIDR notation", async ({ page }) => {
        await page.goto("/asset-manager");
        await page.waitForLoadState("domcontentloaded");
        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.getByRole('textbox', { name: /domain/i }).fill('8.8.8.8');
        await page.getByRole('textbox', { name: /description/i }).fill('Test asset description');
        await page.locator('#asset-add-terms-check').click();
        await page.locator('#asset-add-allow-scan-check').click();
        await page.locator('#asset-add-authority-check').click();
        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.waitForTimeout(1000);
        await expect(page.getByText('Asset Verification')).toBeVisible();
        await page.getByRole('button', { name: 'close' }).click();
        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.getByRole('textbox', { name: /domain/i }).fill('8.8.8.8/24');
        await page.getByRole('textbox', { name: /description/i }).fill('Test asset description');
        await page.locator('#asset-add-terms-check').click();
        await page.locator('#asset-add-allow-scan-check').click();
        await page.locator('#asset-add-authority-check').click();
        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.waitForTimeout(1000);
        await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
        await page.getByRole('button', { name: 'Add' }).click();
        await page.waitForTimeout(3000);
        await expect(page.getByRole('button', { name: 'Add' })).not.toBeVisible();
        await expect(page.getByRole('heading', { name: '256' }).first()).toBeVisible();

    });










    // Delete Asset Tests


    test("Delete one asset", async ({ page }) => {
        await page.goto("/asset-manager");
        await page.waitForLoadState("domcontentloaded");

        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.getByRole('textbox', { name: /domain/i }).fill('test.com');
        await page.getByRole('textbox', { name: /description/i }).fill('Test asset description');
        await page.locator('#asset-add-terms-check').click();
        await page.locator('#asset-add-allow-scan-check').click();
        await page.locator('#asset-add-authority-check').click();
        await page.getByRole('button', { name: 'Add Asset' }).click();

        await expect(page.getByText('Asset Verification')).toBeVisible();
        await page.getByRole('button', { name: 'close' }).click();

        await page.getByRole('checkbox', { name: 'select asset' }).first().click();
        await page.getByText('Delete').click();
        await expect(page.getByRole('button', { name: 'test.com' })).toBeVisible();
        await page.getByRole('button', { name: 'Delete' }).click();
        await expect(page.getByText('test.com')).not.toBeVisible();


    });


    test("Delete 10 asset using select all", async ({ page }) => {
        await page.goto("/asset-manager");
        await page.waitForLoadState("domcontentloaded");

        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.getByRole('textbox', { name: /domain/i }).fill('8.8.8.8/24');
        await page.getByRole('textbox', { name: /description/i }).fill('Test asset description');
        await page.locator('#asset-add-terms-check').click();
        await page.locator('#asset-add-allow-scan-check').click();
        await page.locator('#asset-add-authority-check').click();
        await page.getByRole('button', { name: 'Add Asset' }).click();



        const countBefore = parseInt(await page.getByRole('heading', { name: '256' }).nth(2).textContent() ?? '0');

        await page.getByRole('checkbox', { name: 'select all assets' }).click();
        await page.waitForTimeout(1000);


        await page.locator('.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeMedium.css-mw9dnl').click();


        const confirmDeleteBtn = page.getByRole('button', { name: 'Delete' }).last();
        await confirmDeleteBtn.waitFor({ state: 'visible' });
        await confirmDeleteBtn.click();


        await page.waitForTimeout(2000);


        const expectedCount = (countBefore - 10).toString();
        await expect(page.getByRole('heading', { name: expectedCount }).nth(2)).toBeVisible();



    });

    test("Delete 25 asset using select all", async ({ page }) => {
        await page.goto("/asset-manager");
        await page.waitForLoadState("domcontentloaded");

        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.getByRole('textbox', { name: /domain/i }).fill('8.8.8.8/24');
        await page.getByRole('textbox', { name: /description/i }).fill('Test asset description');
        await page.locator('#asset-add-terms-check').click();
        await page.locator('#asset-add-allow-scan-check').click();
        await page.locator('#asset-add-authority-check').click();
        await page.getByRole('button', { name: 'Add Asset' }).click();


        const countBefore = parseInt(await page.getByRole('heading', { name: '256' }).nth(2).textContent() ?? '0');

        await page.getByRole('combobox', { name: 'Rows per page:' }).click();
        await page.getByRole('option', { name: '25' }).click();
        await page.waitForTimeout(2000);

        await page.getByRole('checkbox', { name: 'select all assets' }).click();
        await page.waitForTimeout(1000);


        await page.locator('.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeMedium.css-mw9dnl').click();


        const confirmDeleteBtn = page.getByRole('button', { name: 'Delete' }).last();
        await confirmDeleteBtn.waitFor({ state: 'visible' });
        await confirmDeleteBtn.click();


        await page.waitForTimeout(2000);


        const expectedCount = (countBefore - 25).toString();
        await expect(page.getByRole('heading', { name: expectedCount }).nth(2)).toBeVisible();



    });

    test("Delete 50 asset using select all", async ({ page }) => {
        await page.goto("/asset-manager");
        await page.waitForLoadState("domcontentloaded");

        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.getByRole('textbox', { name: /domain/i }).fill('8.8.8.8/24');
        await page.getByRole('textbox', { name: /description/i }).fill('Test asset description');
        await page.locator('#asset-add-terms-check').click();
        await page.locator('#asset-add-allow-scan-check').click();
        await page.locator('#asset-add-authority-check').click();
        await page.getByRole('button', { name: 'Add Asset' }).click();


        const countBefore = parseInt(await page.getByRole('heading', { name: '256' }).nth(2).textContent() ?? '0');

        await page.getByRole('combobox', { name: 'Rows per page:' }).click();
        await page.getByRole('option', { name: '50' }).click();
        await page.waitForTimeout(2000);

        await page.getByRole('checkbox', { name: 'select all assets' }).click();
        await page.waitForTimeout(1000);


        await page.locator('.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeMedium.css-mw9dnl').click();


        const confirmDeleteBtn = page.getByRole('button', { name: 'Delete' }).last();
        await confirmDeleteBtn.waitFor({ state: 'visible' });
        await confirmDeleteBtn.click();


        await page.waitForTimeout(2000);


        const expectedCount = (countBefore - 50).toString();
        await expect(page.getByRole('heading', { name: expectedCount }).nth(2)).toBeVisible();



    });

    test("Delete 100 asset using select all", async ({ page }) => {
        await page.goto("/asset-manager");
        await page.waitForLoadState("domcontentloaded");

        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.getByRole('textbox', { name: /domain/i }).fill('8.8.8.8/24');
        await page.getByRole('textbox', { name: /description/i }).fill('Test asset description');
        await page.locator('#asset-add-terms-check').click();
        await page.locator('#asset-add-allow-scan-check').click();
        await page.locator('#asset-add-authority-check').click();
        await page.getByRole('button', { name: 'Add Asset' }).click();


        const countBefore = parseInt(await page.getByRole('heading', { name: '256' }).nth(2).textContent() ?? '0');

        await page.getByRole('combobox', { name: 'Rows per page:' }).click();
        await page.getByRole('option', { name: '100' }).click();
        await page.waitForTimeout(2000);

        await page.getByRole('checkbox', { name: 'select all assets' }).click();
        await page.waitForTimeout(1000);


        await page.locator('.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeMedium.css-mw9dnl').click();


        const confirmDeleteBtn = page.getByRole('button', { name: 'Delete' }).last();
        await confirmDeleteBtn.waitFor({ state: 'visible' });
        await confirmDeleteBtn.click();


        await page.waitForTimeout(2000);


        const expectedCount = (countBefore - 100).toString();
        await expect(page.getByRole('heading', { name: expectedCount }).nth(2)).toBeVisible();



    });

    test("Remove one asset from selection", async ({ page }) => {
        await page.goto("/asset-manager");
        await page.waitForLoadState("domcontentloaded");

        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.getByRole('textbox', { name: /domain/i }).fill('8.8.8.8/24');
        await page.getByRole('textbox', { name: /description/i }).fill('Test asset description');
        await page.locator('#asset-add-terms-check').click();
        await page.locator('#asset-add-allow-scan-check').click();
        await page.locator('#asset-add-authority-check').click();
        await page.getByRole('button', { name: 'Add Asset' }).click();


        const countBefore = parseInt(await page.getByRole('heading', { name: '256' }).nth(2).textContent() ?? '0');

        await page.getByRole('combobox', { name: 'Rows per page:' }).click();
        await page.getByRole('option', { name: '50' }).click();
        await page.waitForTimeout(2000);

        await page.getByRole('checkbox', { name: 'select all assets' }).click();
        await page.waitForTimeout(1000);


        await page.locator('.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeMedium.css-mw9dnl').click();
        await page.getByRole('button', { name: '8.8.8.255' }).locator('.MuiChip-deleteIcon').click();


        const confirmDeleteBtn = page.getByRole('button', { name: 'Delete' }).last();
        await confirmDeleteBtn.waitFor({ state: 'visible' });
        await confirmDeleteBtn.click();


        await page.waitForTimeout(2000);


        const expectedCount = (countBefore - 49).toString();
        await expect(page.getByRole('heading', { name: expectedCount }).nth(2)).toBeVisible();
        await expect(page.getByText('8.8.8.255')).toBeVisible();



    });

    test("Remove all assets from selection", async ({ page }) => {
        await page.goto("/asset-manager");
        await page.waitForLoadState("domcontentloaded");

        await page.getByRole('button', { name: 'Add Asset' }).click();
        await page.getByRole('textbox', { name: /domain/i }).fill('8.8.8.8\n8.8.8.9');

        await page.getByRole('textbox', { name: /description/i }).fill('Test asset description');
        await page.locator('#asset-add-terms-check').click();
        await page.locator('#asset-add-allow-scan-check').click();
        await page.locator('#asset-add-authority-check').click();
        await page.getByRole('button', { name: 'Add Asset' }).click();


        await page.getByRole('checkbox', { name: 'select all assets' }).click();
        await page.waitForTimeout(1000);


        await page.locator('.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeMedium.css-mw9dnl').click();
        await page.getByRole('button', { name: '8.8.8.8' }).locator('.MuiChip-deleteIcon').click();
        await page.getByRole('button', { name: '8.8.8.9' }).locator('.MuiChip-deleteIcon').click();



        await page.waitForTimeout(2000);

        await expect(page.getByRole('heading', { name: '2' }).nth(2)).toBeVisible();
        await expect(page.getByText('8.8.8.8')).toBeVisible();
        await expect(page.getByText('8.8.8.9')).toBeVisible();







    });



});
