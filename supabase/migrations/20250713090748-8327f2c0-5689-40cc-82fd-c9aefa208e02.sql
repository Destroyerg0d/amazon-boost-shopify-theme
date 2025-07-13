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
'published', false);

-- Populate community posts
INSERT INTO public.community_posts (title, content, category, tags, author_id, created_at, upvotes, view_count) VALUES

('🚀 Success Story: 12 Verified Reviews in 3 Weeks!', 
'Hey everyone! Just wanted to share a quick win – I started using ReviewProMax late March, and by mid-April I had 12 verified Amazon reviews on my debut novel. The readers seemed genuinely engaged and even quoted lines from the book in their feedback. Huge thanks to the community here!

The quality of reviews was amazing - not just star ratings but actual thoughtful feedback that helped me understand what resonated with readers. Several mentioned specific scenes and character development, which tells me they actually read and engaged with the story.

For anyone hesitating about trying this platform, I''d say go for it. The process was smooth and the results speak for themselves.', 
'Success Stories', 
ARRAY['success', 'reviews', 'debut-novel', 'amazon'], 
'00000000-0000-0000-0000-000000000001',
'2025-04-22 14:30:00',
8, 45),

('⚠️ Login Loop After Email Verification', 
'After clicking the email verification link, it just loops back to the login screen without logging me in. Anyone else experiencing this? I''m using Chrome on Windows 11.

I''ve tried:
- Clicking the link multiple times
- Copy/pasting the URL
- Waiting and trying again later

Not sure what else to try. The verification email came through fine, but the actual login isn''t working.', 
'Bug Reports', 
ARRAY['login', 'verification', 'bug', 'chrome'], 
'00000000-0000-0000-0000-000000000002',
'2025-05-03 09:15:00',
3, 28),

('🌊 Feature Suggestion: Genre-Specific Reviewers', 
'Would love to target reviewers by genre. My space opera got reviews from general fiction readers, but sci-fi fans might engage more deeply with the world-building and technical aspects.

I think having genre-specific reviewer pools would help both authors and readers:
- Authors get more relevant feedback
- Readers get books they''re actually interested in
- Reviews would be more detailed and helpful

Has anyone else noticed this genre mismatch issue? Would love to hear your experiences.', 
'Suggestions', 
ARRAY['feature-request', 'genre', 'targeting', 'sci-fi'], 
'00000000-0000-0000-0000-000000000003',
'2025-06-07 16:45:00',
12, 67),

('❗Payment Issue: Wrong Name on Invoice', 
'Hi, my PayPal invoice shows my business partner''s name instead of mine. Can I get this updated for tax purposes? I need the invoice to reflect my author name for bookkeeping.

This is probably a simple fix but wanted to check the process. Do I need to email support or is there a way to update this in the dashboard?', 
'General Questions', 
ARRAY['payment', 'invoice', 'billing', 'taxes'], 
'00000000-0000-0000-0000-000000000004',
'2025-06-19 11:20:00',
2, 15),

('🎓 Guide: How I Got 30 Reviews Without Breaking Amazon TOS', 
'Here''s my complete strategy for using ReviewProMax effectively while staying within Amazon''s guidelines:

## My Process:
1. **Created a detailed listing** - Spent time on the description and made sure it accurately represented the book
2. **Targeted readers carefully** - Used the genre filters to find readers who had previously reviewed similar titles
3. **Used bulk orders strategically** - Started with 10 readers, then added more based on initial response
4. **Monitored Amazon feedback** - Checked reviews for authenticity markers and genuine engagement

## Results:
- 30 total reviews over 6 weeks
- Average rating: 4.3 stars
- All reviews still live on Amazon
- No warnings or issues from Amazon

## Key Principles:
- **No fake reviews ever** - Only real readers who genuinely read the book
- **No review manipulation** - Let readers rate honestly
- **Quality over speed** - Better to get fewer authentic reviews than risk account issues

The key is patience and authenticity. Amazon can detect artificial patterns, so organic growth is essential.

Happy to answer questions about my specific approach!', 
'Tips', 
ARRAY['guide', 'amazon-tos', 'strategy', 'bulk-orders'], 
'00000000-0000-0000-0000-000000000005',
'2025-05-30 13:45:00',
25, 156),

('📈 Can We See Review Conversion Rates?', 
'I sent out 15 copies through the platform and got 6 reviews back. That''s a 40% conversion rate, which seems decent, but I''d love to track this more systematically.

Is there a dashboard feature to see:
- How many readers downloaded my book
- How many actually left reviews
- Average time from download to review
- Conversion rates over time

This data would help me optimize my book descriptions and understand what''s working.', 
'Suggestions', 
ARRAY['analytics', 'conversion-rate', 'dashboard', 'data'], 
'00000000-0000-0000-0000-000000000006',
'2025-04-27 10:30:00',
7, 42),

