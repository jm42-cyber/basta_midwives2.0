# Email System Setup Guide

## Overview
The MediMoms system now includes a complete email notification system for:
- Registration confirmation (pending approval)
- Password reset requests
- Email verification
- Password change notifications
- Email change notifications

## Email Configuration

### 1. Gmail Setup (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

3. **Update .env file**:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-16-char-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="MediMoms"
FRONTEND_URL=http://localhost:5173
```

### 2. Alternative: Mailtrap (Testing)

For testing without sending real emails:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-mailtrap-username
MAIL_PASSWORD=your-mailtrap-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@medimoms.com
MAIL_FROM_NAME="MediMoms"
```

### 3. Production: AWS SES, SendGrid, Mailgun

Update accordingly based on your provider.

## Database Migration

Run the password reset tokens migration:

```bash
php artisan migrate
```

This creates the `password_reset_tokens` table.

## Email Templates

All email templates are located in:
```
backend/resources/views/emails/
```

Templates:
- `registration-pending.blade.php` - Sent after registration
- `password-reset.blade.php` - Forgot password email
- `email-verification.blade.php` - Email verification
- `password-changed.blade.php` - Password change notification
- `email-changed.blade.php` - Email change notification

## API Endpoints

### Public Endpoints

**Forgot Password**
```
POST /api/forgot-password
Body: { "email": "user@example.com" }
```

**Reset Password**
```
POST /api/reset-password
Body: {
  "email": "user@example.com",
  "token": "reset-token",
  "password": "newpassword",
  "password_confirmation": "newpassword"
}
```

### Protected Endpoints

**Update User** (sends email change notification)
```
PUT /api/users/{id}
Body: { "email": "newemail@example.com" }
```

**Change Password** (sends password changed notification)
```
PUT /api/users/{id}
Body: { "password": "newpassword" }
```

## Testing Emails

### Test Registration Email
```bash
php artisan tinker
```
```php
$user = App\Models\User::first();
Mail::to($user->email)->send(new App\Mail\RegistrationPendingMail($user));
```

### Test Password Reset Email
```php
Mail::to('test@example.com')->send(new App\Mail\PasswordResetMail('test-token', 'test@example.com'));
```

## Email Features

### 1. Registration Confirmation
- Sent automatically after successful registration
- Informs user their account is pending approval
- Includes account details

### 2. Password Reset
- User requests password reset via email
- Receives link with token (expires in 60 minutes)
- After reset, receives confirmation email

### 3. Email Verification
- Can be implemented for additional security
- Verifies user owns the email address

### 4. Password Changed Notification
- Sent when password is updated
- Security alert if user didn't make the change

### 5. Email Changed Notification
- Sent to OLD email address
- Notifies user of email change
- Security measure to prevent unauthorized changes

## Troubleshooting

### Emails not sending?

1. Check `.env` configuration
2. Verify Gmail app password is correct
3. Check Laravel logs: `storage/logs/laravel.log`
4. Test mail configuration:
```bash
php artisan tinker
Mail::raw('Test email', function($msg) {
    $msg->to('test@example.com')->subject('Test');
});
```

### Gmail blocking emails?

- Ensure 2FA is enabled
- Use App Password, not regular password
- Check "Less secure app access" is OFF (use App Password instead)

## Security Notes

- Password reset tokens expire after 60 minutes
- Tokens are hashed in database
- Email change notifications sent to old email
- Password change notifications sent immediately
- All emails use professional templates with branding

## Customization

To customize email templates, edit files in:
```
backend/resources/views/emails/
```

To change email styling, modify the inline CSS in each template.

## Production Checklist

- [ ] Update `MAIL_FROM_ADDRESS` to company email
- [ ] Update `MAIL_FROM_NAME` to company name
- [ ] Update `FRONTEND_URL` to production URL
- [ ] Use production mail service (AWS SES, SendGrid, etc.)
- [ ] Test all email flows
- [ ] Set up email monitoring/logging
- [ ] Configure SPF/DKIM records for domain
