const { PythonShell } = require('python-shell');
const path = require('path');
const Student = require('../models/Student');
const Internship = require('../models/Internship');
const Allocation = require('../models/Allocation');
const Rating = require('../models/Rating');

class MLService {
    constructor() {
        this.mlDir = path.join(__dirname, '../../ml');
        this.isModelTrained = false;
        this.checkModelExists();
    }

    /**
     * Check if ML model files exist
     */
    checkModelExists() {
        const fs = require('fs');
        const modelPath = path.join(this.mlDir, 'models', 'matching_model.pkl');
        this.isModelTrained = fs.existsSync(modelPath);
    }

    /**
     * Extract features from student-internship pair
     */
    extractFeatures(student, internship) {
        // Get student skills as a map for quick lookup
        const studentSkillsMap = new Map();
        student.skills.forEach(skill => {
            studentSkillsMap.set(skill.name.toLowerCase(), skill.level);
        });

        // Calculate skill overlap
        const requiredSkills = internship.requiredSkills || [];
        let skillOverlapCount = 0;
        let totalSkillLevel = 0;
        let maxSkillLevel = 0;

        requiredSkills.forEach(reqSkill => {
            const skillName = reqSkill.skill.toLowerCase();
            if (studentSkillsMap.has(skillName)) {
                skillOverlapCount++;
                const level = studentSkillsMap.get(skillName);
                totalSkillLevel += level;
                maxSkillLevel = Math.max(maxSkillLevel, level);
            }
        });

        const skillOverlapRatio = requiredSkills.length > 0 
            ? skillOverlapCount / requiredSkills.length 
            : 0;
        
        const avgSkillLevel = skillOverlapCount > 0 
            ? totalSkillLevel / skillOverlapCount 
            : 0;

        // Domain matching
        const studentDomain = student.preferences?.preferredDomain?.toLowerCase() || '';
        const internshipSector = internship.org?.sector?.toLowerCase() || '';
        const domainMatch = studentDomain === internshipSector;

        // Location matching
        const studentLocation = student.preferences?.preferredLocation?.toLowerCase() || '';
        const internshipLocation = internship.location?.toLowerCase() || '';
        const locationMatch = studentLocation === internshipLocation || 
                             studentLocation === 'remote' || 
                             internshipLocation === 'remote';

        // Count verified skills
        const verifiedSkills = student.skills.filter(s => s.isVerified).length;

        return {
            skillOverlapCount,
            skillOverlapRatio,
            avgSkillLevel,
            maxSkillLevel,
            gpa: student.academic?.gpa || 0,
            domainMatch,
            locationMatch,
            locationPreference: locationMatch ? 1 : 0,
            duration: internship.duration || 0,
            stipend: internship.stipend || 0,
            totalSkills: student.skills.length,
            verifiedSkills,
            pastAllocations: 0, // TODO: Query from Allocation model
            pastAvgRating: 0    // TODO: Query from Rating model
        };
    }

    /**
     * Train ML model with historical data
     */
    async trainModel() {
        try {
            console.log('[ML Service] Starting model training...');

            // Gather training data from historical allocations and ratings
            const allocations = await Allocation.find({ 
                status: 'ACCEPTED' 
            })
            .populate('student')
            .populate({
                path: 'internship',
                populate: { path: 'org' }
            })
            .limit(1000); // Limit for performance

            if (allocations.length < 10) {
                throw new Error('Insufficient training data. Need at least 10 accepted allocations.');
            }

            // Build training dataset
            const trainingData = [];

            for (const allocation of allocations) {
                if (!allocation.student || !allocation.internship) continue;

                // Extract features
                const features = this.extractFeatures(
                    allocation.student, 
                    allocation.internship
                );

                // Get target score from ratings or allocation score
                let targetScore = allocation.score || 0.5;

                // Try to get actual rating if available
                const rating = await Rating.findOne({
                    allocation: allocation._id,
                    'studentRating.overallScore': { $exists: true }
                });

                if (rating && rating.studentRating?.overallScore) {
                    // Normalize rating from 1-5 to 0-1
                    targetScore = (rating.studentRating.overallScore - 1) / 4;
                }

                trainingData.push({
                    ...features,
                    targetScore
                });
            }

            console.log(`[ML Service] Prepared ${trainingData.length} training samples`);

            // Call Python training script
            const options = {
                mode: 'json',
                pythonPath: 'python3',
                scriptPath: this.mlDir,
                args: []
            };

            return new Promise((resolve, reject) => {
                const pyshell = new PythonShell('train_model.py', options);

                // Send training data via stdin
                pyshell.send(JSON.stringify(trainingData));
                pyshell.end(() => {});

                pyshell.on('message', (result) => {
                    if (result.success) {
                        this.isModelTrained = true;
                        console.log('[ML Service] Model trained successfully');
                        console.log('Metrics:', result.metrics);
                        resolve(result);
                    } else {
                        reject(new Error(result.error));
                    }
                });

                pyshell.on('error', (err) => {
                    reject(err);
                });
            });

        } catch (error) {
            console.error('[ML Service] Training failed:', error);
            throw error;
        }
    }

    /**
     * Predict match scores for student-internship pairs
     */
    async predict(pairs, includeConfidence = false) {
        if (!this.isModelTrained) {
            throw new Error('ML model not trained. Please train the model first.');
        }

        try {
            // Extract features for all pairs
            const predictionData = pairs.map(pair => 
                this.extractFeatures(pair.student, pair.internship)
            );

            // Call Python prediction script
            const options = {
                mode: 'json',
                pythonPath: 'python3',
                scriptPath: this.mlDir,
                args: []
            };

            return new Promise((resolve, reject) => {
                const pyshell = new PythonShell('predict.py', options);

                // Send prediction request
                pyshell.send(JSON.stringify({
                    data: predictionData,
                    includeConfidence
                }));
                pyshell.end(() => {});

                pyshell.on('message', (result) => {
                    if (result.success) {
                        resolve(result.predictions);
                    } else {
                        reject(new Error(result.error));
                    }
                });

                pyshell.on('error', (err) => {
                    reject(err);
                });
            });

        } catch (error) {
            console.error('[ML Service] Prediction failed:', error);
            throw error;
        }
    }

    /**
     * Predict single match score
     */
    async predictSingle(student, internship, includeConfidence = false) {
        const predictions = await this.predict([{ student, internship }], includeConfidence);
        return predictions[0];
    }

    /**
     * Get model status and info
     */
    getStatus() {
        return {
            isModelTrained: this.isModelTrained,
            modelPath: path.join(this.mlDir, 'models')
        };
    }
}

// Singleton instance
const mlService = new MLService();

module.exports = mlService;
