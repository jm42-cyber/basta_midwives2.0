<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #1f2937; 
            background-color: #f3f4f6;
            margin: 0;
            padding: 0;
        }
        .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header { 
            background: linear-gradient(135deg, #10b981 0%, #059669 50%, #14b8a6 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.5px;
        }
        .header p {
            margin: 10px 0 0 0;
            font-size: 14px;
            opacity: 0.95;
        }
        .content { 
            background: #ffffff; 
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 20px;
        }
        .success-box {
            background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
            border-left: 4px solid #10b981;
            padding: 25px;
            margin: 25px 0;
            border-radius: 8px;
            text-align: center;
        }
        .success-box .icon {
            font-size: 48px;
            margin-bottom: 10px;
        }
        .success-box h3 {
            margin: 0 0 8px 0;
            font-size: 20px;
            color: #065f46;
            font-weight: 700;
        }
        .success-box p {
            margin: 0;
            color: #047857;
            font-size: 14px;
        }
        .info-box {
            background: #f9fafb;
            border: 2px solid #e5e7eb;
            padding: 20px;
            margin: 25px 0;
            border-radius: 8px;
        }
        .info-box h3 {
            margin: 0 0 15px 0;
            font-size: 16px;
            color: #111827;
            font-weight: 700;
        }
        .info-row {
            display: flex;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-label {
            font-weight: 600;
            color: #6b7280;
            min-width: 140px;
        }
        .info-value {
            color: #111827;
            font-weight: 600;
        }
        .warning-box {
            background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
            border-left: 4px solid #ef4444;
            padding: 20px;
            margin: 25px 0;
            border-radius: 8px;
        }
        .warning-box strong {
            color: #991b1b;
            font-size: 15px;
            display: block;
            margin-bottom: 10px;
        }
        .warning-box p {
            margin: 8px 0;
            color: #b91c1c;
            font-size: 14px;
        }
        .tips-box {
            margin: 30px 0;
            padding: 25px;
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
            border-radius: 12px;
            border: 1px solid #93c5fd;
        }
        .tips-box h3 {
            margin: 0 0 15px 0;
            font-size: 16px;
            color: #1e40af;
            font-weight: 700;
        }
        .tip-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 12px;
        }
        .tip-item:last-child {
            margin-bottom: 0;
        }
        .tip-icon {
            width: 20px;
            height: 20px;
            background: #3b82f6;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 700;
            font-size: 11px;
            margin-right: 10px;
            flex-shrink: 0;
            margin-top: 2px;
        }
        .tip-text {
            font-size: 14px;
            color: #1e3a8a;
        }
        .footer { 
            background: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer-links {
            margin: 20px 0;
        }
        .footer-links a {
            color: #10b981;
            text-decoration: none;
            margin: 0 10px;
            font-size: 13px;
            font-weight: 600;
        }
        .footer p {
            margin: 8px 0;
            color: #6b7280;
            font-size: 13px;
        }
        .footer-logo {
            font-size: 20px;
            font-weight: 700;
            color: #10b981;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="header">
            <h1>✅ Password Changed Successfully</h1>
            <p>Your account security has been updated</p>
        </div>
        
        <div class="content">
            <p class="greeting">Hello {{ $user->first_name }} {{ $user->last_name }},</p>
            
            <div class="success-box">
                <div class="icon">🔒</div>
                <h3>Password Updated!</h3>
                <p>Your MediMoms account password has been successfully changed</p>
            </div>
            
            <p style="font-size: 15px; color: #374151; margin-bottom: 20px;">
                This email confirms that the password for your <strong>MediMoms</strong> account was successfully changed. You can now use your new password to log in to the system.
            </p>

            <div class="info-box">
                <h3>📌 Change Details</h3>
                <div class="info-row">
                    <span class="info-label">Account Name:</span>
                    <span class="info-value">{{ $user->first_name }} {{ $user->last_name }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Username:</span>
                    <span class="info-value">{{ $user->username }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Email Address:</span>
                    <span class="info-value">{{ $user->email }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Changed On:</span>
                    <span class="info-value">{{ now()->format('F d, Y \a\t h:i A') }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Change Method:</span>
                    <span class="info-value">Password Reset Request</span>
                </div>
            </div>

            <div class="tips-box">
                <h3>🛡️ Security Best Practices</h3>
                <div class="tip-item">
                    <div class="tip-icon">✓</div>
                    <div class="tip-text"><strong>Use a strong password:</strong> Combine uppercase, lowercase, numbers, and special characters</div>
                </div>
                <div class="tip-item">
                    <div class="tip-icon">✓</div>
                    <div class="tip-text"><strong>Keep it unique:</strong> Don't reuse passwords from other websites or services</div>
                </div>
                <div class="tip-item">
                    <div class="tip-icon">✓</div>
                    <div class="tip-text"><strong>Store securely:</strong> Use a password manager to safely store your credentials</div>
                </div>
                <div class="tip-item">
                    <div class="tip-icon">✓</div>
                    <div class="tip-text"><strong>Never share:</strong> MediMoms staff will never ask for your password</div>
                </div>
                <div class="tip-item">
                    <div class="tip-icon">✓</div>
                    <div class="tip-text"><strong>Regular updates:</strong> Change your password periodically for better security</div>
                </div>
            </div>
            
            <div class="warning-box">
                <strong>⚠️ Didn't Make This Change?</strong>
                <p><strong>If you did NOT change your password:</strong></p>
                <p>• Your account may have been compromised</p>
                <p>• Contact Santa Cruz RHU immediately at support@medimoms.com</p>
                <p>• Change your password again as soon as possible</p>
                <p>• Review your recent account activity for any suspicious actions</p>
            </div>

            <p style="font-size: 14px; color: #6b7280; margin-top: 30px; padding: 15px; background: #f9fafb; border-radius: 8px;">
                <strong style="color: #374151;">📞 Need Assistance?</strong><br>
                If you have questions about your account security or need help, please contact:<br>
                <strong>Santa Cruz Rural Health Unit</strong><br>
                Email: support@medimoms.com | Phone: (049) XXX-XXXX
            </p>

            <p style="font-size: 15px; color: #374151; margin-top: 25px;">
                Best regards,<br>
                <strong style="color: #10b981;">MediMoms Security Team</strong><br>
                <span style="font-size: 13px; color: #6b7280;">Santa Cruz Rural Health Unit</span>
            </p>
        </div>
        
        <div class="footer">
            <div class="footer-logo">MediMoms</div>
            <p>Maternal and Child Health Management System</p>
            <p>Santa Cruz Rural Health Unit, Laguna, Philippines</p>
            <div class="footer-links">
                <a href="#">Help Center</a> • 
                <a href="#">Contact Support</a> • 
                <a href="#">Security</a>
            </div>
            <p style="font-size: 12px; color: #9ca3af; margin-top: 20px;">
                © {{ date('Y') }} MediMoms. All rights reserved.<br>
                This is an automated security notification, please do not reply to this email.
            </p>
        </div>
    </div>
</body>
</html>
