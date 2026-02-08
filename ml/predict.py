#!/usr/bin/env python3
"""
ML Model Prediction Service
Loads trained model and makes match quality predictions
"""

import sys
import json
import numpy as np
import pandas as pd
import joblib
from pathlib import Path

class MatchingPredictor:
    def __init__(self, model_dir='ml/models'):
        """Load trained model, scaler, and feature names"""
        self.model_dir = model_dir
        self.model = None
        self.scaler = None
        self.feature_names = None
        self.load_model()
    
    def load_model(self):
        """Load the trained model from disk"""
        try:
            model_path = Path(self.model_dir)
            
            if not model_path.exists():
                raise FileNotFoundError(f"Model directory not found: {self.model_dir}")
            
            self.model = joblib.load(f'{self.model_dir}/matching_model.pkl')
            self.scaler = joblib.load(f'{self.model_dir}/scaler.pkl')
            
            with open(f'{self.model_dir}/features.json', 'r') as f:
                self.feature_names = json.load(f)
                
        except Exception as e:
            raise Exception(f"Failed to load model: {str(e)}")
    
    def prepare_features(self, data):
        """
        Extract features from input data
        Must match the feature engineering in training
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
                'gpa_normalized': item.get('gpa', 0) / 10.0,
                
                # Domain/interest alignment
                'domain_match': 1 if item.get('domainMatch', False) else 0,
                
                # Location features
                'location_match': 1 if item.get('locationMatch', False) else 0,
                'location_preference': item.get('locationPreference', 0),
                
                # Internship characteristics
                'internship_duration': item.get('duration', 0),
                'stipend_amount': item.get('stipend', 0) / 1000.0,
                
                # Student experience
                'total_skills': item.get('totalSkills', 0),
                'verified_skills': item.get('verifiedSkills', 0),
                
                # Historical performance
                'past_allocation_count': item.get('pastAllocations', 0),
                'past_avg_rating': item.get('pastAvgRating', 0),
            }
            features.append(feature_dict)
        
        df = pd.DataFrame(features)
        
        # Ensure all expected features are present
        for feature in self.feature_names:
            if feature not in df.columns:
                df[feature] = 0
        
        # Reorder columns to match training
        df = df[self.feature_names]
        
        # Handle missing values
        df = df.fillna(0)
        
        return df
    
    def predict(self, input_data):
        """
        Make predictions for student-internship pairs
        input_data: List of dicts with feature data
        Returns: List of predicted scores (0-1)
        """
        if not self.model:
            raise Exception("Model not loaded")
        
        # Prepare features
        X = self.prepare_features(input_data)
        
        # Scale features
        X_scaled = self.scaler.transform(X)
        
        # Predict
        predictions = self.model.predict(X_scaled)
        
        # Clip predictions to valid range [0, 1]
        predictions = np.clip(predictions, 0, 1)
        
        return predictions.tolist()
    
    def predict_with_confidence(self, input_data):
        """
        Make predictions with confidence intervals using tree variance
        """
        if not self.model:
            raise Exception("Model not loaded")
        
        X = self.prepare_features(input_data)
        X_scaled = self.scaler.transform(X)
        
        # Get predictions from all trees
        tree_predictions = np.array([tree.predict(X_scaled) for tree in self.model.estimators_])
        
        # Calculate mean and std
        predictions = np.mean(tree_predictions, axis=0)
        std_dev = np.std(tree_predictions, axis=0)
        
        # Clip to valid range
        predictions = np.clip(predictions, 0, 1)
        
        results = []
        for pred, std in zip(predictions, std_dev):
            results.append({
                'score': float(pred),
                'confidence': float(1 - min(std, 0.5) / 0.5),  # Normalize to 0-1
                'std_dev': float(std)
            })
        
        return results

def main():
    """Main prediction function - expects JSON data from stdin"""
    try:
        # Read input from stdin
        input_data = sys.stdin.read()
        request = json.loads(input_data)
        
        prediction_data = request.get('data', [])
        include_confidence = request.get('includeConfidence', False)
        
        if not prediction_data:
            print(json.dumps({
                'success': False,
                'error': 'No prediction data provided'
            }))
            sys.exit(1)
        
        # Load model and predict
        predictor = MatchingPredictor()
        
        if include_confidence:
            predictions = predictor.predict_with_confidence(prediction_data)
        else:
            scores = predictor.predict(prediction_data)
            predictions = [{'score': score} for score in scores]
        
        result = {
            'success': True,
            'predictions': predictions
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
