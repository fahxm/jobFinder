

import { AI_CONFIG } from './config';

export const generateCareerRoadmap = async (currentRole, userProfile) => {
    const prompt = `You are a career advisor. Generate a realistic 5-year career progression roadmap for someone who is currently: "${currentRole}".

User's skills: ${userProfile?.skills?.join(', ') || 'Not specified'}
Qualification: ${userProfile?.qualification || 'Not specified'}
Experience: ${userProfile?.experience || '0'} years

Provide exactly 3 milestones in JSON format:
[
  {
    "year": "Year 1-2: [Stage]",
    "role": "[Job Title]",
    "desc": "[What they'll be doing]",
    "skills": ["Skill1", "Skill2", "Skill3", "Skill4"]
  },
  ... (2 more milestones for years 3-4 and year 5)
]

Make it realistic, specific to their current role, and actionable.`;

    try {
        const response = await fetch(AI_CONFIG.GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AI_CONFIG.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: AI_CONFIG.MODEL,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 1500
            })
        });

        if (!response.ok) throw new Error(`AI API Error: ${response.status}`);

        const data = await response.json();
        const jsonMatch = data.choices[0].message.content.match(/\[\s*{[\s\S]*}\s*\]/);
        if (!jsonMatch) throw new Error("Could not parse AI response as JSON");

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error("Roadmap generation error:", error);
        throw error;
    }
};
