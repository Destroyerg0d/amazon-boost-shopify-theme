-- Add more comprehensive help articles based on the extended dataset
INSERT INTO public.help_articles (title, content, excerpt, category, tags, status, featured, created_at) VALUES

-- SEO and Optimization Category
('SEO Optimization for Amazon Book Reviews', 
'# SEO Optimization for Amazon Book Reviews

## How Reviews Impact Search Visibility

Reader reviews containing relevant keywords can significantly boost your book''s discoverability on Amazon. Here''s how to ethically optimize this process:

## Best Practices for SEO-Friendly Review Requests:

### Safe Subject Lines:
- "Your early access copy is ready"
- "New release available to preview" 
- "Help shape this launch"

### Avoid Spam Triggers:
- Never use "review now," "urgent," or "free gift"
- Keep subject lines short with minimal punctuation
- Focus on reader value, not rewards

## Encouraging Natural Keyword Usage:

Instead of suggesting specific words, shape your book description and author notes to naturally guide how readers describe your work:

### Good Approach:
- Write compelling blurbs that readers will echo
- Use genre-specific language in your book description
- Ask open questions like "What theme stood out to you?"

### Avoid:
- Directly suggesting keywords to reviewers
- Using phrases like "mention XYZ in your review"
- Offering incentives for specific language

## Review Content That Helps SEO:

- Reviews mentioning genre (e.g., "sci-fi thriller," "cozy mystery")
- Comments about themes and character development
- Natural use of your book title and author name
- Specific details that reinforce your book''s category

## Velocity and SEO Impact:

Review velocity affects both search rankings and algorithmic trust. Follow our pacing recommendations:
- Days 1-7: Maximum 2-3 reviews per day
- Days 8-14: Increase to 4-5 if responses are organic
- Day 15+: Maintain steady flow, avoid sudden spikes

Remember: Amazon prefers unique, authentic review content. Duplicate or templated reviews can hurt your SEO ranking.

*Updated: July 2025*', 
'Learn how to ethically optimize review requests for better Amazon search visibility and ranking.', 
'SEO Optimization', 
ARRAY['seo', 'amazon', 'optimization', 'keywords'], 
'published', true, '2025-07-10T10:00:00Z'),

('Platform Incident History and Resolutions', 
'# Major Platform Incidents and How We''ve Improved

## June 2025: Email Delivery Crisis

**Issue:** Resend SMTP experienced major queueing delays affecting verification and confirmation emails.

**Impact:** 
- Verification emails delayed 3-8 hours
- Campaign confirmations failed to send
- Launch schedules disrupted for 72 hours

**Resolution:**
- Added Postmark as backup SMTP provider
- Implemented instant retry system
- Created real-time status monitoring
- Added manual resend options in dashboard

## May 2025: Dashboard Sync Failure

**Issue:** Supabase indexing bug caused blank dashboards and missing campaign data.

**Impact:**
- Users saw "No Active Listings" despite live campaigns
- Review tracking temporarily unavailable
- Session state corruption for 48 hours

**Resolution:**
- Auto-repair system for session tokens
- Sync warnings for data mismatches
- Enhanced error logging for faster intervention
- Database backup verification system

## April 2025: PayPal Invoice Mix-Up

**Issue:** Invoice integration pulled incorrect names from PayPal cache instead of user profiles.

**Impact:**
- Business vs personal name confusion
- Tax documentation complications
- Billing identity errors

**Resolution:**
- Manual override fields during checkout
- Full invoice control in Billing Settings
- PayPal webhook integration redesign
- Identity verification system

## March 2025: Two-Factor Authentication Lockouts

**Issue:** Supabase auth layer failed to register phone tokens with Twilio.

**Impact:**
- SMS verification codes not delivered
- Account lockouts during 2FA setup
- Authentication failures for 4 days

**Resolution:**
- Email fallback for 2FA as default
- Phone verification pre-check system
- Account recovery improvements
- Multi-provider authentication

## February 2025: Review Queue Scheduler Bug

**Issue:** Notification system failed to alert accepted readers about assignments.

**Impact:**
- 9+ day delays in review starts
- Reader confusion about assignments
- Campaign momentum disruption

**Resolution:**
- Queue scheduler rebuild
- Real-time reader notifications
- Assignment confirmation system
- Queue status monitoring

## What We''ve Learned:

1. **Multiple Failsafes:** Every critical system now has backup providers
2. **Real-Time Monitoring:** Status page shows live system health
3. **Transparent Communication:** Immediate incident reporting to users
4. **Rapid Response:** Average resolution time reduced from 72 to 6 hours

Our platform is stronger because of these challenges. Each incident led to fundamental improvements in reliability and user experience.

*Updated: July 2025*', 
'Complete history of major platform incidents and the improvements implemented after each issue.', 
'Platform History', 
ARRAY['incidents', 'history', 'improvements', 'reliability'], 
'published', false, '2025-07-08T14:00:00Z'),

