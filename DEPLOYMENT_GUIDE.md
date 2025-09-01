# EduBridge Deployment Guide - Kenya Edition

## 🚀 Quick Deploy to Production

### Option 1: Render (Recommended - Full Stack)
1. **Push to GitHub**: Upload your code to a GitHub repository
2. **Deploy on Render**:
   - Go to [render.com](https://render.com)
   - Click "New" → "Blueprint"
   - Connect your GitHub repo
   - Render will automatically detect the `render.yaml` and deploy
3. **Configure Environment Variables**:
   - In your Render dashboard, go to your service
   - Add these environment variables:
     ```
     INTASEND_PUBLISHABLE_KEY=your_publishable_key
     INTASEND_SECRET_KEY=your_secret_key
     INTASEND_API_URL=https://api.intasend.com
     FLASK_ENV=production
     ```

### Option 2: Netlify + Render (Frontend + Backend)
1. **Deploy Backend on Render** (follow Option 1 steps)
2. **Deploy Frontend on Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Connect your GitHub repo
   - Set build command: `echo "Static build"`
   - Set publish directory: `static`
   - The `netlify.toml` will automatically proxy API calls to your Render backend

## 🔧 Local Testing Setup

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Set Environment Variables
Create a `.env` file:
```env
INTASEND_PUBLISHABLE_KEY=ISPubKey_test_your_key_here
INTASEND_SECRET_KEY=ISSecretKey_test_your_key_here
INTASEND_API_URL=https://sandbox.intasend.com
FLASK_ENV=development
```

### 3. Run the App
```bash
python app.py
```

### 4. Test M-Pesa Integration
1. Sign up as a student
2. Search for tutors
3. Click "Book Session"
4. Select M-Pesa payment
5. Enter phone number (format: 7XX XXX XXX)
6. Complete payment

## 🇰🇪 Kenyan Localization Features

### Phone Numbers
- **Format**: +254 7XX XXX XXX
- **Validation**: 9 digits starting with 7
- **Country Code**: Automatically prefixed

### Location Structure
- **County**: Nairobi, Mombasa, Kisumu, etc.
- **Sub-County**: Westlands, Kilimani, etc.
- **Constituency**: Westlands, Dagoretti North, etc.
- **Specific Location**: Lavington, Karen, etc.

### Payment Integration
- **M-Pesa**: Primary payment method
- **Card Payments**: Secondary option
- **Real-time Prompts**: Users receive M-Pesa prompts on their phones
- **Payment Status**: Real-time tracking

## 🧪 Testing M-Pesa Payments

### Test Credentials
- **Phone Number**: Use any valid Kenyan format (7XX XXX XXX)
- **Test Mode**: Uses IntaSend sandbox environment
- **No Real Money**: All transactions are simulated

### Test Flow
1. Student books a session
2. Enters M-Pesa phone number
3. Receives payment prompt on phone
4. Enters M-Pesa PIN
5. Payment is processed
6. Session is confirmed

## 🔐 Production Checklist

### Before Going Live
- [ ] Get IntaSend production API keys
- [ ] Update `INTASEND_API_URL` to production URL
- [ ] Set `FLASK_ENV=production`
- [ ] Test payment flow with real M-Pesa numbers
- [ ] Verify location data accuracy
- [ ] Test tutor registration and profile creation

### Security Considerations
- [ ] Use HTTPS in production
- [ ] Secure API keys (never commit to git)
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Set up monitoring and logging

## 📱 Mobile Optimization

The app is fully responsive and optimized for:
- **Mobile Browsers**: Safari, Chrome, Firefox
- **Tablets**: iPad, Android tablets
- **Desktop**: All modern browsers

### Key Mobile Features
- Touch-friendly payment interface
- Responsive payment modals
- Optimized form inputs
- Mobile-optimized M-Pesa flow

## 🆘 Troubleshooting

### Common Issues

**Payment Not Working**
- Check IntaSend API keys
- Verify phone number format
- Ensure test mode is enabled for testing

**Database Errors**
- Run `db.create_all()` in Flask shell
- Check database file permissions
- Verify SQLite file location

**Deployment Issues**
- Check environment variables
- Verify Python version (3.10+)
- Check build logs for errors

### Support
- **Email**: support@edubridge.com
- **Phone**: +254 700 660 694
- **Documentation**: Check this guide and INTASEND_SETUP.md

## 🎯 Next Steps

1. **Go Live**: Deploy to production
2. **Marketing**: Promote to Kenyan students and tutors
3. **Analytics**: Track usage and payments
4. **Feedback**: Collect user feedback
5. **Improvements**: Iterate based on usage data

---

**Happy Deploying! 🚀**
