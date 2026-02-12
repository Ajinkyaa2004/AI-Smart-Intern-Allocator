/**
 * Advanced Skill Matching Algorithms
 * Implements TF-IDF with Cosine Similarity for better skill matching
 */

/**
 * Calculate Term Frequency (TF)
 * TF(t,d) = (Number of times term t appears in document d) / (Total number of terms in document d)
 */
function calculateTF(skills) {
    const tfMap = new Map();
    const totalSkills = skills.length;
    
    if (totalSkills === 0) return tfMap;
    
    skills.forEach(skill => {
        const skillName = skill.name.toLowerCase();
        const level = skill.level || 1; // Use proficiency level as weight
        
        // TF is based on proficiency level (1-5) normalized
        tfMap.set(skillName, level / 5.0);
    });
    
    return tfMap;
}

/**
 * Calculate Inverse Document Frequency (IDF)
 * IDF(t) = log(Total number of documents / Number of documents with term t)
 * 
 * In our context:
 * - All unique skills in the system form the "corpus"
 * - Each student/internship is a "document"
 */
function calculateIDF(allSkillsInCorpus) {
    const idfMap = new Map();
    const totalDocuments = allSkillsInCorpus.length;
    
    if (totalDocuments === 0) return idfMap;
    
    // Count how many documents (students/internships) contain each skill
    const skillDocumentFrequency = new Map();
    
    allSkillsInCorpus.forEach(documentSkills => {
        const uniqueSkills = new Set(
            documentSkills.map(s => (typeof s === 'string' ? s : s.name || s.skill).toLowerCase())
        );
        
        uniqueSkills.forEach(skill => {
            skillDocumentFrequency.set(
                skill, 
                (skillDocumentFrequency.get(skill) || 0) + 1
            );
        });
    });
    
    // Calculate IDF for each skill
    skillDocumentFrequency.forEach((docCount, skill) => {
        // Add smoothing to avoid division by zero
        idfMap.set(skill, Math.log((totalDocuments + 1) / (docCount + 1)) + 1);
    });
    
    return idfMap;
}

/**
 * Calculate TF-IDF vector for a set of skills
 * TF-IDF(t,d) = TF(t,d) × IDF(t)
 */
function calculateTFIDF(skills, idfMap) {
    const tfMap = calculateTF(skills);
    const tfidfVector = new Map();
    
    tfMap.forEach((tf, skill) => {
        const idf = idfMap.get(skill) || 1.0; // Default IDF if not in corpus
        tfidfVector.set(skill, tf * idf);
    });
    
    return tfidfVector;
}

/**
 * Calculate Cosine Similarity between two TF-IDF vectors
 * cosine_similarity = (A · B) / (||A|| × ||B||)
 */
function cosineSimilarity(vectorA, vectorB) {
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;
    
    // Get all unique skills from both vectors
    const allSkills = new Set([...vectorA.keys(), ...vectorB.keys()]);
    
    allSkills.forEach(skill => {
        const valueA = vectorA.get(skill) || 0;
        const valueB = vectorB.get(skill) || 0;
        
        dotProduct += valueA * valueB;
        magnitudeA += valueA * valueA;
        magnitudeB += valueB * valueB;
    });
    
    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);
    
    // Avoid division by zero
    if (magnitudeA === 0 || magnitudeB === 0) {
        return 0;
    }
    
    return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Calculate skill match using TF-IDF and Cosine Similarity
 * @param {Array} studentSkills - Array of student skills [{name, level}]
 * @param {Array} requiredSkills - Array of required skills [{skill, weight}]
 * @param {Map} idfMap - Pre-calculated IDF values (optional, for performance)
 * @returns {Object} - Match score and details
 */
function calculateSkillMatchTFIDF(studentSkills, requiredSkills, idfMap = null) {
    // Handle edge cases
    if (!requiredSkills || requiredSkills.length === 0) {
        return {
            score: 0,
            matchedSkills: [],
            missingSkills: [],
            method: 'TF-IDF + Cosine Similarity'
        };
    }
    
    if (!studentSkills || studentSkills.length === 0) {
        return {
            score: 0,
            matchedSkills: [],
            missingSkills: requiredSkills.map(r => r.skill),
            method: 'TF-IDF + Cosine Similarity'
        };
    }
    
    // If IDF map not provided, calculate it on the fly
    if (!idfMap) {
        idfMap = calculateIDF([studentSkills, requiredSkills]);
    }
    
    // Calculate TF-IDF vectors
    const studentVector = calculateTFIDF(studentSkills, idfMap);
    
    // Convert required skills to the same format as student skills
    const requiredSkillsFormatted = requiredSkills.map(r => ({
        name: r.skill,
        level: r.weight || 3 // Default weight as proficiency level
    }));
    const requiredVector = calculateTFIDF(requiredSkillsFormatted, idfMap);
    
    // Calculate cosine similarity
    const similarity = cosineSimilarity(studentVector, requiredVector);
    
    // Identify matched and missing skills
    const matchedSkills = [];
    const missingSkills = [];
    
    requiredSkills.forEach(reqSkill => {
        const skillName = reqSkill.skill.toLowerCase();
        const studentSkill = studentSkills.find(s => 
            s.name.toLowerCase() === skillName || 
            s.name.toLowerCase().includes(skillName) ||
            skillName.includes(s.name.toLowerCase())
        );
        
        if (studentSkill) {
            matchedSkills.push({
                skill: reqSkill.skill,
                studentLevel: studentSkill.level,
                requiredWeight: reqSkill.weight || 1
            });
        } else {
            missingSkills.push(reqSkill.skill);
        }
    });
    
    // Calculate additional metrics
    const exactMatchRatio = matchedSkills.length / requiredSkills.length;
    const avgProficiency = matchedSkills.length > 0
        ? matchedSkills.reduce((sum, s) => sum + s.studentLevel, 0) / matchedSkills.length / 5
        : 0;
    
    // Combine cosine similarity with exact match ratio and proficiency
    // 50% cosine similarity + 30% match ratio + 20% proficiency
    const finalScore = (
        (similarity * 0.5) +
        (exactMatchRatio * 0.3) +
        (avgProficiency * 0.2)
    );
    
    return {
        score: parseFloat(Math.min(finalScore, 1.0).toFixed(3)),
        cosineSimilarity: parseFloat(similarity.toFixed(3)),
        exactMatchRatio: parseFloat(exactMatchRatio.toFixed(3)),
        avgProficiency: parseFloat(avgProficiency.toFixed(3)),
        matchedSkills,
        missingSkills,
        method: 'TF-IDF + Cosine Similarity'
    };
}

/**
 * Precompute IDF map from all students and internships for better performance
 * @param {Array} allStudents - All student documents
 * @param {Array} allInternships - All internship documents
 * @returns {Map} - IDF map for all skills in corpus
 */
function precomputeIDFMap(allStudents, allInternships) {
    const corpus = [];
    
    // Add student skills to corpus
    allStudents.forEach(student => {
        if (student.skills && student.skills.length > 0) {
            corpus.push(student.skills);
        }
    });
    
    // Add internship required skills to corpus
    allInternships.forEach(internship => {
        if (internship.requiredSkills && internship.requiredSkills.length > 0) {
            corpus.push(internship.requiredSkills);
        }
    });
    
    return calculateIDF(corpus);
}

module.exports = {
    calculateTF,
    calculateIDF,
    calculateTFIDF,
    cosineSimilarity,
    calculateSkillMatchTFIDF,
    precomputeIDFMap
};
