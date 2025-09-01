# IntaSend M-Pesa Integration Setup Guide

## Overview
This guide will help you set up IntaSend M-Pesa payment integration for your EduBridge tutoring platform.

## Prerequisites
1. IntaSend account (sign up at https://intasend.com)
2. Kenyan M-Pesa account
3. Valid business registration (for production)

## Step 1: IntaSend Account Setup

### 1.1 Create IntaSend Account
1. Go to https://intasend.com
2. Click "Sign Up" and create your account
3. Verify your email address

### 1.2 Complete Business Verification
1. Log in to your IntaSend dashboard
2. Go to "Settings" > "Business Profile"
3. Fill in your business details:
   - Business name: "EduBridge Tutoring"
   - Business type: "Education Services"
   - Registration number (if applicable)
   - Physical address
   - Contact information

### 1.3 Get API Keys
1. Go to "Settings" > "API Keys"
2. Copy your:
   - **Publishable Key** (starts with `ISPubKey_`)
   - **Secret Key** (starts with `ISSecretKey_`)

## Step 2: Configure Your Application

### 2.1 Update Environment Variables
Create a `.env` file in your project root:

```env
# IntaSend Configuration
INTASEND_PUBLISHABLE_KEY=ISPubKey_test_your_publishable_key_here
INTASEND_SECRET_KEY=ISSecretKey_test_your_secret_key_here
INTASEND_API_URL=https://sandbox.intasend.com

# For Production (change when going live)
# INTASEND_API_URL=https://api.intasend.com
```

### 2.2 Update app.py Configuration
Replace the placeholder keys in `app.py`:

```python
# IntaSend API configuration
INTASEND_PUBLISHABLE_KEY = os.getenv('INTASEND_PUBLISHABLE_KEY', 'ISPubKey_test_...')
INTASEND_SECRET_KEY = os.getenv('INTASEND_SECRET_KEY', 'ISSecretKey_test_...')
INTASEND_API_URL = os.getenv('INTASEND_API_URL', 'https://sandbox.intasend.com')
```

## Step 3: Testing Environment

### 3.1 Sandbox Testing
IntaSend provides a sandbox environment for testing:

**Test M-Pesa Numbers:**
- 254700000000 (Safaricom)
- 254711000000 (Airtel)
- 254733000000 (Telkom)

**Test Card Numbers:**
- 4000000000000002 (Visa)
- 5555555555554444 (Mastercard)

### 3.2 Test Payment Flow
1. Start your Flask application
2. Log in as a student
3. Search for a tutor
4. Click "Book Session"
5. Select M-Pesa as payment method
6. Complete the payment using test credentials

### 3.3 Webhook Testing
For local testing, use ngrok to expose your webhook endpoint:

```bash
# Install ngrok
npm install -g ngrok

# Expose your local server
ngrok http 5000

# Use the ngrok URL in IntaSend webhook settings
# Example: https://abc123.ngrok.io/api/payments/webhook
```

## Step 4: Production Setup

### 4.1 Switch to Production API
1. Update your `.env` file:
```env
INTASEND_API_URL=https://api.intasend.com
```

2. Update your IntaSend configuration in the dashboard:
   - Go to "Settings" > "API Keys"
   - Switch to "Live" mode
   - Get your production API keys

### 4.2 Configure Webhooks
1. In IntaSend dashboard, go to "Settings" > "Webhooks"
2. Add your webhook URL: `https://yourdomain.com/api/payments/webhook`
3. Select events:
   - `invoice.completed`
   - `invoice.failed`
   - `invoice.cancelled`

### 4.3 Security Considerations
1. **Webhook Verification**: Implement signature verification
2. **HTTPS**: Ensure your domain uses SSL
3. **Environment Variables**: Never commit API keys to version control
4. **Rate Limiting**: Implement rate limiting for payment endpoints

## Step 5: M-Pesa Specific Configuration

### 5.1 M-Pesa Business Account
1. Register for M-Pesa Business Account
2. Get your M-Pesa Business Number
3. Configure M-Pesa API credentials

### 5.2 IntaSend M-Pesa Settings
1. In IntaSend dashboard, go to "Settings" > "Payment Methods"
2. Enable M-Pesa
3. Configure your M-Pesa business details

## Step 6: Deployment

### 6.1 Environment Setup
```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export INTASEND_PUBLISHABLE_KEY="your_production_key"
export INTASEND_SECRET_KEY="your_production_secret"
export INTASEND_API_URL="https://api.intasend.com"

# Run database migrations
python setup_database.py

# Start the application
python app.py
```

### 6.2 Production Server Setup
For production deployment, consider using:
- **Gunicorn** as WSGI server
- **Nginx** as reverse proxy
- **SSL certificate** for HTTPS
- **Process manager** (PM2, Supervisor)

Example Gunicorn configuration:
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## Step 7: Monitoring and Testing

### 7.1 Payment Monitoring
1. Monitor payment success rates
2. Check webhook delivery status
3. Review failed payment logs

### 7.2 Testing Checklist
- [ ] Test M-Pesa payment flow
- [ ] Test card payment flow
- [ ] Verify webhook notifications
- [ ] Test payment status updates
- [ ] Verify session creation after payment
- [ ] Test error handling

## Troubleshooting

### Common Issues

1. **Payment Fails**
   - Check API key configuration
   - Verify account balance
   - Check webhook URL accessibility

2. **Webhook Not Received**
   - Verify webhook URL is accessible
   - Check firewall settings
   - Review webhook logs in IntaSend dashboard

3. **M-Pesa Payment Issues**
   - Verify M-Pesa business account status
   - Check transaction limits
   - Contact IntaSend support

### Support Resources
- IntaSend Documentation: https://docs.intasend.com
- IntaSend Support: support@intasend.com
- M-Pesa Business Support: 100

## Security Best Practices

1. **API Key Management**
   - Rotate keys regularly
   - Use environment variables
   - Never expose keys in client-side code

2. **Webhook Security**
   - Implement signature verification
   - Use HTTPS only
   - Validate webhook payload

3. **Data Protection**
   - Encrypt sensitive data
   - Implement proper logging
   - Regular security audits

## Cost Structure

### IntaSend Fees
- **M-Pesa**: 1.5% + KES 5 per transaction
- **Card Payments**: 2.9% + KES 5 per transaction
- **Bank Transfers**: KES 50 per transaction

### M-Pesa Business Fees
- **Registration**: KES 1,000 (one-time)
- **Monthly Fee**: KES 100
- **Transaction Fee**: Varies by amount

## Next Steps

1. **Go Live**: Switch to production API
2. **Monitor**: Set up monitoring and alerts
3. **Optimize**: Analyze payment patterns
4. **Scale**: Add more payment methods as needed

---

**Note**: This integration supports both M-Pesa and card payments. M-Pesa is the primary payment method for Kenyan users, while card payments provide international accessibility.