('File Upload Troubleshooting Guide', 
'# File Upload Issues and Solutions

## Common Upload Problems:

### File Size Limits:
- **Current limit:** 1.5MB per file
- **Recommended:** Compress files before upload
- **Alternative:** Use Google Drive or Dropbox direct links

### Browser Compatibility:
- **Chrome:** Full support (recommended)
- **Firefox:** Complete compatibility
- **Safari:** Known issues with large PNG files
- **Edge:** Full support

## PNG Upload Issues:

Large PNG files (>500KB) may stall during upload, especially in Safari.

**Solutions:**
1. Convert PNG to JPEG format
2. Compress image to under 1MB
3. Switch to Chrome browser
4. Use direct link upload option

## EPUB File Problems:

**Issue:** 2MB+ EPUB files may timeout during upload.

**Solutions:**
1. Compress EPUB file
2. Use direct link option
3. Split large files if possible
4. Contact support for manual upload

## Upload Freezing/Spinning:

**Causes:**
- File size too large
- Browser compatibility issue
- Network connection interruption
- Server-side processing delay

**Troubleshooting Steps:**
1. Check file size (must be under 1.5MB)
2. Clear browser cache and cookies
3. Try different browser
4. Check internet connection stability
5. Disable browser extensions temporarily

## Error Messages:

### "Upload Failed - Try Again"
- File format not supported
- File corrupted or incomplete
- Network timeout occurred

### "File Too Large"
- Compress file or use alternative format
- Consider direct link upload

### "Processing Error"
- File may be corrupted
- Try re-saving in original application
- Contact support if persistent

## Supported File Formats:

- **Documents:** PDF, EPUB, MOBI
- **Images:** JPEG, PNG (under 1.5MB)
- **Text:** DOC, DOCX (converted to PDF)

## Direct Link Alternative:

If upload continues to fail:
1. Upload file to Google Drive or Dropbox
2. Generate sharing link
3. Use "Direct Link" option in dashboard
4. Paste link instead of uploading file

## Getting Help:

For persistent upload issues, contact support with:
- File format and size
- Browser and operating system
- Error message (if any)
- Steps already attempted

*Updated: July 2025*', 
'Complete troubleshooting guide for file upload issues, including browser compatibility and workarounds.', 
'Technical Support', 
ARRAY['upload', 'files', 'troubleshooting', 'browser'], 
'published', true, '2025-06-25T16:00:00Z'),

