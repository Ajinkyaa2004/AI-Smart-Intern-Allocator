#!/usr/bin/env python3
"""
Generate sample training data for testing ML model
This creates synthetic allocation data when you don't have enough real data yet
"""

import json
import random
import numpy as np

def generate_sample_data(n_samples=50):
    """Generate synthetic training data"""
    
    training_data = []
    
    for i in range(n_samples):
        # Generate realistic feature values
        skill_overlap_count = random.randint(0, 8)
        total_required_skills = random.randint(3, 10)
        skill_overlap_ratio = skill_overlap_count / total_required_skills if total_required_skills > 0 else 0
        
        avg_skill_level = random.uniform(1, 5) if skill_overlap_count > 0 else 0
        max_skill_level = min(5, avg_skill_level + random.uniform(0, 1.5))
        
        gpa = random.uniform(6.0, 10.0)
        domain_match = random.choice([True, False])
        location_match = random.choice([True, False])
        
        # Target score calculation (simulate real outcome)
        # Higher skill match and GPA should lead to better outcomes
        base_score = (
            skill_overlap_ratio * 0.4 +
            (avg_skill_level / 5) * 0.2 +
            (gpa / 10) * 0.15 +
            (1.0 if domain_match else 0.0) * 0.15 +
            (1.0 if location_match else 0.0) * 0.1
        )
        
        # Add some noise and real-world variation
        noise = random.uniform(-0.1, 0.1)
        target_score = max(0.0, min(1.0, base_score + noise))
        
        sample = {
            'skillOverlapCount': skill_overlap_count,
            'skillOverlapRatio': round(skill_overlap_ratio, 2),
            'avgSkillLevel': round(avg_skill_level, 2),
            'maxSkillLevel': round(max_skill_level, 2),
            'gpa': round(gpa, 2),
            'domainMatch': domain_match,
            'locationMatch': location_match,
            'locationPreference': 1 if location_match else 0,
            'duration': random.randint(8, 24),
            'stipend': random.randint(5, 25) * 1000,
            'totalSkills': random.randint(5, 15),
            'verifiedSkills': random.randint(2, 10),
            'pastAllocations': random.randint(0, 3),
            'pastAvgRating': round(random.uniform(3.0, 5.0), 2) if random.random() > 0.3 else 0,
            'targetScore': round(target_score, 3)
        }
        
        training_data.append(sample)
    
    return training_data

if __name__ == '__main__':
    # Generate 50 samples
    samples = generate_sample_data(50)
    
    # Output as JSON
    print(json.dumps(samples))
