import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useSampleData = () => {
  const { user } = useAuth();

  const populateSampleCommunityData = async () => {
    if (!user) return;

    // Check if community posts already exist
    const { data: existingPosts } = await supabase
      .from('community_posts')
      .select('id')
      .limit(1);

    // Only populate if no posts exist
    if (existingPosts && existingPosts.length > 0) return;

    const samplePosts = [
      {
        title: '🚀 Success Story: 12 Verified Reviews in 3 Weeks!',
        content: `Hey everyone! Just wanted to share a quick win – I started using ReviewProMax late March, and by mid-April I had 12 verified Amazon reviews on my debut novel. The readers seemed genuinely engaged and even quoted lines from the book in their feedback. Huge thanks to the community here!

The quality of reviews was amazing - not just star ratings but actual thoughtful feedback that helped me understand what resonated with readers. Several mentioned specific scenes and character development, which tells me they actually read and engaged with the story.

For anyone hesitating about trying this platform, I'd say go for it. The process was smooth and the results speak for themselves.`,
        category: 'Success Stories',
        tags: ['success', 'reviews', 'debut-novel', 'amazon'],
        created_at: '2025-04-22T14:30:00Z',
        upvotes: 8,
        view_count: 45
      },
      {
        title: '⚠️ Login Loop After Email Verification',
        content: `After clicking the email verification link, it just loops back to the login screen without logging me in. Anyone else experiencing this? I'm using Chrome on Windows 11.

I've tried:
- Clicking the link multiple times
- Copy/pasting the URL
- Waiting and trying again later

Not sure what else to try. The verification email came through fine, but the actual login isn't working.`,
        category: 'Bug Reports',
        tags: ['login', 'verification', 'bug', 'chrome'],
        created_at: '2025-05-03T09:15:00Z',
        upvotes: 3,
        view_count: 28
      },
      {
        title: '🌊 Feature Suggestion: Genre-Specific Reviewers',
        content: `Would love to target reviewers by genre. My space opera got reviews from general fiction readers, but sci-fi fans might engage more deeply with the world-building and technical aspects.

I think having genre-specific reviewer pools would help both authors and readers:
- Authors get more relevant feedback
- Readers get books they're actually interested in
- Reviews would be more detailed and helpful

Has anyone else noticed this genre mismatch issue? Would love to hear your experiences.`,
        category: 'Suggestions',
        tags: ['feature-request', 'genre', 'targeting', 'sci-fi'],
        created_at: '2025-06-07T16:45:00Z',
        upvotes: 12,
        view_count: 67
      },
      {
        title: '🎓 Guide: How I Got 30 Reviews Without Breaking Amazon TOS',
        content: `Here's my complete strategy for using ReviewProMax effectively while staying within Amazon's guidelines:

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

Happy to answer questions about my specific approach!`,
        category: 'Tips',
        tags: ['guide', 'amazon-tos', 'strategy', 'bulk-orders'],
        created_at: '2025-05-30T13:45:00Z',
        upvotes: 25,
        view_count: 156
      },
      {
        title: '💡 Tips: How I Improved Review Speed',
        content: `Just sharing what worked for me to get faster reviews:

## Before changes: 1 review per week
## After optimization: 4 reviews in one week

## What I changed:
1. **Book description:** Made it sound like a reader recommendation instead of back-cover marketing copy
2. **Genre tags:** Got more specific (changed "fiction" to "psychological thriller")  
3. **Target audience:** Clearly stated who would love this book
4. **Author note:** Added personal context about why I wrote it

The key insight: write for readers browsing for their next great read, not for bookstore customers scanning covers.`,
        category: 'Tips',
        tags: ['optimization', 'review-speed', 'book-description'],
        created_at: '2025-05-22T10:15:00Z',
        upvotes: 22,
        view_count: 134
      }
    ];

    // Insert sample posts with the current user as author
    for (const post of samplePosts) {
      const { error } = await supabase
        .from('community_posts')
        .insert({
          ...post,
          author_id: user.id
        });
      
      if (error) {
        console.error('Error inserting sample post:', error);
      }
    }
  };

  return { populateSampleCommunityData };
};