('🤦 Email Delivery Delays from Resend SMTP', 
'Email confirmation took over 10 minutes to arrive yesterday. I thought the signup had failed and tried to register again. Is this normal, or was there a system issue?

Not a huge problem since it eventually worked, but might be confusing for other new users who expect instant emails.', 
'Bug Reports', 
ARRAY['email', 'smtp', 'delay', 'signup'], 
'00000000-0000-0000-0000-000000000007',
'2025-06-11 15:20:00',
4, 31),

('🧠 Tip: Pre-Review Your Book Description!', 
'I noticed reviewers often echo phrases from your book blurb in their reviews. After improving my description to be more compelling and specific, my reviews became much more detailed and positive.

## What I changed:
- Made the hook more specific to my target audience
- Added emotional stakes beyond just plot summary  
- Included genre-specific keywords readers would recognize
- Shortened paragraphs for easier scanning

## Results:
- Reviews went from generic to specific
- Readers mentioned exact elements I highlighted
- Higher engagement with the actual story themes

Your book description is basically a template for how readers will think about your book. Make it count!', 
'Tips', 
ARRAY['book-description', 'blurb', 'optimization', 'reviews'], 
'00000000-0000-0000-0000-000000000008',
'2025-05-15 09:45:00',
18, 89),

('🤞 How Safe Is This Platform? Any Refunds?', 
'I''m new to review platforms and want to understand the safety and refund policies. Specifically:

- Are reviews guaranteed, or is it just exposure to potential reviewers?
- What happens if no one reviews my book after the campaign?
- How does this stay within Amazon''s terms of service?
- Is there a money-back guarantee?

I want to try this but also want to understand the risks upfront. Thanks for any insights!', 
'General Questions', 
ARRAY['safety', 'refunds', 'guarantee', 'amazon-tos'], 
'00000000-0000-0000-0000-000000000009',
'2025-06-02 12:15:00',
6, 73),

('❌ Bug: Listing Preview Not Loading', 
'When I go to preview my book listing before publishing, it gets stuck on the loading screen. The spinner just keeps going and never shows the preview.

I''m using Safari 15.4 on Mac. Tried refreshing and restarting the browser but same issue. Anyone else seeing this?', 
'Bug Reports', 
ARRAY['bug', 'preview', 'safari', 'loading'], 
'00000000-0000-0000-0000-000000000010',
'2025-06-28 14:10:00',
5, 22),

('💳 Bulk Order Confusion', 
'Quick question about bulk order pricing - is the price per book or per batch? 

The pricing page shows "$X for 10 readers" but I want to make sure that means 10 different people will potentially review my ONE book, not that I can submit 10 different books.

Just want to understand before I purchase. Thanks!', 
'General Questions', 
ARRAY['bulk-orders', 'pricing', 'billing'], 
'00000000-0000-0000-0000-000000000011',
'2025-05-18 16:40:00',
3, 35),

('✉️ Resend Link Not Working', 
'Tried clicking "Resend Verification Email" multiple times but nothing''s showing up in my inbox or spam folder. 

I signed up about an hour ago and really want to get started. Is there a delay, or should I try a different email address?', 
'Bug Reports', 
ARRAY['email', 'verification', 'resend', 'signup'], 
'00000000-0000-0000-0000-000000000012',
'2025-04-25 11:30:00',
2, 18),

('🌍 Looking for Beta Readers Too?', 
'Does ReviewProMax help with beta readers, or is it only for review-ready books? 

I have a manuscript that needs feedback before final publication, and I''m wondering if there''s a way to connect with beta readers through this platform or if that''s a separate service entirely.', 
'General Questions', 
ARRAY['beta-readers', 'feedback', 'manuscript'], 
'00000000-0000-0000-0000-000000000013',
'2025-06-23 13:25:00',
8, 54),

('🚫 Review Removed by Amazon?', 
'One of my verified reviews disappeared after a week. It was a 4-star review with detailed feedback, so I don''t think it was fake or violated any policies.

Has anyone else experienced this? Is it normal for Amazon to remove legitimate reviews, and is there anything that can be done about it?', 
'General Questions', 
ARRAY['amazon', 'review-removal', 'policies'], 
'00000000-0000-0000-0000-000000000014',
'2025-07-01 08:45:00',
9, 67),

