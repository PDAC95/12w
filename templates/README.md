# Templates Directory

This directory contains HTML email templates and other reusable templates for Wallai.

## Structure

```
templates/
└── email/
    └── supabase_auth_templates.html   # Supabase authentication email templates
```

## Files

### `email/supabase_auth_templates.html`

5 custom-branded HTML email templates for Supabase Authentication:

1. **Confirm Signup** - Welcome email with account verification
2. **Magic Link** - Passwordless login link
3. **Reset Password** - Password reset request
4. **Change Email** - Email address change confirmation
5. **Invite User** - Space invitation (custom template)

**Brand Colors Used:**
- Growth Green: `#4ADE80`
- Trust Teal: `#14B8A6`
- Deep Navy: `#2E4057`

**Usage:**
1. Go to Supabase Dashboard
2. Navigate to **Authentication** → **Email Templates**
3. Select template type (Confirm signup, Magic link, etc.)
4. Copy the corresponding HTML from `supabase_auth_templates.html`
5. Paste into Supabase template editor
6. Save

**Customization:**
- Replace `support@wallai.app` with your actual support email
- Update URLs with your production domain
- Adjust brand colors if needed

## Future Additions

### Planned template types:
- `email/notifications/` - Transactional notification emails
- `email/marketing/` - Marketing campaign templates
- `pdf/` - PDF invoice/receipt templates
- `sms/` - SMS notification templates

---

**Related Documentation:**
- `docs/SUPABASE_SETUP.md` - Step 4: Configure Email Templates
- `docs/Design.md` - Brand colors and design system
