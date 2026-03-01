import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response';

// AI-powered chatbot using Google Gemini
export const chatbotResponse = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return errorResponse(res, 'Message is required', 400);
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      console.log('⚠️ GEMINI_API_KEY not found, using fallback responses');
      // Fallback to rule-based if no API key
      return fallbackResponse(res, message);
    }

    console.log('✅ Using Gemini AI for response');

    // System prompt to guide Gemini
    const systemPrompt = `You are an AI assistant for the ASTU (Adama Science and Technology University) Smart Complaint System. 

Your role is to help students, staff, and administrators understand and use the complaint management system effectively.

System Information:
- Categories: Dormitory, Laboratory, Internet, Classroom, Library
- User Roles: Student (submit complaints), Staff (manage complaints), Admin (full access)
- Ticket Status: OPEN, IN_PROGRESS, RESOLVED
- Priority Levels: LOW, MEDIUM, HIGH
- Features: Create tickets, track status, file attachments, notifications, remarks

Guidelines:
- Be helpful, friendly, and professional
- Keep responses concise (2-3 paragraphs max)
- Use bullet points for lists
- Focus on ASTU complaint system features
- If asked about unrelated topics, politely redirect to complaint system topics
- Use emojis sparingly for better readability

Answer the user's question:`;

    // Call Gemini API (using gemini-1.5-flash-latest model)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nUser: ${message}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        })
      }
    );

    if (!response.ok) {
      console.error('Gemini API error:', response.status, response.statusText);
      const errorData = await response.text();
      console.error('Error details:', errorData);
      return fallbackResponse(res, message);
    }

    const data = await response.json() as any;
    
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      console.error('Invalid Gemini response structure:', JSON.stringify(data));
      return fallbackResponse(res, message);
    }
    
    const aiResponse = data.candidates[0].content.parts[0].text;

    return successResponse(res, { response: aiResponse }, 'Response generated successfully');
  } catch (error) {
    console.error('Chatbot error:', error);
    return fallbackResponse(res, req.body.message);
  }
};

// Fallback rule-based responses if Gemini fails
function fallbackResponse(res: Response, message: string) {
  const userMessage = message.toLowerCase().trim();
  let response = '';

  if (/^(hi|hello|hey|greetings)/i.test(userMessage)) {
    response = 'Hello! 👋 I\'m your ASTU Complaint Assistant. I can help you with:\n\n• Submitting complaints\n• Checking ticket status\n• Understanding categories\n• System features\n\nWhat would you like to know?';
  }
  else if (/how.*(submit|create|file|make).*(complaint|ticket|issue)/i.test(userMessage)) {
    response = 'To submit a complaint:\n\n1. Click "Create Ticket" in the sidebar\n2. Fill in title and description\n3. Select category (Dormitory, Lab, Internet, etc.)\n4. Choose priority level\n5. Add location (optional)\n6. Click "Submit Complaint"\n\nYou\'ll get a unique ticket ID!';
  }
  else if (/how.*(check|see|view|track).*(status|progress)/i.test(userMessage)) {
    response = 'To check your complaint status:\n\n1. Go to "My Tickets"\n2. View all your complaints\n3. Status meanings:\n   • OPEN - Just submitted\n   • IN_PROGRESS - Being worked on\n   • RESOLVED - Completed\n\nClick any ticket for details!';
  }
  else if (/what.*(categories|types)/i.test(userMessage) || /categories/i.test(userMessage)) {
    response = 'Available categories:\n\n🏠 Dormitory - Room issues\n🔬 Laboratory - Lab equipment\n🌐 Internet - Network issues\n🏫 Classroom - Facility problems\n📚 Library - Library services\n\nChoose the best match for your complaint!';
  }
  else {
    response = 'I can help you with:\n\n• Submitting complaints\n• Checking status\n• Understanding categories\n• System features\n\nCould you rephrase your question?';
  }

  return successResponse(res, { response }, 'Response generated successfully');
}