('💡 Tips: How I Improved Review Speed', 
'Just sharing what worked for me to get faster reviews:

## Before changes: 1 review per week
## After optimization: 4 reviews in one week

## What I changed:
1. **Book description:** Made it sound like a reader recommendation instead of back-cover marketing copy
2. **Genre tags:** Got more specific (changed "fiction" to "psychological thriller")  
3. **Target audience:** Clearly stated who would love this book
4. **Author note:** Added personal context about why I wrote it

The key insight: write for readers browsing for their next great read, not for bookstore customers scanning covers.', 
'Tips', 
ARRAY['optimization', 'review-speed', 'book-description'], 
'00000000-0000-0000-0000-000000000015',
'2025-05-22 10:15:00',
22, 134),

('🎤 General Discussion: Best Time to Submit Listings?', 
'Has anyone noticed patterns in when to submit listings for best results? 

I submitted mine on a Friday afternoon and didn''t get any reader activity until Monday. Wondering if weekday timing matters for reader engagement.

What''s been your experience with timing?', 
'General Questions', 
ARRAY['timing', 'submission', 'engagement'], 
'00000000-0000-0000-0000-000000000016',
'2025-05-25 17:30:00',
11, 78),

('🧩 Feature Suggestion: Genre-Specific Reviewer Pool', 
'Building on the earlier genre discussion - what if there were opt-in reviewer pools for specific genres?

For example:
- "Romance Readers Only" pool
- "Fantasy & Sci-Fi Enthusiasts"  
- "Non-Fiction Business Books"
- "Literary Fiction Lovers"

This could improve matching quality and reader satisfaction. Authors would get more relevant feedback, and readers would get books they''re actually excited about.

Thoughts on feasibility?', 
'Suggestions', 
ARRAY['feature-request', 'genre-pools', 'targeting'], 
'00000000-0000-0000-0000-000000000017',
'2025-05-28 14:20:00',
16, 92);

-- Add some replies to community posts
INSERT INTO public.community_replies (post_id, content, author_id, created_at, upvotes) VALUES

-- Replies to Success Story post
((SELECT id FROM public.community_posts WHERE title LIKE '%Success Story: 12 Verified Reviews%'), 
'That''s amazing, Melissa! Did you do the standard listing or a bulk order? I''m just getting started and trying to figure out the best approach for a debut novel.',
'00000000-0000-0000-0000-000000000018',
'2025-04-22 15:45:00', 2),

((SELECT id FROM public.community_posts WHERE title LIKE '%Success Story: 12 Verified Reviews%'), 
'Just the standard one initially. I might try bulk for my next book though, especially after seeing these results. The individual approach let me test the waters first.',
'00000000-0000-0000-0000-000000000001',
'2025-04-22 16:20:00', 1),

((SELECT id FROM public.community_posts WHERE title LIKE '%Success Story: 12 Verified Reviews%'), 
'Love seeing results like this, Melissa! Let us know if you''d like help planning your next promo. We have some new genre-targeting features in beta that might interest you.',
'00000000-0000-0000-0000-000000000099',
'2025-04-23 09:30:00', 5),

-- Replies to Login Loop post
((SELECT id FROM public.community_posts WHERE title LIKE '%Login Loop After Email Verification%'), 
'Hey Ray, we pushed a fix for this in the May 4 release. Can you try again now and clear your browser cache first? This should resolve the loop issue.',
'00000000-0000-0000-0000-000000000099',
'2025-05-04 08:15:00', 3),

((SELECT id FROM public.community_posts WHERE title LIKE '%Login Loop After Email Verification%'), 
'Just tried it – cleared cache and it worked perfectly! Thanks for the quick fix. Really appreciate the fast response time.',
'00000000-0000-0000-0000-000000000002',
'2025-05-04 09:30:00', 1),

-- Replies to Genre-Specific Reviewers suggestion
((SELECT id FROM public.community_posts WHERE title LIKE '%Genre-Specific Reviewers%'), 
'+1 to this idea! My thriller got mixed reviews because some readers expected cozy mystery instead of psychological suspense. Genre matching would help a lot.',
'00000000-0000-0000-0000-000000000019',
'2025-06-07 18:15:00', 8),

((SELECT id FROM public.community_posts WHERE title LIKE '%Genre-Specific Reviewers%'), 
'Great suggestion, Zoe. We''re actually working on enhanced genre matching right now. The system will match authors with readers who specifically prefer certain genres and sub-genres. Current ETA is August.',
'00000000-0000-0000-0000-000000000099',
'2025-06-08 10:30:00', 15),

