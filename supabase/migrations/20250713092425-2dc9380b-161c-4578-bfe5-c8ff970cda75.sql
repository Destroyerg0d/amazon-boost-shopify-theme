-- Populate help articles with support tickets and guides
INSERT INTO public.help_articles (title, content, excerpt, category, tags, status, featured) VALUES

-- Login Issues Category
('Resolving Login Loop After Email Verification', 
'# Login Loop After Email Verification

**Issue:** Users experience a loop back to the login screen after clicking email verification links.

## Solution Steps:
1. Clear your browser cache and cookies
2. Try using a different browser (Chrome, Firefox, Safari)
3. Ensure JavaScript is enabled
4. If issue persists, contact support

## Common Causes:
- Outdated browser cache
- Browser compatibility issues
- Ad blockers interfering with verification

Most login loop issues are resolved by clearing browser cache. If you continue experiencing problems, our support team can manually verify your account.

**Resolution Time:** Usually immediate after cache clearing

*Last updated: May 2025*', 
'Fix login loops after email verification by clearing browser cache and trying different browsers.', 
'Login Issues', 
ARRAY['login', 'verification', 'troubleshooting'], 
'published', true),

('Resend Verification Email Not Working', 
'# Resend Verification Email Issues

**Problem:** The "Resend Verification Email" button doesn''t send new emails.

## Troubleshooting Steps:
1. Check your spam/junk folder
2. Wait 5 minutes between resend attempts (rate limiting)
3. Verify your email address is spelled correctly
4. Try using a different email provider if possible

## Technical Details:
We use Resend SMTP for email delivery. Occasionally, certain ISPs may block or delay our emails. If you don''t receive verification emails after following the steps above, contact support for manual verification.

**Average Resolution:** 15 minutes

*Updated: June 2025*', 
'Troubleshoot issues with resending verification emails and SMTP delivery problems.', 
'Login Issues', 
ARRAY['email', 'verification', 'smtp', 'resend'], 
'published', false),

-- Payment & Billing Category  
('Updating Invoice Information', 
'# Correcting Invoice Details

**Common Request:** Updating personal name to business name or correcting billing information.

## How to Request Changes:
1. Email support@reviewpromax.com with your order details
2. Include your preferred business name or legal name
3. Attach business documentation if requesting LLC/Corp name
4. Specify if you need tax ID added

## What We Can Update:
- Personal name to business name
- Billing address
- Tax identification numbers
- Payment method information

## Processing Time:
- Standard updates: 24 hours
- Business verification: 2-3 business days

Updated invoices are sent as PDF attachments and can be downloaded from your dashboard.

*Last updated: May 2025*', 
'Learn how to update invoice information including business names and billing details.', 
'Payment & Billing', 
ARRAY['invoice', 'billing', 'business', 'tax'], 
'published', true),

('PayPal Payment Issues and Refunds', 
'# PayPal Payment Troubleshooting

## Common PayPal Issues:

### Payment Not Reflecting in Dashboard
- PayPal payments usually clear instantly
- Some banks may show "pending" for 1-2 hours
- Check your PayPal email for confirmation
- Contact support if status doesn''t update within 4 hours

### Missing PayPal Receipts
1. Check spam/junk folders first
2. Verify email address in PayPal account
3. Request resend through support
4. Download from PayPal transaction history

### Refund Processing
- Refunds are processed within 14 days of no reader activity
- Funds return to original PayPal account
- Processing time: 1-3 business days
- Email notification sent when initiated

### Business Account Issues
PayPal business accounts may require additional verification. Contact support if payments are held for review.

*Updated: June 2025*', 
'Resolve PayPal payment issues, missing receipts, and understand refund policies.', 
'Payment & Billing', 
ARRAY['paypal', 'payment', 'refund', 'receipt'], 
'published', false),

