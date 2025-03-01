export const otpVerificationTemplate = (otp, firstName = '') => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Email Verification</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      padding: 0;
      margin: 0;
    }
    .container-sec {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 20px;
      margin: 30px auto;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
      max-width: 600px;
    }
    .otp-code {
      font-size: 24px;
      font-weight: bold;
      background-color: #f8f9fa;
      padding: 15px;
      text-align: center;
      border-radius: 8px;
      border: 1px dashed #007bff;
      color: #007bff;
      margin: 20px 0;
    }
    .btn-verify {
      display: inline-block;
      padding: 10px 20px;
      color: #ffffff;
      background-color: #007bff;
      border-radius: 6px;
      text-decoration: none;
      font-weight: bold;
      margin: 20px 0;
    }
    .footer-text {
      color: #6c757d;
      font-size: 14px;
      text-align: center;
      margin-top: 20px;
    }
    .footer-text a {
      color: #007bff;
      text-decoration: none;
    }
    .otp-lock {
      color: #333;
      font-size: 80px;
      margin: 20px 0;
    }
    .welcome-section {
      background: #144fa9db;
      padding: 30px;
      border-radius: 4px;
      color: #fff;
      font-size: 20px;
      margin: 20px 0px;
    }
    .welcome-text {
      font-family: monospace;
    }
    .app-name {
      font-size: 30px;
      font-weight: 800;
      margin: 7px 0px;
    }
    .verify-text {
      margin-top: 25px;
      font-size: 25px;
      letter-spacing: 3px;
    }
    .email-icon {
      margin-top: 20px;
    }
    i.fas.fa-envelope-open {
      font-size: 35px !important;
      color: #ffffff;
    }
  </style>
</head>
<body>
  <div class="container-sec">
    <div class="text-center">
      <div><i class="fas fa-lock otp-lock"></i></div>
      <div class="welcome-section">
        <div class="app-name">
          JOB SEARCH APP
        </div>
        <div class="welcome-text">
          Thanks for signing up!
        </div>
        <div class="verify-text">
          Please Verify Your Email Address
        </div>
        <div class="email-icon">
          <i class="fas fa-envelope-open"></i>
        </div>
      </div>
      <h2>Hello, ${firstName || 'there'}!</h2>
      <p>Your One-Time Password (OTP) for verification is:</p>
      <div class="otp-code">${otp}</div>
      <p class="mt-4">Please use this OTP to complete your verification. The OTP is valid for the next 10 minutes.</p>
    </div>
    <div class="footer-text">
      <p>If you did not request this OTP, please contact us immediately.</p>
      <p>Thank you,<br>The Job Search Team</p>
    </div>
  </div>
</body>
</html>`;
};

export const forgotPasswordTemplate = (otp, firstName = '') => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Password Reset</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      padding: 0;
      margin: 0;
    }
    .container-sec {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 20px;
      margin: 30px auto;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
      max-width: 600px;
    }
    .otp-code {
      font-size: 24px;
      font-weight: bold;
      background-color: #f8f9fa;
      padding: 15px;
      text-align: center;
      border-radius: 8px;
      border: 1px dashed #007bff;
      color: #007bff;
      margin: 20px 0;
    }
    .btn-verify {
      display: inline-block;
      padding: 10px 20px;
      color: #ffffff;
      background-color: #007bff;
      border-radius: 6px;
      text-decoration: none;
      font-weight: bold;
      margin: 20px 0;
    }
    .footer-text {
      color: #6c757d;
      font-size: 14px;
      text-align: center;
      margin-top: 20px;
    }
    .footer-text a {
      color: #007bff;
      text-decoration: none;
    }
    .otp-lock {
      color: #333;
      font-size: 80px;
      margin: 20px 0;
    }
    .welcome-section {
      background: #144fa9db;
      padding: 30px;
      border-radius: 4px;
      color: #fff;
      font-size: 20px;
      margin: 20px 0px;
    }
    .welcome-text {
      font-family: monospace;
    }
    .app-name {
      font-size: 30px;
      font-weight: 800;
      margin: 7px 0px;
    }
    .verify-text {
      margin-top: 25px;
      font-size: 25px;
      letter-spacing: 3px;
    }
    .email-icon {
      margin-top: 20px;
    }
    i.fas.fa-envelope-open {
      font-size: 35px !important;
      color: #ffffff;
    }
  </style>
</head>
<body>
  <div class="container-sec">
    <div class="text-center">
      <div><i class="fas fa-lock otp-lock"></i></div>
      <div class="welcome-section">
        <div class="app-name">
          JOB SEARCH APP
        </div>
        <div class="welcome-text">
          Password Reset Request
        </div>
        <div class="verify-text">
          Reset Your Password
        </div>
        <div class="email-icon">
          <i class="fas fa-envelope-open"></i>
        </div>
      </div>
      <h2>Hello, ${firstName || 'there'}!</h2>
      <p>Your One-Time Password (OTP) for password reset is:</p>
      <div class="otp-code">${otp}</div>
      <p class="mt-4">Please use this OTP to reset your password. The OTP is valid for the next 10 minutes.</p>
    </div>
    <div class="footer-text">
      <p>If you did not request this password reset, please contact us immediately.</p>
      <p>Thank you,<br>The Job Search Team</p>
    </div>
  </div>
</body>
</html>`;
};
