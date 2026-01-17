// Comprehensive skill database for extraction
const SKILL_DATABASE = {
    // Programming Languages
    programming: [
        'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Go',
        'Rust', 'TypeScript', 'Scala', 'R', 'MATLAB', 'Perl', 'Shell', 'Bash', 'PowerShell'
    ],

    // Web Technologies
    web: [
        'React', 'Angular', 'Vue', 'Next.js', 'Node.js', 'Express', 'Django', 'Flask',
        'Spring', 'ASP.NET', 'HTML', 'CSS', 'Tailwind', 'Bootstrap', 'jQuery', 'Redux',
        'GraphQL', 'REST API', 'WebSocket', 'SASS', 'LESS'
    ],

    // Data Science & ML
    datascience: [
        'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn',
        'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Keras', 'NLP', 'Computer Vision',
        'Data Analysis', 'Statistics', 'Big Data', 'Hadoop', 'Spark'
    ],

    // Databases
    databases: [
        'MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'Cassandra', 'Oracle', 'SQL Server',
        'SQLite', 'DynamoDB', 'Firebase', 'Elasticsearch', 'Neo4j'
    ],

    // Cloud & DevOps
    cloud: [
        'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'CI/CD',
        'Terraform', 'Ansible', 'Git', 'GitHub', 'GitLab', 'Linux', 'Nginx', 'Apache'
    ],

    // Mobile Development
    mobile: [
        'React Native', 'Flutter', 'Android', 'iOS', 'Xamarin', 'Ionic', 'Swift', 'Kotlin'
    ],

    // Soft Skills
    soft: [
        'Leadership', 'Communication', 'Teamwork', 'Problem Solving', 'Critical Thinking',
        'Time Management', 'Adaptability', 'Creativity', 'Collaboration', 'Presentation'
    ],

    // Business & Management
    business: [
        'Project Management', 'Agile', 'Scrum', 'Product Management', 'Business Analysis',
        'Strategy', 'Marketing', 'Sales', 'Finance', 'Accounting', 'HR'
    ],

    // Design
    design: [
        'UI/UX', 'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'InDesign',
        'Wireframing', 'Prototyping', 'User Research', 'Design Thinking'
    ]
};

// Flatten all skills into a single array
const ALL_SKILLS = Object.values(SKILL_DATABASE).flat();

/**
 * Extract skills from resume text
 * @param {string} text - Parsed resume text
 * @returns {Array} - Array of extracted skills with proficiency levels
 */
function extractSkills(text) {
    if (!text) return [];

    const extractedSkills = [];
    const textLower = text.toLowerCase();
    const words = textLower.split(/\s+/);

    // Find skills in text
    ALL_SKILLS.forEach(skill => {
        const skillLower = skill.toLowerCase();

        // Check if skill exists in text
        if (textLower.includes(skillLower)) {
            // Calculate proficiency based on context
            const proficiency = calculateProficiency(text, skill);

            extractedSkills.push({
                name: skill,
                level: proficiency,
                category: getSkillCategory(skill)
            });
        }
    });

    // Remove duplicates and sort by proficiency
    const uniqueSkills = Array.from(
        new Map(extractedSkills.map(s => [s.name.toLowerCase(), s])).values()
    );

    return uniqueSkills.sort((a, b) => b.level - a.level);
}

/**
 * Calculate skill proficiency based on context
 * @param {string} text - Resume text
 * @param {string} skill - Skill name
 * @returns {number} - Proficiency level (1-5)
 */
function calculateProficiency(text, skill) {
    const skillLower = skill.toLowerCase();
    const textLower = text.toLowerCase();

    // Keywords indicating proficiency levels
    const expertKeywords = ['expert', 'advanced', 'senior', 'lead', 'architect', 'mastery'];
    const intermediateKeywords = ['proficient', 'experienced', 'skilled', 'competent'];
    const beginnerKeywords = ['basic', 'beginner', 'learning', 'familiar'];

    // Find context around skill mention
    const skillIndex = textLower.indexOf(skillLower);
    if (skillIndex === -1) return 3; // Default intermediate

    const contextStart = Math.max(0, skillIndex - 100);
    const contextEnd = Math.min(textLower.length, skillIndex + 100);
    const context = textLower.substring(contextStart, contextEnd);

    // Check for proficiency indicators
    if (expertKeywords.some(keyword => context.includes(keyword))) return 5;
    if (intermediateKeywords.some(keyword => context.includes(keyword))) return 4;
    if (beginnerKeywords.some(keyword => context.includes(keyword))) return 2;

    // Check for years of experience
    const yearsMatch = context.match(/(\d+)\s*(year|yr)/i);
    if (yearsMatch) {
        const years = parseInt(yearsMatch[1]);
        if (years >= 5) return 5;
        if (years >= 3) return 4;
        if (years >= 1) return 3;
        return 2;
    }

    return 3; // Default intermediate
}

/**
 * Get skill category
 * @param {string} skill - Skill name
 * @returns {string} - Category name
 */
function getSkillCategory(skill) {
    for (const [category, skills] of Object.entries(SKILL_DATABASE)) {
        if (skills.includes(skill)) {
            return category;
        }
    }
    return 'other';
}

/**
 * Extract education information
 * @param {string} text - Resume text
 * @returns {Object} - Education details
 */
function extractEducation(text) {
    const degrees = ['B.Tech', 'B.E.', 'M.Tech', 'M.E.', 'MBA', 'MCA', 'BCA', 'B.Sc', 'M.Sc', 'PhD'];
    const institutions = [];

    degrees.forEach(degree => {
        if (text.includes(degree)) {
            institutions.push(degree);
        }
    });

    // Extract GPA/CGPA
    const gpaMatch = text.match(/(?:GPA|CGPA)[\s:]*(\d+\.?\d*)/i);
    const gpa = gpaMatch ? parseFloat(gpaMatch[1]) : null;

    return {
        degrees: institutions,
        gpa
    };
}

/**
 * Extract experience information
 * @param {string} text - Resume text
 * @returns {Array} - Experience entries
 */
function extractExperience(text) {
    const experiences = [];

    // Look for common experience patterns
    const experiencePatterns = [
        /(\d+)\s*(?:year|yr)s?\s*(?:of)?\s*experience/gi,
        /worked\s+(?:as|at)\s+([^,.\n]+)/gi,
        /intern(?:ship)?\s+at\s+([^,.\n]+)/gi
    ];

    experiencePatterns.forEach(pattern => {
        const matches = text.matchAll(pattern);
        for (const match of matches) {
            experiences.push(match[0]);
        }
    });

    return experiences;
}

module.exports = {
    extractSkills,
    extractEducation,
    extractExperience,
    SKILL_DATABASE,
    ALL_SKILLS
};