('Review Velocity and Amazon Compliance', 
'# Managing Review Velocity for Amazon Compliance

## What is Review Velocity?

Review velocity refers to the rate at which reviews appear on your Amazon listing. Amazon''s algorithm monitors this to detect unnatural patterns that might indicate review manipulation.

## Safe Velocity Guidelines:

### New Products (0-30 days):
- **Week 1:** Maximum 2-3 reviews per day
- **Week 2:** Can increase to 4-5 if responses are organic
- **Week 3-4:** Maintain steady flow, avoid sudden spikes

### Established Products (30+ days):
- **Daily limit:** 3-7 reviews depending on sales volume
- **Weekly pattern:** Vary timing to appear natural
- **Monthly cap:** Should align with your sales metrics

## Red Flags to Avoid:

### Velocity Spikes:
- 10+ reviews in 24 hours (especially for new products)
- All reviews posted at similar times
- Reviews with identical language patterns

### Timing Patterns:
- All reviews on weekdays only
- Reviews every few hours consistently
- Batch posting on specific dates

## Amazon''s Suppression Triggers:

**What happens:** Amazon may temporarily hide your listing from search results or remove reviews if velocity appears unnatural.

**Duration:** Typically 7-14 days for algorithm review

**Recovery:** Slow, organic review acquisition to rebuild trust

## Best Practices:

### Stagger Your Outreach:
- Send review requests across different days
- Vary email timing (morning, afternoon, evening)
- Space campaigns at least 48-72 hours apart

### Natural Patterns:
- Allow for weekend gaps in reviews
- Expect some days with no reviews
- Mix of review lengths and detail levels

### Quality Over Speed:
- Focus on detailed, authentic reviews
- Encourage readers to take their time
- Prefer fewer high-quality reviews over many generic ones

## Recovery from Velocity Issues:

If your listing gets suppressed:
1. **Stop all review requests immediately**
2. **Wait 7-14 days for algorithm reset**
3. **Resume with very conservative pacing**
4. **Focus on organic sales and reviews**
5. **Contact Amazon Seller Support if needed**

## Monitoring Tools:

Track your review patterns:
- Review dates and times
- Days between reviews
- Review content similarity
- Sales-to-review ratio

## Working with ReviewProMax:

Our platform includes velocity monitoring to help you stay compliant:
- Automatic pacing recommendations
- Velocity warning alerts
- Campaign spacing suggestions
- Compliance tracking dashboard

Remember: Sustainable, long-term success requires patience and compliance with Amazon''s evolving policies.

*Updated: July 2025*', 
'Essential guide to managing review velocity while staying compliant with Amazon''s terms of service.', 
'Amazon Compliance', 
ARRAY['velocity', 'amazon', 'compliance', 'tos'], 
'published', true, '2025-07-05T12:00:00Z'),

('International Amazon Marketplace Guide', 
'# Expanding to Global Amazon Marketplaces

## Regional Marketplace Differences:

### Amazon.com (United States):
- Most permissive review policies
- Largest reader base
- Standard compliance requirements

### Amazon.co.uk (United Kingdom):
- Stricter enforcement of review policies
- Requires UK-specific reviewer targeting
- Different currency and tax implications

### Amazon.de (Germany):
- Very strict review policy enforcement
- Language requirements for reviewers
- GDPR compliance considerations

### Amazon.ca (Canada):
- Similar to US policies but separate enforcement
- Smaller reviewer pool
- Currency conversion considerations

## Cross-Border Review Strategy:

### DO:
- Use localized request templates for each region
- Target reviewers within specific marketplaces
- Respect local language preferences
- Follow regional compliance guidelines

### DON''T:
- Redirect reviewers between Amazon sites
- Use the same reviewer for multiple regions
- Cross-link between marketplace listings
- Ignore local tax and legal requirements

## Regional Compliance Tips:

### United Kingdom:
- Focus on British English spelling and terminology
- Target readers familiar with UK market
- Avoid US-specific cultural references

### Germany:
- Extremely strict about off-site review solicitation
- Prefer organic, on-platform review generation
- Consider German language requirements

### Canada:
- Similar to US but treat as separate marketplace
- French language considerations for Quebec
- Different shipping and logistics

## Setting Up Global Campaigns:

1. **Research local regulations** for each target country
2. **Create marketplace-specific listings** with appropriate content
3. **Develop localized email templates** in native languages
4. **Build region-appropriate reviewer networks**
5. **Monitor each marketplace separately** for compliance

## Common Mistakes:

- Using same reviewer for US and UK Amazon
- Cross-posting reviews between marketplaces
- Ignoring local language and cultural differences
- Assuming same velocity limits apply globally

## ReviewProMax Global Support:

Our platform offers:
- Marketplace-specific campaign creation
- Localized reviewer matching
- Regional compliance monitoring
- Multi-currency billing support

## Tax and Legal Considerations:

- Each marketplace may have different tax implications
- Review local advertising and promotion laws
- Consider GDPR requirements for EU markets
- Understand currency conversion impacts

Remember: Treat each Amazon marketplace as a completely separate platform with its own rules, audience, and requirements.

*Updated: July 2025*', 
'Complete guide to expanding your review campaigns across international Amazon marketplaces.', 
'International Markets', 
ARRAY['international', 'global', 'marketplace', 'compliance'], 
'published', false, '2025-06-30T08:00:00Z');

