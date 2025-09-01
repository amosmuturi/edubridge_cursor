# Quick Start Guide - IntaSend M-Pesa Integration

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run the Deployment Script
```bash
python deploy_test.py
```

This will:
- ✅ Check all dependencies
- 📝 Create a `.env` file
- 🗄️ Setup the database
- 🚀 Start the development server

### 3. Configure IntaSend (Required)
1. Sign up at https://intasend.com
2. Get your API keys from the dashboard
3. Update the `.env` file with your keys:
```env
INTASEND_PUBLISHABLE_KEY=ISPubKey_test_your_actual_key
INTASEND_SECRET_KEY=ISSecretKey_test_your_actual_key
```

### 4. Test the Payment Flow
1. Open http://localhost:5000
2. Sign up as a student
3. Search for tutors
4. Click "Book Session"
5. Select M-Pesa payment
6. Use test credentials:
   - **M-Pesa Number**: 254700000000
   - **PIN**: 1234

### 5. Test Webhooks (Optional)
For webhook testing, use ngrok:
```bash
# Install ngrok
npm install -g ngrok

# Expose your local server
ngrok http 5000

# Use the ngrok URL in IntaSend webhook settings
```

## 🧪 Test Credentials

### M-Pesa Test Numbers
- **Safaricom**: 254700000000
- **Airtel**: 254711000000
- **Telkom**: 254733000000

### Card Test Numbers
- **Visa**: 4000000000000002
- **Mastercard**: 5555555555554444

## 📱 Sample Accounts

After running the setup, you can use these accounts:

### Students
- Email: john@example.com | Password: password123
- Email: sarah@example.com | Password: password123

### Tutors
- Email: emily@example.com | Password: password123 (Mathematics)
- Email: david@example.com | Password: password123 (Physics)

## 🔧 Troubleshooting

### Common Issues

1. **"Module not found" errors**
   ```bash
   pip install -r requirements.txt
   ```

2. **Database errors**
   ```bash
   python setup_database.py
   ```

3. **Payment fails**
   - Check your IntaSend API keys
   - Verify you're using test credentials
   - Check the browser console for errors

4. **Webhook not working**
   - Use ngrok for local testing
   - Check IntaSend webhook settings
   - Verify your server is accessible

## 📞 Support

- **IntaSend Docs**: https://docs.intasend.com
- **IntaSend Support**: support@intasend.com
- **M-Pesa Support**: 100

## 🎯 Next Steps

1. **Test thoroughly** with different scenarios
2. **Switch to production** when ready
3. **Monitor payments** and webhooks
4. **Scale up** as your business grows

---

**Happy Testing! 🎉**