-- Technical Bugs Category
('Browser Compatibility Issues', 
'# Supported Browsers and Known Issues

## Fully Supported Browsers:
- **Chrome** (recommended) - All features work
- **Firefox** - Full compatibility
- **Edge** - Complete support

## Limited Support:
- **Safari** - Known issues with listing preview (patch in progress)
- **Mobile browsers** - Basic functionality only

## Common Safari Issues:
1. **Listing Preview Loading Forever**
   - Workaround: Use Chrome or Firefox
   - Fix expected: Next major update

2. **File Upload Freezing**
   - Reduce image size to under 1.5MB
   - Switch to Chrome temporarily

## Mobile Experience:
- Dashboard viewing works on mobile
- File uploads not optimized for mobile
- Use desktop for best experience

## Clearing Browser Data:
```
Chrome: Settings > Privacy > Clear Browsing Data
Firefox: History > Clear Recent History
Safari: Develop > Empty Caches
```

*Updated: June 2025*', 
'Browser compatibility guide and solutions for Safari, Chrome, and Firefox issues.', 
'Technical Bugs', 
ARRAY['browser', 'safari', 'compatibility', 'upload'], 
'published', true),

('Dashboard and Display Issues', 
'# Dashboard Problems and Solutions

## Blank Dashboard After Login
**Cause:** Temporary Supabase synchronization issues
**Solution:** 
1. Refresh the page
2. Clear browser cache
3. Try incognito/private browsing mode
4. Check our status page for ongoing issues

## Missing Listings or Stats
- Data sync can take up to 5 minutes
- Check internet connection stability
- Disable ad blockers temporarily
- Try logging out and back in

## Performance Issues
### Slow Loading:
- Clear browser cache weekly
- Close unnecessary browser tabs
- Check internet speed (minimum 5 Mbps recommended)
- Disable browser extensions temporarily

### Display Errors:
- Update your browser to latest version
- Enable JavaScript
- Check screen resolution (minimum 1024x768)

## Real-Time Updates
Dashboard updates every 30 seconds automatically. Manual refresh may be needed for immediate updates after actions.

*Last updated: May 2025*', 
'Fix dashboard loading issues, blank screens, and performance problems.', 
'Technical Bugs', 
ARRAY['dashboard', 'loading', 'sync', 'performance'], 
'published', false),

-- Email Delivery Category
('Email Delivery and SMTP Issues', 
'# Understanding Email Delivery

## Our Email System:
We use **Resend SMTP** for all email communications including:
- Account verification
- Payment confirmations  
- Reader notifications
- Support communications

## Delivery Times:
- **Normal:** Under 2 minutes
- **Peak times:** Up to 10 minutes
- **ISP delays:** Occasionally longer

## If Emails Are Delayed:
1. Check spam/junk folders
2. Add support@reviewpromax.com to contacts
3. Verify email address spelling
4. Wait 15 minutes during peak hours

## Email Blocked by ISP:
Some ISPs (AOL, Yahoo, corporate emails) may block automated emails:
- Contact your IT department
- Use Gmail or Outlook as alternative
- Request manual email from support

## Queue Status:
During high traffic, emails may queue for up to 30 minutes. Check our status page for current delays.

*Updated: June 2025*', 
'Understand email delivery times, SMTP issues, and what to do when emails are delayed.', 
'Email Delivery', 
ARRAY['email', 'smtp', 'delivery', 'spam'], 
'published', true),

-- Bulk Orders Category
('Understanding Bulk Order Pricing', 
'# Bulk Order Plans and Pricing

## How Bulk Pricing Works:
- **Per batch, not per book**
- Example: 10-reader bulk = one batch price
- Discounts apply automatically at checkout

## Bulk Order Options:
- **5 readers:** Small campaign
- **10 readers:** Standard bulk (most popular)
- **20 readers:** Large campaign
- **50+ readers:** Enterprise (contact sales)

## Multi-Book Campaigns:
### Same Account, Multiple Books:
- Each book needs separate bulk order
- Use coupon codes for multi-book discounts
- Stagger submissions for optimal exposure

### Trilogy/Series Promotion:
- Submit all books simultaneously
- We space listings for reader variety
- Cross-promotion between books in series

## Payment and Billing:
- Bulk orders charged upfront
- Refunds available if no reader activity after 14 days
- Business invoicing available upon request

*Updated: May 2025*', 
'Learn about bulk order pricing, multi-book campaigns, and payment options.', 
'Bulk Orders', 
ARRAY['bulk', 'pricing', 'multiple-books', 'discount'], 
'published', true),