-- Add more realistic community posts covering the major incidents and discussions
INSERT INTO public.community_posts (title, content, category, tags, author_id, created_at, upvotes, view_count, status) VALUES

('🔥 Email Delay Crisis - How Did Everyone Handle It?', 
'So that massive email delay in late June was brutal for my launch. Verification emails took HOURS, and some never came at all. I had to completely reschedule my promotion timeline.

Did anyone else get completely derailed by this? How did you adapt your launch strategy when the platform emails weren''t working?

Support said it was a Resend SMTP issue, but man... losing 3 days of momentum during a book launch is painful. At least they''ve added backup systems now.

**What I learned:**
- Always have backup communication with your ARC readers
- Don''t schedule tight launch windows around verification steps  
- Platform reliability matters more than I thought

Anyone have tips for launch contingency planning?', 
'General Questions', 
ARRAY['email-delays', 'platform-issues', 'launch-strategy'], 
'11111111-1111-1111-1111-111111111111',
'2025-07-03T09:30:00Z',
23, 156, 'published'),

('📉 Dashboard Went Blank - Anyone Else Freak Out?', 
'Back in May my dashboard showed "No Active Listings" even though I had 3 campaigns running. Thought I got hacked or something! 

Turns out it was that Supabase sync bug affecting everyone. But for 2 days I was convinced all my campaigns were lost and almost requested refunds.

**PSA for newbies:** If your dashboard looks broken, check here first before panicking. Platform issues happen, but they get fixed fast.

Support response was great once I contacted them. Just wish there was better status communication when these things happen.', 
'Bug Reports', 
ARRAY['dashboard', 'sync-issues', 'platform-bugs'], 
'22222222-2222-2222-2222-222222222222',
'2025-05-28T14:20:00Z',
18, 89, 'published'),

('💳 PayPal Invoice Mix-Up - Tax Season Nightmare', 
'In April my PayPal invoices were showing my business partner''s name instead of mine. Didn''t catch it until tax prep time and had to get everything re-issued.

Apparently the PayPal integration was pulling cached names instead of account settings. Support fixed it quickly, but lesson learned: **always check your invoices immediately**.

They''ve added manual override fields now, which is great. Just sharing in case anyone else missed this during the chaos.', 
'General Questions', 
ARRAY['paypal', 'invoices', 'billing', 'taxes'], 
'33333333-3333-3333-3333-333333333333',
'2025-04-19T11:45:00Z',
12, 67, 'published'),

('⚡ 2FA Lockout Horror Story', 
'Got completely locked out of my account in March after enabling two-factor auth. The SMS codes never came and I couldn''t get back in during an active campaign.

Support had to manually reset everything. Turns out there was a Twilio integration bug affecting the whole platform. Now they use email as backup which is much more reliable.

**Tip:** Test your 2FA setup before running important campaigns. And maybe stick with email verification until SMS is 100% stable.', 
'Bug Reports', 
ARRAY['2fa', 'authentication', 'lockout', 'security'], 
'44444444-4444-4444-4444-444444444444',
'2025-03-12T16:10:00Z',
15, 92, 'published'),

