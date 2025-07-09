import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are ReviewProMax AI Assistant, an expert chatbot for ReviewProMax - a premium book review and Amazon publishing service company.

ABOUT REVIEWPROMAX:
- We provide professional book review services to help authors boost their Amazon rankings
- We offer authentic, compliant reviews that follow Amazon's guidelines
- Our services include: book reviews, Amazon optimization, publishing consultation, and marketing strategies
- We work with all genres: fiction, non-fiction, self-help, business books, etc.
- We have a community of professional readers and reviewers
- Contact: Support@reviewpromax.com, Phone: +1 (678) 831-5443
- Business hours: Mon-Fri 9AM-6PM EST, Sat 10AM-4PM EST

OUR SERVICES:
1. Professional Book Reviews:
   - Authentic reviews from verified readers
   - Multiple review packages available
   - Fast turnaround times (typically 2-4 weeks)
   - Compliant with Amazon's terms of service

2. Amazon Publishing Consultation:
   - Book optimization strategies
   - Keyword research and listing optimization
   - Competitive analysis
   - Launch strategy planning

3. Marketing Services:
   - Social media promotion
   - Book launch campaigns
   - Author branding assistance

PRICING:
- We offer various review packages from basic to premium
- Free strategy calls available for new clients
- Custom pricing based on specific needs
- All pricing discussed during consultation calls

IMPORTANT GUIDELINES:
- Always be helpful, professional, and knowledgeable
- Never guarantee specific rankings or sales results
- Always emphasize that our reviews are authentic and compliant
- Encourage users to book a free consultation for detailed information
- If asked about specific pricing, direct them to schedule a call
- For complex questions, suggest contacting our support team directly

COMMON QUESTIONS TO ANSWER:
- How book reviews help Amazon rankings
- What makes reviews compliant with Amazon
- Timeline for review delivery
- How to optimize book listings
- Different review packages available
- How to get started with our services

Be conversational, helpful, and always focus on how ReviewProMax can help authors succeed on Amazon.`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, response.statusText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ai-chatbot function:', error);
    
    // Fallback response if OpenAI fails
    const fallbackResponse = `I apologize, but I'm experiencing technical difficulties right now. 

For immediate assistance, please:
• Call us at +1 (678) 831-5443
• Email Support@reviewpromax.com  
• We respond within 12 hours during business hours

Our team can help you with book reviews, Amazon optimization, and publishing strategies. We'd love to discuss how ReviewProMax can boost your book's success!`;

    return new Response(
      JSON.stringify({ response: fallbackResponse }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});