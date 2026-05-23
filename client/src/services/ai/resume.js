
import { AI_CONFIG } from './config';

export const generateATSResume = async (userDetails) => {
    const prompt = `You are an expert resume writer specializing in ATS-friendly resumes. 
    Format a professional resume based on the following user details.
    
    GUIDELINES:
    1. Use a single-column layout using standard headings (Contact Info, Summary, Skills, Work Experience, Education, Projects, Certifications, Languages).
    2. Rewrite work experience and projects as impact-oriented bullet points using action verbs (e.g., "Developed...", "Optimized...", "Led...").
    3. Ensure keywords relevant to their industry are included naturally.
    4. If a field is empty, do not include that section.
    
    USER DETAILS:
    - Contact: ${JSON.stringify(userDetails.contact || {})}
    - Summary: ${userDetails.summary || 'Not provided'}
    - Skills: ${userDetails.skills?.join(', ') || 'Not provided'}
    - Education: ${JSON.stringify(userDetails.education || [])}
    - Work Experience: ${JSON.stringify(userDetails.workExperience || [])}
    - Projects: ${JSON.stringify(userDetails.projects || [])}
    - Certifications: ${userDetails.certifications || 'Not provided'}
    - Languages: ${userDetails.languages || 'Not provided'}
    
    OUTPUT FORMAT:
    Return a clean, structured Markdown format that is easy to read.`;

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
                temperature: 0.6,
                max_tokens: 2500
            })
        });

        if (!response.ok) throw new Error(`AI Resume API Error: ${response.status}`);

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Resume generation error:", error);
        throw error;
    }
};

export const parseResumeForProfile = async (resumeText) => {
    const prompt = `You are an expert AI recruiter. Analyze the following resume text and extract key information to fill out a user profile.

    Extract the following fields:
    1. fullName (string): The full name of the user.
    2. qualification (string): The highest or most prominent degree/qualification (e.g., "B.Tech Computer Science").
    3. experience (number): The total years of experience as a number (e.g., 2.5). If not explicitly stated, estimate based on work history dates. Return 0 if no experience.
    4. skills (array of strings): A list of technical and soft skills (e.g., ["React", "Node.js", "Leadership"]).
    5. resumeSummary (string): A brief, professional summary (2-3 sentences) describing their career highlights and goals.

    Return EXACTLY a valid JSON object with these keys. Ensure no markdown formatting or extra text is included in your response, just the raw JSON object.

    RESUME TEXT:
    ${resumeText}
    `;

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
                temperature: 0.2, 
                max_tokens: 1500,
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) throw new Error(`AI Resume Parsing Error: ${response.status}`);

        const data = await response.json();
        const content = data.choices[0].message.content;
        return JSON.parse(content);
    } catch (error) {
        console.error("Resume parsing error:", error);
        throw error;
    }
};
