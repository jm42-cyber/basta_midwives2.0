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
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%); 
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
        .change-box {
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
            border-left: 4px solid #3b82f6;
            padding: 25px;
            margin: 25px 0;
            border-radius: 8px;
        }
        .change-box h3 {
            margin: 0 0 15px 0;
            font-size: 18px;
            color: #1e40af;
            font-weight: 700;
        }
        .change-row {
            display: flex;
            align-items: center;
            margin: 12px 0;
            padding: 12px;
            background: white;
            border-radius: 6px;
        }
        .change-icon {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            margin-right: 15px;
            flex-shrink: 0;
        }
        .old-email-icon {
            background: #fee2e2;
        }
        .new-email-icon {
            background: #d1fae5;
        }
        .change-content {
            flex: 1;
        }
        .change-label {
            font-size: 12px;
            color: #6b7280;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .change-value {
            font-size: 15px;
            color: #111827;
            font-weight: 600;
            margin-top: 2px;
        }
        .arrow-icon {
            text-align: center;
            font-size: 24px;
            color: #3b82f6;
            margin: 10px 0;
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
        .important-box {
            margin: 30px 0;
            padding: 25px;
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-radius: 12px;
            border: 1px solid #fbbf24;
        }
        .important-box h3 {
            margin: 0 0 15px 0;
            font-size: 16px;
            color: #92400e;
            font-weight: 700;
        }
        .important-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 12px;
        }
        .important-item:last-child {
            margin-bottom: 0;
        }
        .important-icon {
            width: 20px;
            height: 20px;
            background: #f59e0b;
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
        .important-text {
            font-size: 14px;
            color: #78350f;
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
        .sent-to {
            background: #f3f4f6;
            padding: 12px;
            border-radius: 6px;
            margin-top: 15px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="header">
            <h1>📧 Email Address Changed</h1>
            <p>Important security notification for your MediMoms account</p>
        </div>
        
        <div class="content">
            <p class="greeting">Hello {{ $user->first_name }} {{ $user->last_name }},</p>
            
            <p style="font-size: 15px; color: #374151; margin-bottom: 20px;">
                This is an important security notification to inform you that the email address associated with your <strong>MediMoms</strong> account has been changed.
            </p>

            <div class="change-box">
                <h3>🔄 Email Change Summary</h3>
                
                <div class="change-row">
                    <div class="change-icon old-email-icon">❌</div>
                    <div class="change-content">
                        <div class="change-label">Previous Email</div>
                        <div class="change-value">{{ $oldEmail }}</div>
                    </div>
                </div>

                <div class="arrow-icon">↓</div>

                <div class="change-row">
                    <div class="change-icon new-email-icon">✅</div>
                    <div class="change-content">
                        <div class="change-label">New Email</div>
                        <div class="change-value">{{ $newEmail }}</div>
                    </div>
                </div>
            </div>

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
                    <span class="info-label">Changed On:</span>
                    <span class="info-value">{{ now()->format('F d, Y \a\t h:i A') }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Change Method:</span>
                    <span class="info-value">Account Settings Update</span>
                </div>
            </div>

            <div class="important-box">
                <h3>🚨 What This Means For You</h3>
                <div class="important-item">
                    <div class="important-icon">!</div>
                    <div class="important-text"><strong>All future communications</strong> will be sent to your new email address: <strong>{{ $newEmail }}</strong></div>
                </div>
                <div class="important-item">
                    <div class="important-icon">!</div>
                    <div class="important-text"><strong>Login credentials</strong> remain the same - only your email address has changed</div>
                </div>
                <div class="important-item">
                    <div class="important-icon">!</div>
                    <div class="important-text"><strong>This notification</strong> was sent to your old email as a security measure</div>
                </div>
                <div class="important-item">
                    <div class="important-icon">!</div>
                    <div class="important-text"><strong>Password reset requests</strong> will now be sent to {{ $newEmail }}</div>
                </div>
            </div>
            
            <div class="warning-box">
                <strong>⚠️ Didn't Authorize This Change?</strong>
                <p><strong>If you did NOT make this email change, your account may be compromised:</strong></p>
                <p>• Contact Santa Cruz RHU immediately at support@medimoms.com or (049) XXX-XXXX</p>
                <p>• Try to log in and change your password immediately</p>
                <p>• Review your account activity for any suspicious actions</p>
                <p>• Report this incident to the system administrator</p>
                <p style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #fca5a5;">
                    <strong>Time is critical!</strong> Please act immediately if you didn't authorize this change.
                </p>
            </div>

            <p style="font-size: 14px; color: #6b7280; margin-top: 30px; padding: 15px; background: #f9fafb; border-radius: 8px;">
                <strong style="color: #374151;">📞 Need Assistance?</strong><br>
                If you have questions about this email change or need help securing your account:<br>
                <strong>Santa Cruz Rural Health Unit</strong><br>
                Email: support@medimoms.com | Phone: (049) XXX-XXXX<br>
                Available: Monday-Friday, 8:00 AM - 5:00 PM
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
            <div class="sent-to">
                <p style="margin: 0; font-size: 12px; color: #6b7280;">
                    <strong>This notification was sent to:</strong> {{ $oldEmail }}<br>
                    <span style="font-size: 11px; color: #9ca3af;">Your old email address for security purposes</span>
                </p>
            </div>
            <p style="font-size: 12px; color: #9ca3af; margin-top: 20px;">
                © {{ date('Y') }} MediMoms. All rights reserved.<br>
                This is an automated security notification, please do not reply to this email.
            </p>
        </div>
    </div>
</body>
</html>
