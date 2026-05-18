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
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%); 
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
        .button-container {
            text-align: center;
            margin: 35px 0;
        }
        .button { 
            display: inline-block; 
            padding: 16px 40px; 
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white !important; 
            text-decoration: none; 
            border-radius: 12px;
            font-weight: 700;
            font-size: 16px;
            box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);
            transition: all 0.3s;
        }
        .button:hover {
            box-shadow: 0 6px 12px rgba(16, 185, 129, 0.4);
            transform: translateY(-2px);
        }
        .link-box {
            background: #f9fafb;
            border: 2px dashed #d1d5db;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            word-break: break-all;
        }
        .link-box p {
            margin: 0;
            font-size: 13px;
            color: #6b7280;
            font-family: 'Courier New', monospace;
        }
        .warning-box {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-left: 4px solid #f59e0b;
            padding: 20px;
            margin: 25px 0;
            border-radius: 8px;
        }
        .warning-box strong {
            color: #92400e;
            font-size: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .warning-box ul {
            margin: 12px 0 0 0;
            padding-left: 20px;
        }
        .warning-box li {
            color: #78350f;
            font-size: 14px;
            margin: 6px 0;
        }
        .info-box {
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
            border-left: 4px solid #3b82f6;
            padding: 20px;
            margin: 25px 0;
            border-radius: 8px;
        }
        .info-box strong {
            color: #1e40af;
            font-size: 15px;
        }
        .info-box p {
            margin: 8px 0 0 0;
            color: #1e3a8a;
            font-size: 14px;
        }
        .security-features {
            margin: 30px 0;
            padding: 25px;
            background: #f9fafb;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
        }
        .security-features h3 {
            margin: 0 0 20px 0;
            font-size: 16px;
            color: #111827;
            font-weight: 700;
        }
        .security-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 14px;
        }
        .security-item:last-child {
            margin-bottom: 0;
        }
        .security-icon {
            width: 24px;
            height: 24px;
            background: #10b981;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 700;
            font-size: 12px;
            margin-right: 12px;
            flex-shrink: 0;
        }
        .security-text {
            font-size: 14px;
            color: #374151;
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
            <h1>🔐 Password Reset Request</h1>
            <p>Secure password recovery for your MediMoms account</p>
        </div>
        
        <div class="content">
            <p class="greeting">Hello,</p>
            
            <p style="font-size: 15px; color: #374151; margin-bottom: 20px;">
                We received a request to reset the password for your <strong>MediMoms</strong> account. If you made this request, click the button below to create a new password.
            </p>

            <div class="info-box">
                <strong>📌 Reset Request Details</strong>
                <p><strong>Requested:</strong> {{ now()->format('F d, Y \a\t h:i A') }}</p>
                <p><strong>Email:</strong> {{ $email }}</p>
                <p><strong>Expires:</strong> {{ now()->addMinutes(60)->format('F d, Y \a\t h:i A') }} (60 minutes)</p>
            </div>
            
            <div class="button-container">
                <a href="{{ config('app.frontend_url') }}/reset-password?token={{ $token }}&email={{ $email }}" class="button">
                    🔑 Reset My Password
                </a>
            </div>

            <p style="text-align: center; font-size: 13px; color: #6b7280; margin: 15px 0;">
                Or copy and paste this link into your browser:
            </p>
            
            <div class="link-box">
                <p>{{ config('app.frontend_url') }}/reset-password?token={{ $token }}&email={{ $email }}</p>
            </div>

            <div class="security-features">
                <h3>🔒 Security Features</h3>
                <div class="security-item">
                    <div class="security-icon">✓</div>
                    <div class="security-text"><strong>Time-Limited:</strong> This link expires in 60 minutes for your security</div>
                </div>
                <div class="security-item">
                    <div class="security-icon">✓</div>
                    <div class="security-text"><strong>One-Time Use:</strong> Link becomes invalid after password reset</div>
                </div>
                <div class="security-item">
                    <div class="security-icon">✓</div>
                    <div class="security-text"><strong>Encrypted:</strong> All password reset requests are securely encrypted</div>
                </div>
                <div class="security-item">
                    <div class="security-icon">✓</div>
                    <div class="security-text"><strong>Logged:</strong> This activity is recorded for security monitoring</div>
                </div>
            </div>
            
            <div class="warning-box">
                <strong>⚠️ Security Alert - Important Information</strong>
                <ul>
                    <li><strong>Didn't request this?</strong> If you didn't request a password reset, please ignore this email and your password will remain unchanged.</li>
                    <li><strong>Suspicious activity?</strong> If you believe someone else is trying to access your account, contact Santa Cruz RHU immediately.</li>
                    <li><strong>Link expired?</strong> You can request a new password reset link anytime from the login page.</li>
                    <li><strong>Keep it secure:</strong> Never share this reset link with anyone, including MediMoms staff.</li>
                </ul>
            </div>

            <p style="font-size: 14px; color: #6b7280; margin-top: 30px; padding: 15px; background: #f9fafb; border-radius: 8px;">
                <strong style="color: #374151;">📞 Need Help?</strong><br>
                If you're having trouble resetting your password or have security concerns, please contact:<br>
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
                This is an automated security message, please do not reply to this email.
            </p>
        </div>
    </div>
</body>
</html>