('🐌 February Review Delays - The Mystery Solved', 
'Had the weirdest thing happen in February. Readers accepted my book but then... silence for 9 days. Then suddenly 3 reviews appeared in one morning.

Support found a bug where the notification system wasn''t telling readers they''d been assigned books. So they had no idea they were supposed to review anything!

Kinda funny in retrospect, but at the time I thought my book was just terrible and everyone was ghosting me. 😅

Anyone else affected by this? Glad it''s fixed now.', 
'Bug Reports', 
ARRAY['review-delays', 'notifications', 'queue-bug'], 
'55555555-5555-5555-5555-555555555555',
'2025-02-27T13:40:00Z',
20, 134, 'published'),

('📈 SEO Impact of Review Keywords - Real Results', 
'Been testing whether reviews mentioning genre keywords actually help with Amazon search rankings. My results:

**Book A:** Reviews that mentioned "sci-fi thriller" = ranked #3 for that search term
**Book B:** Generic reviews = barely showed up in genre searches

It''s not just about star ratings. The actual content of reviews seems to reinforce your book''s category placement.

**Pro tip:** Don''t tell reviewers what to say, but write your book description so they naturally use the keywords you want. Works way better than being pushy about it.', 
'SEO', 
ARRAY['seo', 'keywords', 'amazon-ranking', 'reviews'], 
'66666666-6666-6666-6666-666666666666',
'2025-07-17T10:15:00Z',
28, 178, 'published'),

('⚠️ Duplicate Review Takedown - July 2025 Update', 
'Amazon just removed 4 of my reviews because the same person left nearly identical text across my trilogy. Didn''t know this was against their new policies!

Seems like they rolled out an update in early July that cross-checks review content for duplicates. One of my best reviewers got all their feedback flagged.

**New rule:** Each review needs to be genuinely unique, even from the same person reviewing a series. No more copy-paste endorsements.

Anyone else get hit by this? How are you handling series reviews now?', 
'General Questions', 
ARRAY['duplicate-reviews', 'amazon-policies', 'series-books'], 
'77777777-7777-7777-7777-777777777777',
'2025-07-11T08:30:00Z',
31, 203, 'published'),

('🚀 A/B Testing Email Subject Lines - My Results', 
'Ran some tests on review request subject lines. Here''s what worked:

**Winners:**
- "Your early access copy is waiting" (42% open rate)
- "Help shape this story?" (38% open rate)  
- "Preview copy available" (35% open rate)

**Losers:**
- "Please review my book" (12% open rate)
- "Free book for honest review" (8% open rate - probably flagged as spam)
- "[Book Title] Now Available" (15% open rate)

Keep them short, mobile-friendly, and focused on the reader''s benefit. Avoid anything that sounds like a transaction.', 
'Tips', 
ARRAY['ab-testing', 'email-optimization', 'subject-lines'], 
'88888888-8888-8888-8888-888888888888',
'2025-07-17T14:45:00Z',
35, 267, 'published'),

('🎯 Review Velocity Killed My Search Ranking', 
'Got 11 reviews in 48 hours during my launch and my book disappeared from page 1 searches for a week. Amazon''s algorithm flagged the velocity as suspicious.

**What I learned:**
- Even legitimate reviews can trigger suppression if they come too fast
- Amazon prefers steady, organic-looking growth
- Recovery takes time and patience

Now I use the platform''s pacing recommendations and space everything out. Much better results with 2-3 reviews per day max.

Anyone else learn this lesson the hard way?', 
'General Questions', 
ARRAY['review-velocity', 'amazon-algorithm', 'search-suppression'], 
'99999999-9999-9999-9999-999999999999',
'2025-07-18T11:20:00Z',
26, 189, 'published'),

