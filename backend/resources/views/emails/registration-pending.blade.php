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
        .info-box {
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            border-left: 4px solid #10b981;
            padding: 20px;
            margin: 25px 0;
            border-radius: 8px;
        }
        .info-box h3 {
            margin: 0 0 12px 0;
            font-size: 16px;
            color: #065f46;
            font-weight: 700;
        }
        .info-row {
            display: flex;
            padding: 8px 0;
            border-bottom: 1px solid #d1fae5;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-label {
            font-weight: 600;
            color: #047857;
            min-width: 120px;
        }
        .info-value {
            color: #065f46;
        }
        .status-badge {
            display: inline-block;
            background: #fef3c7;
            color: #92400e;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .timeline {
            margin: 30px 0;
            padding: 25px;
            background: #f9fafb;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
        }
        .timeline h3 {
            margin: 0 0 20px 0;
            font-size: 16px;
            color: #111827;
            font-weight: 700;
        }
        .timeline-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 16px;
            padding-bottom: 16px;
            border-bottom: 1px dashed #d1d5db;
        }
        .timeline-item:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }
        .timeline-icon {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #10b981, #14b8a6);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 700;
            font-size: 14px;
            margin-right: 15px;
            flex-shrink: 0;
        }
        .timeline-content h4 {
            margin: 0 0 4px 0;
            font-size: 14px;
            color: #111827;
            font-weight: 600;
        }
        .timeline-content p {
            margin: 0;
            font-size: 13px;
            color: #6b7280;
        }
        .alert-box {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 20px;
            margin: 25px 0;
            border-radius: 8px;
        }
        .alert-box strong {
            color: #92400e;
            font-size: 15px;
        }
        .alert-box p {
            margin: 8px 0 0 0;
            color: #78350f;
            font-size: 14px;
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
            <h1>🎉 Welcome to MediMoms!</h1>
            <p>Your registration has been received successfully</p>
        </div>
        
        <div class="content">
            <p class="greeting">Hello {{ $user->first_name }} {{ $user->last_name }},</p>
            
            <p style="font-size: 15px; color: #374151; margin-bottom: 20px;">
                Thank you for registering with <strong>MediMoms</strong> - Santa Cruz Rural Health Unit's Maternal and Child Health Management System. We're excited to have you join our healthcare team!
            </p>
            
            <div class="info-box">
                <h3>📋 Your Account Details</h3>
                <div class="info-row">
                    <span class="info-label">Full Name:</span>
                    <span class="info-value">{{ $user->first_name }} {{ $user->middle_name }} {{ $user->last_name }}</span>
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
                    <span class="info-label">Contact Number:</span>
                    <span class="info-value">{{ $user->contact_number }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Account Status:</span>
                    <span class="info-value"><span class="status-badge">⏳ Pending Approval</span></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Registered On:</span>
                    <span class="info-value">{{ $user->created_at->format('F d, Y \a\t h:i A') }}</span>
                </div>
            </div>

            <div class="timeline">
                <h3>📍 What Happens Next?</h3>
                <div class="timeline-item">
                    <div class="timeline-icon">1</div>
                    <div class="timeline-content">
                        <h4>Account Review</h4>
                        <p>Our administrator will review your registration details and verify your credentials.</p>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-icon">2</div>
                    <div class="timeline-content">
                        <h4>Approval Notification</h4>
                        <p>You'll receive an email notification once your account has been approved (typically within 24-48 hours).</p>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-icon">3</div>
                    <div class="timeline-content">
                        <h4>Start Using MediMoms</h4>
                        <p>After approval, you can log in and start managing maternal and child health records.</p>
                    </div>
                </div>
            </div>

            <div class="alert-box">
                <strong>⚠️ Important Reminders</strong>
                <p>• Keep your login credentials secure and do not share them with anyone</p>
                <p>• You will not be able to log in until your account is approved by the administrator</p>
                <p>• If you don't receive approval within 48 hours, please contact Santa Cruz RHU</p>
                <p>• Make sure to check your spam/junk folder for future emails from us</p>
            </div>

            <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                If you have any questions or concerns about your registration, please don't hesitate to contact our support team or visit Santa Cruz Rural Health Unit.
            </p>

            <p style="font-size: 15px; color: #374151; margin-top: 25px;">
                Best regards,<br>
                <strong style="color: #10b981;">MediMoms Team</strong><br>
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
                <a href="#">Privacy Policy</a>
            </div>
            <p style="font-size: 12px; color: #9ca3af; margin-top: 20px;">
                © {{ date('Y') }} MediMoms. All rights reserved.<br>
                This is an automated message, please do not reply to this email.
            </p>
        </div>
    </div>
</body>
</html>
