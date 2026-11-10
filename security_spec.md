# Security Specification — Mars Infratechniek B.V.

## 1. Data Invariants
1. **Default-Deny Catch-All**: No document in the database is readable or writable unless explicitly permitted by a collection rule.
2. **Administrator Verification (`isAdmin`)**: Admin privileges are granted only when `request.auth != null` AND either `exists(/databases/$(database)/documents/admins/$(request.auth.uid))` OR (`request.auth.token.email == "goldencrafteu@gmail.com"` AND `request.auth.token.email_verified == true`).
3. **Vacancies (`/vacancies/{vacancyId}`)**:
   - Public visitors can only `get` or `list` vacancies where `resource.data.status == 'open'`. Administrators can read all vacancies.
   - Only verified administrators (`isAdmin()`) can `create`, `update`, or `delete` vacancies.
   - `authorId` must equal `request.auth.uid` on creation and remain immutable on update.
   - `createdAt` must equal `request.time` on creation and remain immutable on update. `updatedAt` must equal `request.time`.
4. **Job Applications (`/applications/{applicationId}`) — PII Isolation**:
   - Contains candidate PII (`applicantName`, `applicantEmail`, `applicantPhone`, `cvDataUrl`).
   - Anyone can `create` a strictly validated job application with `status == 'new'` and `createdAt == request.time`.
   - Zero public or non-admin reads: Only `isAdmin()` can `get`, `list`, `update`, or `delete` applications.
5. **Contact Inquiries (`/inquiries/{inquiryId}`) — PII Isolation**:
   - Contains visitor PII (`name`, `email`, `phone`, `message`).
   - Anyone can `create` a strictly validated contact inquiry with `status == 'new'` and `createdAt == request.time`.
   - Zero public or non-admin reads: Only `isAdmin()` can `get`, `list`, `update`, or `delete` inquiries.
6. **Mail Configuration (`/settings/{settingId}`)**:
   - Contains SMTP credentials and forwarding rules (`settingId == 'mailConfig'`).
   - Strictly restricted to `isAdmin()` for `get`, `create`, and `update`. No `list` or `delete` allowed.

## 2. The "Dirty Dozen" Payloads
1. **Unverified Admin Email Spoof**: Attempting to create a vacancy with `email: "goldencrafteu@gmail.com"` and `email_verified: false`. -> `PERMISSION_DENIED`
2. **Shadow Field Injection on Vacancy**: Creating a vacancy with an unauthorized field `isFeatured: true`. -> `PERMISSION_DENIED`
3. **Author Spoofing on Vacancy**: Admin creating a vacancy where `authorId != request.auth.uid`. -> `PERMISSION_DENIED`
4. **Immutable Field Mutation on Vacancy Update**: Modifying `createdAt` or `authorId` during a vacancy update. -> `PERMISSION_DENIED`
5. **Public Scrape of Closed Vacancies**: Anonymous user attempting to `get` or `list` a vacancy where `status == 'closed'`. -> `PERMISSION_DENIED`
6. **PII Leak on Job Applications**: Authenticated non-admin user attempting to `get` or `list` `/applications/{applicationId}`. -> `PERMISSION_DENIED`
7. **Status Shortcutting on Job Application Create**: Candidate submitting a job application with `status: 'invited'` instead of `'new'`. -> `PERMISSION_DENIED`
8. **Denial-of-Wallet Oversized CV Payload**: Candidate submitting `cvDataUrl` exceeding 750,000 characters or `motivation` exceeding 3,000 characters. -> `PERMISSION_DENIED`
9. **ID Poisoning Attack**: Creating `/inquiries/{inquiryId}` with special characters or >128 chars in `inquiryId`. -> `PERMISSION_DENIED`
10. **PII Leak on Contact Inquiries**: Non-admin user attempting to `get` `/inquiries/{inquiryId}`. -> `PERMISSION_DENIED`
11. **Forged Timestamp on Inquiry Create**: Submitting `createdAt` different from `request.time`. -> `PERMISSION_DENIED`
12. **Unauthorized SMTP Credential Read**: Non-admin user attempting to `get` `/settings/mailConfig`. -> `PERMISSION_DENIED`