('📧 Email Templates That Actually Work', 
'After testing dozens of variations, here are my highest-converting review request templates:

**Template 1: The Story Shaper**
"Hi [Name], want to help shape the future of this book? As an early reader, your honest impressions could guide other book lovers toward their next favorite read."

**Template 2: The Advance Access**  
"Your advance copy of [Title] is ready. No pressure, but if you enjoy it, other readers would love to hear your thoughts."

**Template 3: The Community Helper**
"You''re part of a select group getting early access to [Title]. If it resonates with you, consider sharing what made it special."

All avoid the words "review," "rating," or anything transactional. Focus on the reader''s value and community impact.', 
'Tips', 
ARRAY['email-templates', 'copywriting', 'conversion'], 
'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
'2025-07-13T16:00:00Z',
42, 312, 'published');

-- Add replies to create realistic threaded discussions
INSERT INTO public.community_replies (post_id, content, author_id, is_support_reply, created_at, upvotes) VALUES

-- Replies to Email Delay Crisis post
((SELECT id FROM community_posts WHERE title LIKE '%Email Delay Crisis%'), 
'That June email crisis hit my launch too! Lost 3 days of momentum waiting for verification links. I ended up having to email my ARC readers directly with dropbox links as a backup.

Support was great about adding credits for affected campaigns, but yeah - the timing was brutal. Now I always build in buffer days for any platform-dependent steps.', 
'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', false, '2025-07-03T11:15:00Z', 8),

((SELECT id FROM community_posts WHERE title LIKE '%Email Delay Crisis%'), 
'Thanks for flagging this! The June 25-27 SMTP crisis was definitely our worst outage. We''ve since added:
- Postmark fallback for all critical emails
- Real-time status monitoring at /status
- Manual resend options in your dashboard

If your campaign was affected and you didn''t receive compensation, please DM us with your campaign details.', 
'00000000-0000-0000-0000-000000000099', true, '2025-07-03T12:30:00Z', 15),

-- Replies to Dashboard Blank post
((SELECT id FROM community_posts WHERE title LIKE '%Dashboard Went Blank%'), 
'I thought I was going crazy! Same thing happened to me - logged in and everything was just... gone. Refreshed like 20 times before realizing it wasn''t just me.

The auto-repair system they added is really nice though. Dashboard issues now fix themselves within minutes instead of hours.', 
'cccccccc-cccc-cccc-cccc-cccccccccccc', false, '2025-05-28T15:45:00Z', 6),

((SELECT id FROM community_posts WHERE title LIKE '%Dashboard Went Blank%'), 
'That Supabase sync issue was a nightmare for everyone. Sorry you experienced the panic! We''ve added:
- Session auto-repair every 30 seconds
- Visual warnings when data might be out of sync  
- Better error messages explaining what''s happening

Also working on a status banner that appears during any platform issues.', 
'00000000-0000-0000-0000-000000000099', true, '2025-05-28T16:20:00Z', 12),

-- Replies to PayPal Invoice Mix-Up post
((SELECT id FROM community_posts WHERE title LIKE '%PayPal Invoice Mix-Up%'), 
'Yes! This happened to me too in April. My accountant was so confused when the invoice showed my co-author''s name instead of my business entity.

The manual override in Billing Settings works perfectly now. You can set your preferred name and it sticks for all future invoices.', 
'dddddddd-dddd-dddd-dddd-dddddddddddd', false, '2025-04-19T13:10:00Z', 4),

-- Replies to 2FA Lockout post
((SELECT id FROM community_posts WHERE title LIKE '%2FA Lockout%'), 
'This was terrifying when it happened! I enable 2FA on everything for security, but getting locked out during an active campaign made me reconsider.

The email backup they added is much more reliable. SMS can be hit-or-miss depending on your carrier anyway.', 
'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', false, '2025-03-12T17:30:00Z', 7),

-- Replies to February Review Delays post
((SELECT id FROM community_posts WHERE title LIKE '%February Review Delays%'), 
'OMG yes! I had the same thing happen. Thought my book was so bad that people were too embarrassed to leave reviews. 😂

The queue rebuild they did really improved things. Now readers get immediate notifications when they''re assigned, plus reminder emails if they don''t start within 24 hours.', 
'ffffffff-ffff-ffff-ffff-ffffffffffff', false, '2025-02-27T14:55:00Z', 9),

