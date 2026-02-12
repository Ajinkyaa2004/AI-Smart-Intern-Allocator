/**
 * Educational Chatbot Service
 * Provides AI-powered assistance to students, organizations, and admins
 */

const Student = require('../models/Student');
const Internship = require('../models/Internship');
const Allocation = require('../models/Allocation');
const Organization = require('../models/Organization');

class ChatbotService {
    constructor() {
        // Knowledge base for FAQ and common queries
        this.knowledgeBase = this.initializeKnowledgeBase();
        
        // Intent patterns for classification
        this.intentPatterns = this.initializeIntentPatterns();
    }

    /**
     * Initialize knowledge base with common questions and answers
     */
    initializeKnowledgeBase() {
        return {
            // General Platform Questions
            'how_platform_works': {
                question: 'How does this platform work?',
                answer: 'The Smart Internship Allocation System uses AI and machine learning to match students with internships. We analyze your skills (45%), domain preferences (20%), location (20%), and academic performance (15%) to find the best fit. Our TF-IDF algorithm ensures rare skills are valued and matches are fair.',
                category: 'general'
            },
            'what_is_tfidf': {
                question: 'What is TF-IDF matching?',
                answer: 'TF-IDF (Term Frequency-Inverse Document Frequency) is an advanced NLP technique we use for skill matching. It considers:\n1. Your skill proficiency levels (1-5 stars)\n2. Rarity of skills (rare skills weighted higher)\n3. Semantic similarity between your skills and job requirements\n\nThis ensures fairer matches than simple keyword matching.',
                category: 'algorithm'
            },
            'allocation_weights': {
                question: 'How are matches scored?',
                answer: 'Every match gets a score (0-100%) based on:\n• Skills Match: 45% (most important)\n• Domain Preferences: 20%\n• Location Match: 20%\n• Academic Performance (GPA): 15%\n\nYou can see the detailed breakdown for your match in your dashboard.',
                category: 'algorithm'
            },
            
            // Student Questions
            'why_not_matched': {
                question: 'Why wasn\'t I matched?',
                answer: 'Common reasons for not being matched:\n1. Skill Gap: Missing required skills for available roles\n2. GPA Below Minimum: Some internships have GPA requirements\n3. Location Mismatch: No internships in your preferred locations\n4. Capacity Full: All positions filled by higher-scoring candidates\n\nCheck your profile for skill gaps and consider updating your preferences.',
                category: 'student'
            },
            'improve_profile': {
                question: 'How can I improve my profile?',
                answer: 'Tips to improve your match chances:\n1. Add more relevant skills with accurate proficiency levels\n2. Upload a detailed resume (PDF format)\n3. Verify skills through certifications\n4. Broaden location preferences\n5. Add multiple domain preferences\n6. Complete all profile sections\n\nHigher skill proficiency (4-5 stars) in demanded skills significantly improves matches!',
                category: 'student'
            },
            'skill_recommendations': {
                question: 'What skills should I learn?',
                answer: 'Based on current internship demand, top skills are:\n\n**Tech:**\n• Python (Data Science, ML, Backend)\n• React & JavaScript (Frontend)\n• SQL & Databases (All roles)\n• AWS/Cloud (DevOps)\n\n**Data Science:**\n• TensorFlow, PyTorch\n• Pandas, NumPy\n• Machine Learning\n\n**Soft Skills:**\n• Communication\n• Problem Solving\n• Teamwork\n\nFocus on 3-4 skills and develop them to 4+ stars rather than listing many basic skills.',
                category: 'student'
            },
            'resume_tips': {
                question: 'Resume tips?',
                answer: 'For best resume parsing results:\n✅ Use PDF format\n✅ Use standard section headers (Skills, Education, Experience)\n✅ List skills clearly (e.g., "Python", "React", not abbreviations)\n✅ Include proficiency levels if possible\n✅ Keep formatting simple (avoid tables, columns)\n❌ Avoid image-based resumes\n❌ Don\'t use unusual fonts',
                category: 'student'
            },
            
            // Organization Questions
            'post_internship': {
                question: 'How to post an internship?',
                answer: 'To post an internship:\n1. Log in to your Organization dashboard\n2. Go to "Postings" → "Create New"\n3. Fill in details:\n   - Title and description\n   - Required skills (with importance weights)\n   - Minimum GPA requirement\n   - Location and duration\n   - Number of vacancies\n4. Click "Post"\n\nThe system will automatically match and propose candidates based on your requirements.',
                category: 'organization'
            },
            'view_candidates': {
                question: 'How to view matched candidates?',
                answer: 'To view your matched candidates:\n1. Go to "Candidates" in your dashboard\n2. See list of proposed matches with scores\n3. Click on any candidate to see:\n   - Detailed skill breakdown\n   - Match explanation\n   - Profile (name, gender, college hidden for fairness)\n4. Accept or reject candidates\n\nHigher match scores indicate better fit. Our AI considers skills, domain fit, and location.',
                category: 'organization'
            },
            'rate_student': {
                question: 'How to rate students?',
                answer: 'Rating students helps our AI learn:\n1. Go to "Ratings" tab\n2. Find completed interns\n3. Rate on:\n   - Technical Skills (1-5)\n   - Communication (1-5)\n   - Work Ethic (1-5)\n   - Overall Performance (1-5)\n4. Add optional comments\n\nYour ratings improve future matching accuracy!',
                category: 'organization'
            },
            
            // Admin Questions
            'run_allocation': {
                question: 'How to run allocation?',
                answer: 'To run batch allocation (Admin only):\n1. Go to Admin Dashboard\n2. Click "Run Allocation"\n3. Choose options:\n   - Enable ML scoring (recommended)\n   - Set batch ID\n4. Click "Execute"\n\nThe system will:\n• Match all pending students\n• Generate proposals\n• Send notifications\n• Create waitlist for unmatched\n\nView results in Analytics dashboard.',
                category: 'admin'
            },
            'ml_training': {
                question: 'How to train ML model?',
                answer: 'To train the ML model (Admin only):\n1. Ensure you have 100+ rated allocations\n2. Use API: POST /api/v1/ml/train\n3. Model uses:\n   - Historical allocation data\n   - Organization ratings\n   - 15 engineered features\n4. Check model metrics (R² score)\n\nRe-train quarterly or after 500+ new ratings for best results.',
                category: 'admin'
            },
            
            // Privacy & Fairness
            'blind_allocation': {
                question: 'What is blind allocation?',
                answer: 'Our blind allocation ensures fairness:\n\n❌ NOT Considered:\n• Student Name\n• Gender\n• College Brand/Reputation\n• Caste/Religion\n• Photo\n\n✅ ONLY Considered:\n• Skills & Proficiency\n• Academic Performance (GPA)\n• Domain Preferences\n• Location Preferences\n• Verified Experience\n\nThis prevents bias and ensures merit-based matching.',
                category: 'fairness'
            },
            'data_privacy': {
                question: 'How is my data protected?',
                answer: 'Your data is protected:\n✅ Encrypted storage and transmission\n✅ No data shared with third parties\n✅ Resume files stored securely\n✅ Personal info hidden during matching\n✅ JWT authentication for API access\n✅ Access controls (role-based)\n\nOnly authorized personnel can access sensitive data.',
                category: 'privacy'
            }
        };
    }

