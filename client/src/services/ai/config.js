

export const AI_CONFIG = {
    GROQ_API_KEY: import.meta.env.VITE_GROQ_API_KEY,
    GROQ_API_URL: 'https://api.groq.com/openai/v1/chat/completions',
    MODEL: 'llama-3.3-70b-versatile'
};

console.log("Groq API Key Status:", AI_CONFIG.GROQ_API_KEY ? "Loaded" : "Missing");
if (!AI_CONFIG.GROQ_API_KEY) {
    console.error("CRITICAL: VITE_GROQ_API_KEY is not defined in import.meta.env");
    setTimeout(() => alert("AI API Key is missing! Please restart your 'npm run dev' terminal for it to load the .env file properly."), 1000);
}

export const commonSkills = [
    "React", "JavaScript", "Python", "Java", "C++", "C#", "SQL", "NoSQL", "MongoDB", "PostgreSQL",
    "AWS", "Azure", "Docker", "Kubernetes", "TypeScript", "Node.js", "Express", "Angular", "Vue",
    "Tailwind", "Bootstrap", "Git", "Machine Learning", "Data Analysis", "Project Management",
    "Agile", "Scrum", "Communication", "Problem Solving", "Linux", "Firebase", "Redux", "API"
];
