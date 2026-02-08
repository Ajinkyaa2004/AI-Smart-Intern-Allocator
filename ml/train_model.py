#!/usr/bin/env python3
"""
ML Model Training Script for InternMatch AI
Trains a Random Forest model to predict student-internship match quality
"""

import sys
import json
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib
from pathlib import Path

class MatchingModelTrainer:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.feature_names = None
        
    def prepare_features(self, data):
        """
        Extract features from allocation data
        Returns: DataFrame with engineered features
        """
        features = []
        
        for item in data:
            feature_dict = {
                # Skills matching features
                'skill_overlap_count': item.get('skillOverlapCount', 0),
                'skill_overlap_ratio': item.get('skillOverlapRatio', 0),
                'avg_skill_level': item.get('avgSkillLevel', 0),
                'max_skill_level': item.get('maxSkillLevel', 0),
                
                # Academic features
                'gpa': item.get('gpa', 0),
                'gpa_normalized': item.get('gpa', 0) / 10.0,  # Assuming 10-point scale
                
                # Domain/interest alignment
                'domain_match': 1 if item.get('domainMatch', False) else 0,
                
                # Location features
                'location_match': 1 if item.get('locationMatch', False) else 0,
                'location_preference': item.get('locationPreference', 0),
                
                # Internship characteristics
                'internship_duration': item.get('duration', 0),
                'stipend_amount': item.get('stipend', 0) / 1000.0,  # Normalize
                
                # Student experience
                'total_skills': item.get('totalSkills', 0),
                'verified_skills': item.get('verifiedSkills', 0),
                
                # Historical performance (if available)
                'past_allocation_count': item.get('pastAllocations', 0),
                'past_avg_rating': item.get('pastAvgRating', 0),
            }
            features.append(feature_dict)
        
        df = pd.DataFrame(features)
        self.feature_names = df.columns.tolist()
        return df
    
    def train(self, training_data):
        """
        Train the Random Forest model
        training_data: List of dicts with features and target (success score/rating)
        """
        if len(training_data) < 10:
            raise ValueError("Need at least 10 training samples")
        
        # Extract features and target
        X = self.prepare_features(training_data)
        y = np.array([item.get('targetScore', item.get('rating', 0.5)) for item in training_data])
        
        # Handle missing values
        X = X.fillna(0)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train Random Forest
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1
        )
        
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate
        train_score = self.model.score(X_train_scaled, y_train)
        test_score = self.model.score(X_test_scaled, y_test)
        
        # Feature importance
        feature_importance = dict(zip(self.feature_names, self.model.feature_importances_))
        
        return {
            'train_score': float(train_score),
            'test_score': float(test_score),
            'n_samples': len(training_data),
            'feature_importance': {k: float(v) for k, v in feature_importance.items()}
        }
    
    def save_model(self, model_dir='ml/models'):
        """Save trained model and scaler"""
        Path(model_dir).mkdir(parents=True, exist_ok=True)
        
        joblib.dump(self.model, f'{model_dir}/matching_model.pkl')
        joblib.dump(self.scaler, f'{model_dir}/scaler.pkl')
        
        # Save feature names for consistency
        with open(f'{model_dir}/features.json', 'w') as f:
            json.dump(self.feature_names, f)

def main():
    """Main training function - expects JSON data from stdin"""
    try:
        # Read training data from stdin
        input_data = sys.stdin.read()
        training_data = json.loads(input_data)
        
        if not training_data or len(training_data) == 0:
            print(json.dumps({
                'success': False,
                'error': 'No training data provided'
            }))
            sys.exit(1)
        
        # Train model
        trainer = MatchingModelTrainer()
        metrics = trainer.train(training_data)
        
        # Save model
        trainer.save_model()
        
        # Return results
        result = {
            'success': True,
            'metrics': metrics,
            'message': 'Model trained and saved successfully'
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({
            'success': False,
            'error': str(e)
        }))
        sys.exit(1)

if __name__ == '__main__':
    main()