    /**
     * Initialize intent patterns for query classification
     */
    initializeIntentPatterns() {
        return {
            // Greeting patterns
            greeting: [
                /^(hi|hello|hey|greetings)/i,
                /^good (morning|afternoon|evening)/i
            ],
            
            // Why not matched patterns
            not_matched: [
                /why (wasn't|wasnt|was not) i matched/i,
                /why (didn't|didnt|did not) i get/i,
                /not matched/i,
                /no (match|allocation|internship)/i,
                /rejected/i
            ],
            
            // Profile improvement
            improve_profile: [
                /how to improve/i,
                /better (profile|chances)/i,
                /increase (chances|score|probability)/i,
                /improve my (profile|matching)/i
            ],
            
            // Skill recommendations
            skills: [
                /what skills/i,
                /which skills/i,
                /learn (what|which)/i,
                /skill recommendations/i,
                /in-demand skills/i,
                /popular skills/i
            ],
            
            // Platform explanation
            how_works: [
                /how (does this|platform) work/i,
                /how to use/i,
                /explain (platform|system)/i,
                /what is this/i
            ],
            
            // Algorithm questions
            algorithm: [
                /tfidf|tf-idf/i,
                /algorithm/i,
                /how are matches/i,
                /matching (algorithm|process)/i,
                /score calculation/i,
                /weights/i
            ],
            
            // Resume help
            resume: [
                /resume/i,
                /cv/i,
                /upload (file|document)/i,
                /parse/i
            ],
            
            // Organization queries
            post_internship: [
                /post internship/i,
                /create (posting|internship)/i,
                /add internship/i,
                /how to post/i
            ],
            
            candidates: [
                /view candidates/i,
                /see (applicants|students)/i,
                /matched (candidates|students)/i
            ],
            
            // Admin queries
            allocation: [
                /run allocation/i,
                /batch allocation/i,
                /execute (matching|allocation)/i
            ],
            
            training: [
                /train (model|ml)/i,
                /machine learning/i,
                /ml training/i,
                /retrain/i
            ],
            
            // Fairness & Privacy
            fairness: [
                /blind (allocation|scoring)/i,
                /fair(ness)?/i,
                /bias/i,
                /discrimination/i
            ],
            
            privacy: [
                /privacy/i,
                /data (protection|security)/i,
                /safe/i,
                /confidential/i
            ]
        };
    }

    /**
     * Process user message and generate response
     */
    async processMessage(userId, userRole, message, sessionHistory = []) {
        try {
            const messageLower = message.toLowerCase().trim();
            
            // Classify intent
            const intent = this.classifyIntent(messageLower);
            
            // Generate response based on intent
            let response = await this.generateResponse(intent, userId, userRole, messageLower);
            
            // Add contextual suggestions
            const suggestions = this.getSuggestions(intent, userRole);
            
            return {
                success: true,
                response,
                suggestions,
                intent,
                timestamp: new Date()
            };
        } catch (error) {
            console.error('Chatbot error:', error);
            return {
                success: false,
                response: 'I apologize, but I encountered an error. Please try rephrasing your question or contact support.',
                suggestions: ['How does the platform work?', 'View FAQ'],
                error: error.message
            };
        }
    }

    /**
     * Classify user intent from message
     */
    classifyIntent(message) {
        // Check for greeting
        for (const pattern of this.intentPatterns.greeting) {
            if (pattern.test(message)) {
                return 'greeting';
            }
        }
        
        // Check each intent pattern
        for (const [intent, patterns] of Object.entries(this.intentPatterns)) {
            for (const pattern of patterns) {
                if (pattern.test(message)) {
                    return intent;
                }
            }
        }
        
        // Check knowledge base similarity
        const kbMatch = this.findKnowledgeBaseMatch(message);
        if (kbMatch) {
            return kbMatch;
        }
        
        return 'unknown';
    }

    /**
     * Find matching knowledge base entry
     */
    findKnowledgeBaseMatch(message) {
        const words = message.split(/\s+/);
        let bestMatch = null;
        let bestScore = 0;
        
        for (const [key, entry] of Object.entries(this.knowledgeBase)) {
            const entryWords = entry.question.toLowerCase().split(/\s+/);
            let score = 0;
            
            for (const word of words) {
                if (word.length > 3 && entryWords.some(w => w.includes(word) || word.includes(w))) {
                    score++;
                }
            }
            
            if (score > bestScore) {
                bestScore = score;
                bestMatch = key;
            }
        }
        
        return bestScore > 1 ? bestMatch : null;
    }

    /**
     * Generate response based on intent and context
     */
    async generateResponse(intent, userId, userRole, message) {
        // Greeting
        if (intent === 'greeting') {
            return `Hello! 👋 I'm your InternMatch AI assistant. How can I help you today?\n\nI can help with:\n• Understanding how matching works\n• Profile improvement tips\n• Skill recommendations\n• Platform navigation\n• And much more!`;
        }
        
        // Check knowledge base first
        if (this.knowledgeBase[intent]) {
            return this.knowledgeBase[intent].answer;
        }
        
        // Intent-specific responses with personalization
        switch (intent) {
            case 'not_matched':
                return await this.handleNotMatchedQuery(userId, userRole);
                
            case 'improve_profile':
                return await this.handleProfileImprovementQuery(userId, userRole);
                
            case 'skills':
                return await this.handleSkillRecommendations(userId, userRole);
                
            case 'how_works':
                return this.knowledgeBase.how_platform_works.answer;
                
            case 'algorithm':
                return this.knowledgeBase.what_is_tfidf.answer + '\n\n' + this.knowledgeBase.allocation_weights.answer;
                
            case 'resume':
                return this.knowledgeBase.resume_tips.answer;
                
            case 'post_internship':
                return this.knowledgeBase.post_internship.answer;
                
            case 'candidates':
                return this.knowledgeBase.view_candidates.answer;
                
            case 'allocation':
                return this.knowledgeBase.run_allocation.answer;
                
            case 'training':
                return this.knowledgeBase.ml_training.answer;
                
            case 'fairness':
                return this.knowledgeBase.blind_allocation.answer;
                
            case 'privacy':
                return this.knowledgeBase.data_privacy.answer;
                
            default:
                return this.handleUnknownQuery(message, userRole);
        }
    }

    /**
     * Handle "why not matched" queries with personalized data
     */
    async handleNotMatchedQuery(userId, userRole) {
        if (userRole !== 'STUDENT') {
            return 'This question is specific to students. Students can check their match status and reasons in their dashboard.';
        }
        
        try {
            const student = await Student.findOne({ user: userId }).populate('user');
            
            if (!student) {
                return 'I couldn\'t find your student profile. Please complete your profile first.';
            }
            
            // Check if they have any allocations
            const allocation = await Allocation.findOne({ student: student._id })
                .sort({ createdAt: -1 })
                .populate('internship');
            
            if (allocation && allocation.status === 'ACCEPTED') {
                return `Great news! You are matched to "${allocation.internship.title}"!\n\nYour match score: ${Math.round(allocation.score * 100)}%\n\nCheck your dashboard for full details.`;
            }
            
            // Analyze why not matched
            const reasons = [];
            
            // Check profile completeness
            if (!student.skills || student.skills.length < 3) {
                reasons.push('• Add more skills to your profile (minimum 3 recommended)');
            }
            
            if (!student.resume || !student.resume.filePath) {
                reasons.push('• Upload your resume for better skill extraction');
            }
            
            if (student.academic.gpa < 6.0) {
                reasons.push('• Some internships require minimum GPA of 6.0+');
            }
            
            if (!student.preferences.domains || student.preferences.domains.length === 0) {
                reasons.push('• Add domain preferences to improve matching');
            }
            
            if (reasons.length > 0) {
                return `Based on your profile, here's why you might not be matched yet:\n\n${reasons.join('\n')}\n\n💡 **Tip:** Complete your profile and add high-proficiency skills (4-5 stars) in demanded areas like Python,React, SQL, or Data Science.`;
            }
            
            return 'Your profile looks complete! Possible reasons:\n• All positions in your preferred domains/locations are filled\n• Higher-scoring candidates matched first\n• No recent allocation batch has been run\n\nYou\'re likely on the waitlist. New internships are posted regularly!';
            
        } catch (error) {
            return this.knowledgeBase.why_not_matched.answer;
        }
    }

    /**
     * Handle profile improvement queries
     */
    async handleProfileImprovementQuery(userId, userRole) {
        if (userRole !== 'STUDENT') {
            return this.knowledgeBase.improve_profile.answer;
        }
        
        try {
            const student = await Student.findOne({ user: userId });
            
            if (!student) {
                return 'Complete your student profile first to get personalized recommendations!';
            }
            
            const tips = [];
            
            // Analyze current profile
            if (!student.resume || !student.resume.filePath) {
                tips.push('📄 **Upload Resume**: This automatically extracts skills (+20% match rate)');
            }
            
            if (student.skills.length < 5) {
                tips.push(`🎯 **Add More Skills**: You have ${student.skills.length} skills. Aim for 5-8 relevant skills`);
            }
            
            const highProficiencySkills = student.skills.filter(s => s.level >= 4).length;
            if (highProficiencySkills < 2) {
                tips.push('⭐ **Increase Proficiency**: Add 4-5 star ratings for skills you\'re confident in');
            }
            
            if (student.preferences.domains.length < 2) {
                tips.push('🔖 **Broaden Domains**: Add 2-3 domain preferences for more opportunities');
            }
            
            if (student.preferences.locations.length < 2) {
                tips.push('📍 **Add Locations**: Consider remote or multiple city preferences');
            }
            
            if (tips.length === 0) {
                return '✅ Your profile is well-optimized! Keep your skills updated and check back regularly for new internships.';
            }
            
            return `Here are personalized tips to improve your profile:\n\n${tips.join('\n\n')}\n\n**Priority**: Focus on high-demand skills like Python, React, or Data Science with 4+ star proficiency.`;
            
        } catch (error) {
            return this.knowledgeBase.improve_profile.answer;
        }
    }

    /**
     * Handle skill recommendation queries
     */
    async handleSkillRecommendations(userId, userRole) {
        try {
            // Get top skills from current internships
            const internships = await Internship.find({ status: 'OPEN' }).limit(100);
            
            const skillFrequency = new Map();
            
            internships.forEach(internship => {
                internship.requiredSkills.forEach(reqSkill => {
                    const skill = reqSkill.skill.toLowerCase();
                    skillFrequency.set(skill, (skillFrequency.get(skill) || 0) + 1);
                });
            });
            
            // Sort by frequency
            const topSkills = Array.from(skillFrequency.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10);
            
            let response = '📊 **Most In-Demand Skills Right Now:**\n\n';
            
            topSkills.forEach(([ skill, count], index) => {
                const demand = count > 20 ? 'Very High' : count > 10 ? 'High' : 'Medium';
                response += `${index + 1}. **${skill.charAt(0).toUpperCase() + skill.slice(1)}** - ${demand} Demand (${count} internships)\n`;
            });
            
            response += '\n💡 **Recommendation**: Focus on learning 2-3 of these skills to 4+ star proficiency for best results!';
            
            return response;
            
        } catch (error) {
            return this.knowledgeBase.skill_recommendations.answer;
        }
    }

    /**
     * Handle unknown queries
     */
    handleUnknownQuery(message, userRole) {
        return `I'm not sure I understand that question. Here are some things I can help with:\n\n
**For Students:**\n• "Why wasn't I matched?"\n• "How to improve my profile?"\n• "What skills should I learn?"\n• "Resume tips"\n\n
**For Organizations:**\n• "How to post internship?"\n• "View matched candidates"\n• "How to rate students?"\n\n
**General:**\n• "How does the platform work?"\n• "What is TF-IDF matching?"\n• "Is allocation fair?"\n\nOr try rephrasing your question!`;
    }

    /**
     * Get contextual suggestions based on intent
     */
    getSuggestions(intent, userRole) {
        const suggestions = {
            student: [
                'Why wasn\'t I matched?',
                'How to improve my profile?',
                'What skills should I learn?',
                'Resume upload tips'
            ],
            organization: [
                'How to post internship?',
                'View matched candidates',
                'How to rate students?',
                'Algorithm explanation'
            ],
            admin: [
                'How to run allocation?',
                'Train ML model',
                'View analytics',
                'System status'
            ]
        };
        
        const role = userRole?.toLowerCase() || 'student';
        return suggestions[role] || suggestions.student;
    }

    /**
     * Get FAQ list
     */
    getFAQList(category = null) {
        const faqs = Object.values(this.knowledgeBase);
        
        if (category) {
            return faqs.filter(faq => faq.category === category);
        }
        
        return faqs;
    }
}

module.exports = new ChatbotService();
