
import { commonSkills } from './config';

export const analyzeSkills = async (userSkills, jobContext, userExperience = 0) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const userSkillsLower = userSkills.map(s => s.toLowerCase());

            let requiredSkills = new Set(Array.isArray(jobContext.skills) ? jobContext.skills : []);
            const textToScan = (jobContext.title + " " + jobContext.description + " " + jobContext.qualifications).toLowerCase();

            commonSkills.forEach(skill => {
                if (textToScan.includes(skill.toLowerCase())) {
                    requiredSkills.add(skill);
                }
            });

            const expMatch = textToScan.match(/(\d+)\+?\s*years?/);
            const requiredExp = expMatch ? parseInt(expMatch[1]) : 0;
            const targetSkills = Array.from(requiredSkills);

            const missing = targetSkills.filter(js => {
                const jsLower = js.toLowerCase();
                return !userSkillsLower.some(us => us.includes(jsLower) || jsLower.includes(us));
            });

            const recommendations = missing.map(skill => ({
                skill: skill,
                resources: [
                    { name: `Learn ${skill}`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' tutorial')}` },
                    { name: `${skill} Course`, url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(skill)}` }
                ]
            }));

            const matchedCount = targetSkills.length - missing.length;
            let matchPercent = targetSkills.length > 0 ? Math.round((matchedCount / targetSkills.length) * 100) : 0;

            let expFeedback = "Experience matched.";
            if (requiredExp > 0) {
                if (userExperience < requiredExp) {
                    const penalty = Math.min(20, (requiredExp - userExperience) * 5);
                    matchPercent = Math.max(0, matchPercent - penalty);
                    expFeedback = `This role typically requires ${requiredExp}+ years. You have ${userExperience} years. (Experience Gap)`;
                } else {
                    matchPercent = Math.min(100, matchPercent + 5);
                    expFeedback = `Your ${userExperience} years meet/exceed the ${requiredExp} year requirement!`;
                }
            }

            resolve({
                matchPercentage: matchPercent,
                missingSkills: missing,
                recommendations: recommendations,
                detectedSkills: targetSkills,
                requiredExperience: requiredExp,
                experienceFeedback: expFeedback
            });
        }, 1200);
    });
};