-- Replies to SEO Impact post
((SELECT id FROM community_posts WHERE title LIKE '%SEO Impact%'), 
'This is fascinating data! I''ve been wondering about this for months. Do you think it matters if the keywords appear early in the review or can they be anywhere?

I''m going to start tracking which of my books rank better for specific search terms and see if there''s a pattern with review content.', 
'12121212-1212-1212-1212-121212121212', false, '2025-07-17T12:30:00Z', 11),

((SELECT id FROM community_posts WHERE title LIKE '%SEO Impact%'), 
'Great analysis! While Amazon doesn''t officially confirm this, we''ve seen similar patterns in our data. Reviews that naturally include genre-specific language do seem to help with categorization.

The key is making it organic - write compelling book descriptions that naturally guide how readers think about and describe your work.', 
'00000000-0000-0000-0000-000000000099', true, '2025-07-17T13:45:00Z', 18),

-- Replies to Duplicate Review Takedown post
((SELECT id FROM community_posts WHERE title LIKE '%Duplicate Review Takedown%'), 
'This just happened to me too! Lost 3 reviews from the same person who reviewed my whole series. They were genuinely different thoughts but apparently too similar in structure.

Now I''m more careful about giving reviewers different discussion prompts for each book in a series. Seems to help them write more unique responses.', 
'13131313-1313-1313-1313-131313131313', false, '2025-07-11T10:15:00Z', 14),

-- Replies to A/B Testing Subject Lines post
((SELECT id FROM community_posts WHERE title LIKE '%A/B Testing Email Subject%'), 
'This is incredibly helpful! I''ve been using generic subject lines and wondering why my open rates were so low. "Please review my book" is basically what I was sending. 🤦‍♀️

Going to test "Your early access copy is waiting" on my next batch. Thanks for sharing the data!', 
'14141414-1414-1414-1414-141414141414', false, '2025-07-17T16:20:00Z', 16),

((SELECT id FROM community_posts WHERE title LIKE '%A/B Testing Email Subject%'), 
'Excellent testing methodology! Your results align perfectly with what we see in our A/B Testing Playbook. 

The key insight is that readers respond to value and exclusivity, not requests or obligations. "Help shape" and "early access" tap into that psychology perfectly.', 
'00000000-0000-0000-0000-000000000099', true, '2025-07-17T17:10:00Z', 22),

-- Replies to Review Velocity post
((SELECT id FROM community_posts WHERE title LIKE '%Review Velocity Killed%'), 
'Same exact thing happened to me during Prime Week! Got excited about the momentum and then watched my ranking plummet. 

Amazon''s algorithm definitely treats rapid review acquisition as suspicious, even when it''s totally legitimate. The Velocity Vortex pacing guide has been a lifesaver for avoiding this.', 
'15151515-1515-1515-1515-151515151515', false, '2025-07-18T13:45:00Z', 12),

-- Replies to Email Templates post
((SELECT id FROM community_posts WHERE title LIKE '%Email Templates That Actually Work%'), 
'The "Story Shaper" approach is brilliant! I love how it positions the reader as having influence over the book''s future rather than just asking for a favor.

Definitely stealing "if it resonates with you" - that''s so much better than "if you liked it please review."', 
'16161616-1616-1616-1616-161616161616', false, '2025-07-13T17:30:00Z', 19),

((SELECT id FROM community_posts WHERE title LIKE '%Email Templates That Actually Work%'), 
'Fantastic templates! These perfectly demonstrate why our A/B Playbook emphasizes reader-centric language. You''ve nailed the psychology of making reviewers feel valued rather than used.

Mind if we feature these in our next community guide? (With credit of course!)', 
'00000000-0000-0000-0000-000000000099', true, '2025-07-13T18:15:00Z', 25);