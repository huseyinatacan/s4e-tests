# S4E Asset Manager — Playwright Tests

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Log in manually (saves session for Cloudflare bypass):
   ```bash
   node login.js
   ```

3. Run tests:
   ```bash
   npx playwright test --project=chromium --workers=1
   ```

---

## Test Cases

### Adding Assets

1. Add Asset with Normal Input:
   - **Pass:** "Asset Verification" dialog is visible after submitting the asset.
2. Add Asset with Same Domain:
   - **Pass:** System warns the user when a duplicate domain is submitted (a "Back" button appears instead of proceeding).
3. Add Asset with Same Domain (case-insensitive):
   - **Pass:** System warns the user when a duplicate domain is submitted (a "Back" button appears instead of proceeding).
4. Add Asset with Normal IP:
   - **Pass:** "Asset Verification" dialog is visible after submitting the asset.
5. Add Asset with Not So Random Integer:
   - **Fail:** System silently converts integers to IP addresses (e.g. `134744072.` → `8.8.8.8`, `1` → `0.0.0.1`) without warning the user.
6. Try to Add Asset with Missing IP an Octet:
   - **Fail:** System silently converts `8.8.8` to `8.8.0.8` without warning the user.
7. Try to Add Asset with Missing IP two octet:
   - **Fail:** System silently converts `8.8.` to `8.0.0.8` without warning the user.
8. Try to Add Asset with Invalid IP (contain negative value):
   - **Pass:** System warns the user that it is not a valid IP address.
9. Try to Add Asset with Invalid IP (contains value bigger than 255):
   - **Pass:** System warns the user that it is not a valid IP address.
10. Try to Add Asset with description longer than 300 characters:
    - **Pass:** The description is cut to 300 characters.
11. Try to add asset with empty description:
   - **Fail:** System does not disable the "Add Asset" button when the description is empty.
12. Try to Add Asset with description shorter than 3 characters:
    - **Pass:** System disables the "Add Asset" button when the description is shorter than 3 characters.
13. Try to Add Asset with description exactly 3 characters long:
    - **Pass:** System does not disable the "Add Asset" button when the description is exactly 3 characters long.
14. Try to Add Asset with description exactly 300 characters long:
    - **Pass:** System does not disable the "Add Asset" button when the description is exactly 300 characters long.
15. Try to Add Asset with Invalid IPv6 (contains letter other than a-f):
    - **Pass:** System warns the user that it is not a valid IP address.

### Adding Multiple Assets

16. Add Multiple Assets with Normal Input
    - **Pass:** The system successfully adds multiple assets.
17. Add Multiple Assets with Same Domain
    - **Fail:** The system silently adds only unique assets without warning the user about duplicates.
18. Add Multiple Assets with Same Domain with Uppercase Letters
    - **Pass:** The system warns the user that duplicate assets are not allowed.

### CIDR Notation

19. Add Multiple Assets using CIDR Notation
    - **Pass:** The system successfully adds multiple assets using CIDR notation.
20. Add Multiple Assets using CIDR Notation (negative number)
    - **Fail:** The system silently adds `8.8.8.8` instead of warning the user that `8.8.8.8/-1` is an invalid CIDR notation.
21. Add Multiple Assets using CIDR Notation (large number)
    - **Fail:** The system silently adds `8.8.8.8` instead of warning the user that `8.8.8.8/999` is an invalid CIDR notation.
22. Add Normal IP first then Multiple Assets using CIDR Notation
    - **Fail:** After adding `8.8.8.8`, the system warns about duplicates when adding `8.8.8.8/24` and offers an "Add" button to proceed, but clicking it does nothing.

### Deleting Assets

23. Delete One Asset
    - **Pass:** The system successfully deletes one asset.
24. Delete 10 Assets using Select All
    - **Pass:** The system successfully deletes 10 assets.
25. Delete 25 Assets using Select All
    - **Pass:** The system successfully deletes 25 assets.
26. Delete 50 Assets using Select All
    - **Pass:** The system successfully deletes 50 assets.
27. Delete 100 Assets using Select All
    - **Fail:** The system only deletes 50 assets instead of 100.
28. Remove One Asset from Selection
    - **Pass:** The system successfully removes one asset from the selection.
29. Remove All Assets from Selection
    - **Pass:** The system successfully removes all assets from the selection.