-- General Questions Category
('Amazon Review Retention and Policies', 
'# Why Amazon Sometimes Removes Reviews

## Amazon''s Review System:
Amazon uses automated systems to detect and remove reviews that don''t meet their guidelines, even legitimate ones.

## Common Removal Reasons:
- **Velocity flags:** Too many reviews in short timeframe
- **Pattern detection:** Similar review language or timing
- **Account flags:** Reviewer account issues unrelated to your book
- **Random audits:** Amazon''s regular review sweeps

## Our Approach:
- We only connect you with **verified, independent readers**
- No bots, scripts, or incentivized reviews
- **90%+ retention rate** across all campaigns
- Readers leave natural, honest feedback

## What We Can Do:
- Replace removed review slots at no cost
- Provide reviewer verification if needed
- Report patterns to Amazon if systematic removal occurs

## What You Can Do:
- Don''t contact reviewers directly
- Avoid asking for specific ratings
- Let reviews come naturally over time

**Remember:** Amazon has final control over all reviews on their platform.

*Updated: June 2025*', 
'Understand why Amazon removes reviews and how ReviewProMax maintains high retention rates.', 
'General Questions', 
ARRAY['amazon', 'reviews', 'removal', 'retention'], 
'published', true),

('Genre Matching and Niche Books', 
'# Genre Targeting and Niche Book Success

## How Our Matching Works:
- Readers specify preferred genres during signup
- Algorithm matches books to interested readers
- Quality over quantity for niche genres

## Niche Genre Performance:
### Often Perform Better:
- Poetry and literary fiction
- Historical fiction with specific settings
- Technical non-fiction
- Specialized hobby books

### Why Niche Works:
- More engaged, passionate readers
- Detailed, thoughtful reviews
- Higher conversion rates
- Less competition for reader attention

## Optimizing for Niche:
1. **Detailed descriptions:** Help readers understand your unique angle
2. **Specific tags:** Use precise genre and sub-genre tags
3. **Author note:** Explain what makes your book special
4. **Target audience:** Clearly define who will love this book

## Genre Improvements Coming:
- Advanced filtering by sub-genres
- Reader preference matching
- Beta reader connections for niche topics

*Updated: May 2025*', 
'Learn how genre matching works and why niche books often perform exceptionally well.', 
'General Questions', 
ARRAY['genre', 'niche', 'matching', 'targeting'], 
'published', false),

('Getting Started with ReviewProMax', 
'# Your Complete Guide to Starting Your First Campaign

## Step 1: Account Setup
1. Sign up with your author email
2. Verify your email address
3. Complete your author profile
4. Add payment method

## Step 2: Prepare Your Book
- Ensure your book is published on Amazon
- Have your ASIN ready
- Prepare a compelling book description
- Upload a high-quality cover image

## Step 3: Create Your First Listing
- Choose between individual or bulk orders
- Write a reader-focused description
- Select appropriate genre tags
- Set your campaign timeline

## Step 4: Monitor Results
- Check your dashboard regularly
- Respond to reader feedback professionally
- Track review conversion rates
- Plan follow-up campaigns

## Pro Tips for Success:
- Start small with 5-10 readers
- Focus on book description quality
- Be patient - reviews take time
- Follow up with bulk orders if successful

**Average timeline:** First reviews typically appear within 5-10 days.

*Updated: July 2025*', 
'Complete beginner guide to launching your first ReviewProMax campaign successfully.', 
'Getting Started', 
ARRAY['beginner', 'guide', 'setup', 'first-campaign'], 
'published', true);

-- Create a function to safely insert community posts and sample data
-- This approach avoids the foreign key constraint issue