-- Replies to Payment Issue post  
((SELECT id FROM public.community_posts WHERE title LIKE '%Payment Issue: Wrong Name%'), 
'We''ve sent you a corrected invoice via email with your author name! Check your inbox in the next few minutes. Let us know if anything else looks off.',
'00000000-0000-0000-0000-000000000099',
'2025-06-19 12:45:00', 2),

((SELECT id FROM public.community_posts WHERE title LIKE '%Payment Issue: Wrong Name%'), 
'Got the corrected invoice - looks perfect now! Thanks so much for the quick turnaround. Really helpful for tax season.',
'00000000-0000-0000-0000-000000000004',
'2025-06-19 13:15:00', 1),

-- Replies to Guide post
((SELECT id FROM public.community_posts WHERE title LIKE '%Guide: How I Got 30 Reviews%'), 
'This is incredibly helpful! Did you use the bulk feature exclusively, or did you mix individual and bulk orders? I''m planning my first campaign.',
'00000000-0000-0000-0000-000000000020',
'2025-05-30 15:20:00', 4),

((SELECT id FROM public.community_posts WHERE title LIKE '%Guide: How I Got 30 Reviews%'), 
'I started with individual orders to test the process, then moved to bulk once I saw the quality. Bulk + targeted genre filtering worked amazingly well.',
'00000000-0000-0000-0000-000000000005',
'2025-05-30 16:45:00', 6),

-- Replies to Conversion Rates post
((SELECT id FROM public.community_posts WHERE title LIKE '%See Review Conversion Rates%'), 
'We''re adding comprehensive conversion tracking to the dashboard in July! For now, we can export detailed stats for you manually. Would you like us to send your current metrics?',
'00000000-0000-0000-0000-000000000099',
'2025-04-27 14:20:00', 5),

((SELECT id FROM public.community_posts WHERE title LIKE '%See Review Conversion Rates%'), 
'That would be fantastic! Please send the stats to my email on file. Really looking forward to the dashboard update.',
'00000000-0000-0000-0000-000000000006',
'2025-04-27 15:10:00', 2),

-- Replies to Email Delays post
((SELECT id FROM public.community_posts WHERE title LIKE '%Email Delivery Delays%'), 
'Thanks for flagging this! We experienced a temporary queue delay from our Resend SMTP provider that afternoon. It''s been resolved and emails should now arrive within 1-2 minutes.',
'00000000-0000-0000-0000-000000000099',
'2025-06-11 16:45:00', 3),

((SELECT id FROM public.community_posts WHERE title LIKE '%Email Delivery Delays%'), 
'Perfect! I just tested with a password reset and the email arrived instantly. Thanks for the quick response and transparency.',
'00000000-0000-0000-0000-000000000007',
'2025-06-11 17:15:00', 1),

-- Replies to Description Tips post
((SELECT id FROM public.community_posts WHERE title LIKE '%Pre-Review Your Book Description%'), 
'This makes so much sense! I never thought about how the description influences review content. Going to revise mine tonight based on your suggestions.',
'00000000-0000-0000-0000-000000000021',
'2025-05-15 11:30:00', 7),

-- Replies to Platform Safety post
((SELECT id FROM public.community_posts WHERE title LIKE '%How Safe Is This Platform%'), 
'Great questions! While we don''t guarantee reviews (to stay within Amazon TOS), we do offer full refunds if no readers engage with your book after 14 days. Our approach focuses on connecting you with genuine readers.',
'00000000-0000-0000-0000-000000000099',
'2025-06-02 14:30:00', 8),

((SELECT id FROM public.community_posts WHERE title LIKE '%How Safe Is This Platform%'), 
'I''ve done 3 campaigns now and gotten reviews every time. The key is being clear and compelling in your book synopsis. Real readers want good books!',
'00000000-0000-0000-0000-000000000022',
'2025-06-02 16:45:00', 4),

-- Replies to Safari Bug post
((SELECT id FROM public.community_posts WHERE title LIKE '%Listing Preview Not Loading%'), 
'This is a known issue affecting Safari users. We have a fix incoming in next week''s patch. For now, try switching to Chrome or Firefox as a workaround.',
'00000000-0000-0000-0000-000000000099',
'2025-06-28 15:30:00', 2),

((SELECT id FROM public.community_posts WHERE title LIKE '%Listing Preview Not Loading%'), 
'Switched to Chrome and it works perfectly! Thanks for the heads up. Looking forward to the Safari fix.',
'00000000-0000-0000-0000-000000000010',
'2025-06-28 16:15:00', 1);