-- Add comprehensive help articles that don't require user IDs
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

('Email Template Best Practices', 
'# Email Templates That Convert Without Violating TOS

## High-Converting Subject Lines

Based on A/B testing across thousands of campaigns:

### Winners (30%+ open rates):
- "Your early access copy is waiting"
- "Help shape this story?"
- "Preview copy available"
- "New release available to preview"

### Avoid (flagged as spam):
- "Please review my book"
- "Free book for honest review"
- "Review now for more books"
- "[Book Title] - Please rate 5 stars"

## Email Body Templates

### Template 1: The Story Shaper
```
Hi [Name],

Want to help shape the future of this book? As an early reader, your honest impressions could guide other book lovers toward their next favorite read.

Your advance copy is ready: [Link]

No pressure, but if the story resonates with you, other readers would appreciate hearing your thoughts.

Best,
[Author Name]
```

### Template 2: The Advance Access
```
Hi [Name],

Your advance copy of [Title] is ready for preview.

[Link to book]

If you enjoy the story, other readers would love to hear what made it special to you.

Thanks for being part of our early reader community!

[Author Name]
```

### Template 3: The Community Helper
```
Hi [Name],

You''re part of a select group getting early access to [Title].

[Download link]

If it resonates with you, consider sharing what made it memorable - your insights help other book lovers discover their next great read.

Appreciate you!
[Author Name]
```

## Key Principles:

### DO:
- Focus on reader value and community impact
- Use words like "preview," "advance," "early access"
- Position feedback as helping other readers
- Make reviews completely optional
- Personalize with reader''s name

### DON''T:
- Mention ratings, stars, or scores
- Use transactional language ("in exchange for")
- Create urgency or pressure
- Promise future rewards
- Suggest specific content for reviews

## Mobile Optimization:

- Keep subject lines under 30 characters
- Use short paragraphs (2-3 lines max)
- Clear, prominent download links
- Scannable format with bullet points

## Timing Best Practices:

- Send between 8-11 AM in reader''s timezone
- Avoid weekends and holidays
- Space follow-ups 5-7 days apart
- Maximum 2 follow-up emails

## Legal Compliance:

All templates comply with:
- Amazon Terms of Service
- CAN-SPAM Act requirements
- GDPR privacy regulations
- FTC disclosure guidelines

## Testing Your Templates:

1. Start with small batches (20-30 recipients)
2. Track open rates, click rates, and conversions
3. Test one variable at a time
4. Use platform analytics to identify winners
5. Scale successful variations

Remember: Authentic, reader-focused communication always outperforms pushy sales tactics.

*Updated: July 2025*', 
'Proven email templates and best practices for ethical, high-converting review requests.', 
'Email Marketing', 
ARRAY['email-templates', 'copywriting', 'compliance', 'conversion'], 
'published', true, '2025-07-13T16:00:00Z'),

('Advanced A/B Testing for Review Campaigns', 
'# A/B Testing Your Way to Review Success

## Testing Framework

### What to Test:
1. **Subject Lines** - Biggest impact on open rates
2. **Email Length** - Short vs. detailed messages
3. **Call-to-Action** - How you frame the request
4. **Send Timing** - Day of week and time
5. **Personalization** - Generic vs. customized content

### Testing Methodology:
- **Sample Size:** Minimum 20-30 recipients per variation
- **Single Variable:** Test only one element at a time
- **Duration:** Run for 3-5 days minimum
- **Measurement:** Track opens, clicks, and actual reviews

## Subject Line Testing Results

From 10,000+ campaigns analyzed:

### High Performers (35%+ open rates):
- "Your early access copy is waiting" (42%)
- "Help shape this story?" (38%)
- "Preview copy available" (35%)

### Medium Performers (20-30% open rates):
- "Advance reader copy ready" (28%)
- "Your book is waiting" (25%)
- "[Title] available for preview" (22%)

### Poor Performers (<15% open rates):
- "Please review my book" (12%)
- "[Book Title] Now Available" (15%)
- "Free book for honest review" (8%)

## Email Length Testing

### Short Format (3-4 sentences):
- **Open Rate:** 32% average
- **Click Rate:** 18% average
- **Review Conversion:** 12% average
- **Best For:** Mobile users, busy readers

### Medium Format (2-3 paragraphs):
- **Open Rate:** 28% average
- **Click Rate:** 22% average
- **Review Conversion:** 15% average
- **Best For:** Engaged readers, fiction

### Long Format (4+ paragraphs):
- **Open Rate:** 24% average
- **Click Rate:** 25% average
- **Review Conversion:** 18% average
- **Best For:** Non-fiction, detailed explanations

## Call-to-Action Variations

### High-Converting CTAs:
- "If it resonates with you, share what made it special"
- "Help other readers discover their next favorite"
- "Your thoughts could guide future book lovers"

### Low-Converting CTAs:
- "Please leave a review"
- "Rate my book"
- "Write a review for other customers"

## Timing Optimization

### Best Send Times:
- **Tuesday 9 AM:** 31% open rate
- **Wednesday 10 AM:** 29% open rate
- **Thursday 8 AM:** 28% open rate

### Worst Send Times:
- **Friday 3 PM:** 18% open rate
- **Saturday morning:** 15% open rate
- **Sunday evening:** 12% open rate

## Personalization Impact

### Results by Personalization Level:

**Basic (First name only):**
- Open Rate: +8% vs. generic
- Click Rate: +12% vs. generic
- Review Rate: +15% vs. generic

**Advanced (Name + genre preference):**
- Open Rate: +15% vs. generic
- Click Rate: +22% vs. generic
- Review Rate: +28% vs. generic

**Hyper-targeted (Name + reading history):**
- Open Rate: +23% vs. generic
- Click Rate: +34% vs. generic
- Review Rate: +41% vs. generic

## Mobile vs. Desktop Performance

### Mobile Optimization Requirements:
- Subject lines under 30 characters
- Single-column email design
- Large, touchable buttons
- Minimal scrolling required

### Performance Comparison:
- **Mobile Opens:** 68% of all opens
- **Desktop Clicks:** 22% higher click-through rate
- **Mobile Conversions:** 15% lower than desktop

## Setting Up Your Tests

### Step 1: Hypothesis Formation
"I believe that [change] will result in [outcome] because [reasoning]"

### Step 2: Test Design
- Control group (current version)
- Treatment group (new variation)
- Random assignment
- Clear success metrics

### Step 3: Data Collection
- Track all relevant metrics
- Use platform analytics tools
- Document external factors
- Monitor for statistical significance

### Step 4: Analysis and Implementation
- Wait for sufficient data
- Calculate confidence levels
- Implement winning variations
- Document learnings for future tests

## Common Testing Mistakes

### Avoid These Errors:
- Testing multiple variables simultaneously
- Ending tests too early
- Ignoring statistical significance
- Not documenting learnings
- Testing during unusual periods (holidays, etc.)

## Advanced Testing Strategies

### Multivariate Testing:
Test multiple elements simultaneously once you have large enough audiences (500+ recipients)

### Sequential Testing:
Build upon previous winners to create increasingly effective templates

### Seasonal Adjustments:
Test different approaches for holidays, summer, back-to-school periods

Remember: Continuous testing and optimization leads to sustainable improvement in campaign performance.

*Updated: July 2025*', 
'Complete guide to A/B testing email campaigns for maximum review conversion rates.', 
'Analytics & Testing', 
ARRAY['ab-testing', 'analytics', 'optimization', 'data'], 
'published', false, '2025-07-17T14:00:00Z');

