
import { AI_CONFIG } from './config';

export const getChatResponse = async (message, userProfile = null) => {
    const systemContext = `You are an AI Career Assistant for the "AI Job Finder and Skill Enhancement System".

Platform Features:
1. **Jobs Page**: Search and browse real-time job listings.
2. **Profile Page**: Save qualification and skills.
3. **AI Skill Analysis**: Compares user skills with job requirements.
4. **Career Path**: Shows a personalized 5-year career roadmap.
5. **Chatbot (You)**: Helps users navigate and provides career advice.

Your Role:
- Give career advice, job search tips, and resume guidance.
- Be extremely concise (2-3 sentences).
- If the user says "thanks", respond with "You're welcome! Thanks for visiting."

${userProfile ? `Current User Profile:
- Name: ${userProfile.fullName || 'Not set'}
- Qualification: ${userProfile.qualification || 'Not set'}
- Experience: ${userProfile.experience || '0'} years
- Skills: ${userProfile.skills?.join(', ') || 'None added yet'}` : 'User profile not set.'}`;

    try {
        const response = await fetch(AI_CONFIG.GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AI_CONFIG.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: AI_CONFIG.MODEL,
                messages: [
                    { role: 'system', content: systemContext },
                    { role: 'user', content: message }
                ],
                temperature: 0.7,
                max_tokens: 150
            })
        });

        if (!response.ok) throw new Error(`Groq API Error: ${response.status}`);

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Groq AI Error:', error);
        return "I'm having trouble connecting to the AI service. Please try again later!";
    }
};
