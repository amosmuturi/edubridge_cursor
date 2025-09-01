# IntaSend M-Pesa Integration Setup Guide

This guide explains how to set up IntaSend M-Pesa integration to receive push notifications on your phone when making payments.

## 🔧 **What Was Fixed**

### **Previous Issues:**
- ❌ `APIService.__init__() got an unexpected keyword argument 'test'` error
- ❌ Outdated IntaSend API usage
- ❌ No proper M-Pesa collection requests
- ❌ Missing phone number formatting for Kenya

### **Solutions Applied:**
- ✅ Updated to latest IntaSend Python SDK (v1.1.2)
- ✅ Implemented proper M-Pesa collection requests
- ✅ Added phone number formatting for Kenya (+254)
- ✅ Enhanced webhook handling for real-time updates

## 📱 **How M-Pesa Push Notifications Work**

### **1. Payment Flow:**
1. User enters phone number (e.g., 0783459660)
2. System formats it to Kenya format (254783459660)
3. IntaSend sends M-Pesa collection request
4. **Push notification appears on your phone**
5. Enter M-Pesa PIN to complete payment
6. Webhook updates payment status in real-time

### **2. Phone Number Formatting:**
- **Input:** 0783459660 or +254783459660
- **Formatted:** 254783459660 (IntaSend requirement)
- **M-Pesa Prompt:** Will appear on this number

## 🚀 **Setup Steps**

### **Step 1: IntaSend Account Setup**
1. Go to [IntaSend Dashboard](https://intasend.com)
2. Create account and verify business details
3. Get your API keys:
   - **Publishable Key:** `ISPubKey_...`
   - **Secret Key:** `ISSecretKey_...`

### **Step 2: Environment Variables**
Set these in your Render dashboard:

```bash
INTASEND_PUBLISHABLE_KEY=ISPubKey_your_key_here
INTASEND_SECRET_KEY=ISSecretKey_your_key_here
INTASEND_API_URL=https://api.intasend.com
INTASEND_ENVIRONMENT=sandbox  # Change to 'production' for live
```

### **Step 3: Test M-Pesa Integration**
1. Use a **test phone number** (IntaSend provides test numbers)
2. Make a test payment
3. Check for M-Pesa prompt on your phone
4. Verify webhook updates in logs

## 📋 **Test Phone Numbers**

### **Sandbox Testing:**
- **Test Number 1:** 254700000000
- **Test Number 2:** 254700000001
- **Test Number 3:** 254700000002

### **Production:**
- Use your actual M-Pesa registered number
- Format: 254XXXXXXXXX (without +)

## 🔍 **Troubleshooting**

### **No Push Notification:**
1. **Check Phone Number Format:**
   - Must be 254XXXXXXXXX format
   - No spaces or special characters

2. **Verify API Keys:**
   - Ensure keys are correct
   - Check if account is verified

3. **Check IntaSend Dashboard:**
   - Look for failed collection requests
   - Verify webhook URLs

### **Common Errors:**

#### **Error: "Invalid phone number"**
- **Solution:** Ensure phone number is in 254XXXXXXXXX format
- **Example:** 254783459660 (not +254783459660)

#### **Error: "Collection request failed"**
- **Solution:** Check IntaSend account status and API keys
- **Verify:** Business verification is complete

#### **Error: "Webhook not received"**
- **Solution:** Ensure webhook URL is accessible
- **Check:** Render deployment is working

## 📊 **Payment Status Tracking**

### **Real-time Updates:**
- **PENDING:** M-Pesa prompt sent to phone
- **COMPLETED:** Payment successful, session created
- **FAILED:** Payment failed or cancelled

### **Webhook Events:**
```json
{
  "id": "collection_request_id",
  "state": "COMPLETED",
  "amount": 1000,
  "currency": "KES",
  "mpesa_phone": "254783459660"
}
```

## 🧪 **Testing Checklist**

- [ ] IntaSend account created and verified
- [ ] API keys configured in environment
- [ ] Test phone number used for sandbox
- [ ] M-Pesa prompt appears on phone
- [ ] Payment can be completed with PIN
- [ ] Webhook updates payment status
- [ ] Session record created after payment

## 🔐 **Security Considerations**

### **Webhook Verification:**
- Implement signature verification
- Use HTTPS for webhook URLs
- Validate webhook data

### **Phone Number Validation:**
- Sanitize input phone numbers
- Validate Kenya phone format
- Log payment attempts

## 📱 **User Experience**

### **What Users See:**
1. **Payment Form:** Enter amount and phone number
2. **Confirmation:** "M-Pesa payment request sent to [phone]"
3. **Phone Prompt:** M-Pesa payment notification
4. **Success:** Payment confirmed, session scheduled

### **Error Handling:**
- Clear error messages for invalid phone numbers
- Fallback for failed M-Pesa requests
- Support for alternative payment methods

## 🚀 **Next Steps**

1. **Test with Sandbox:** Use test phone numbers
2. **Verify Webhooks:** Check payment status updates
3. **Go Live:** Switch to production environment
4. **Monitor:** Track payment success rates
5. **Optimize:** Improve user experience based on feedback

## 📞 **Support**

- **IntaSend Support:** support@intasend.com
- **Documentation:** [IntaSend Docs](https://docs.intasend.com)
- **API Reference:** [IntaSend API](https://api.intasend.com)

---

**Note:** This integration now properly sends M-Pesa push notifications to your phone. Make sure to test with sandbox numbers before going live!