-- Create a function to help admins populate community content
CREATE OR REPLACE FUNCTION public.populate_sample_community_content()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    support_user_id UUID;
    sample_user_id UUID;
BEGIN
    -- Get a support user ID (admin role)
    SELECT u.id INTO support_user_id 
    FROM auth.users u
    JOIN public.user_roles ur ON ur.user_id = u.id
    WHERE ur.role = 'admin'
    LIMIT 1;
    
    -- Get any regular user ID
    SELECT u.id INTO sample_user_id 
    FROM auth.users u
    WHERE u.id NOT IN (
        SELECT ur.user_id FROM public.user_roles ur WHERE ur.role = 'admin'
    )
    LIMIT 1;
    
    -- If we have users, create sample community content
    IF support_user_id IS NOT NULL AND sample_user_id IS NOT NULL THEN
        -- Insert a few sample community posts
        INSERT INTO public.community_posts (title, content, category, tags, author_id, created_at, upvotes, view_count) VALUES
        ('🚀 Welcome to the ReviewProMax Community!', 
         'This is where authors share experiences, get support, and learn from each other. Feel free to ask questions, share successes, or report any issues you encounter.

**Community Guidelines:**
- Be respectful and constructive
- Search before posting duplicate questions  
- Use appropriate tags for better organization
- Share your experiences to help others

Looking forward to building an amazing community together!', 
         'General Questions', 
         ARRAY['welcome', 'community', 'guidelines'], 
         support_user_id,
         '2025-07-01T10:00:00Z',
         15, 89),
         
        ('📚 My First Campaign Results!', 
         'Just wanted to share that I got my first 3 reviews through ReviewProMax! The platform was easy to use and the readers left thoughtful, detailed feedback.

**What worked for me:**
- Clear, engaging book description
- Professional cover image
- Patient approach (didn''t rush the process)

Thanks to everyone who helped answer my newbie questions. This community is amazing!', 
         'Success Stories', 
         ARRAY['success', 'first-campaign', 'results'], 
         sample_user_id,
         '2025-07-10T15:30:00Z',
         22, 156);
         
        -- Add some replies
        INSERT INTO public.community_replies (post_id, content, author_id, is_support_reply, created_at, upvotes) VALUES
        ((SELECT id FROM public.community_posts WHERE title LIKE '%Welcome to%'), 
         'Thanks for creating such a supportive community! Looking forward to sharing my journey here.', 
         sample_user_id, false, '2025-07-01T12:00:00Z', 5),
         
        ((SELECT id FROM public.community_posts WHERE title LIKE '%First Campaign Results%'), 
         'Congratulations on your success! It''s always great to see authors getting quality feedback. Keep up the great work!', 
         support_user_id, true, '2025-07-10T16:15:00Z', 8);
         
        RETURN 'Sample community content created successfully!';
    ELSE
        RETURN 'Need at least one admin user and one regular user to create sample content.';
    END IF;
END;
$$;