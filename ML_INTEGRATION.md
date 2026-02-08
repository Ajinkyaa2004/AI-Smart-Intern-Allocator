# ML Model Integration - InternMatch AI

## Overview
This project now includes a **Machine Learning model** for student-internship matching using **Random Forest Regression**. The ML model learns from historical allocation data and ratings to predict match quality more accurately than rule-based algorithms alone.

## Architecture

### Hybrid Scoring System
- **ML Score (60%)**: Learned from historical data
- **Rule-based Score (40%)**: Traditional weighted algorithm
- **Confidence Tracking**: ML predictions include confidence intervals

### Components

#### 1. Python ML Service (`ml/`)
- **train_model.py**: Trains Random Forest model on historical allocations
- **predict.py**: Loads trained model and makes predictions
- **requirements.txt**: Python dependencies

#### 2. Node.js Integration (`server/services/mlService.js`)
- Extracts features from student-internship pairs
- Calls Python scripts via `python-shell`
- Handles training and prediction workflows

#### 3. API Endpoints (`server/routes/mlRoutes.js`)
- `POST /api/v1/ml/train` - Train model with historical data
- `POST /api/v1/ml/predict` - Get predictions for pairs
- `GET /api/v1/ml/status` - Check model status
- `POST /api/v1/ml/predict-single` - Predict single match

## Installation

### 1. Install Node.js Dependencies
```bash
npm install
```

### 2. Install Python Dependencies
```bash
# Ensure Python 3.8+ is installed
python3 --version

# Install ML libraries
pip3 install -r ml/requirements.txt
```

Or using a virtual environment (recommended):
```bash
cd ml
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Make Python Scripts Executable
```bash
chmod +x ml/train_model.py
chmod +x ml/predict.py
```

## Usage

### Training the Model

The model needs historical data (accepted allocations + ratings) to train. Minimum **10 samples** required.

**Via API (Admin only):**
```bash
curl -X POST http://localhost:3000/api/v1/ml/train \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "success": true,
  "message": "Model trained successfully",
  "metrics": {
    "train_score": 0.85,
    "test_score": 0.78,
    "n_samples": 150,
    "feature_importance": {
      "skill_overlap_ratio": 0.32,
      "gpa": 0.18,
      "avg_skill_level": 0.15,
      ...
    }
  }
}
```

### Running Allocations with ML

**Enable ML in allocation:**
```bash
curl -X POST http://localhost:3000/api/v1/allocation/run \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"useML": true}'
```

**Or set environment variable:**
```bash
# In .env file
USE_ML_SCORING=true
```

### Check Model Status

```bash
curl http://localhost:3000/api/v1/ml/status \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## Features Extracted

The ML model uses these features for prediction:

### Skill Features
- `skill_overlap_count`: Number of matching skills
- `skill_overlap_ratio`: Percentage of required skills matched
- `avg_skill_level`: Average proficiency in matched skills (1-5)
- `max_skill_level`: Highest skill level

### Academic Features
- `gpa`: Student GPA
- `gpa_normalized`: GPA on 0-1 scale

### Domain/Interest
- `domain_match`: Boolean - preference matches sector

### Location
- `location_match`: Boolean - location matches preference
- `location_preference`: Numeric preference strength

### Internship Characteristics
- `internship_duration`: Duration in weeks
- `stipend_amount`: Normalized stipend value

### Student Profile
- `total_skills`: Total number of skills
- `verified_skills`: Number of verified skills
- `past_allocation_count`: Previous allocations
- `past_avg_rating`: Historical performance rating

## Model Details

### Algorithm
**Random Forest Regressor**
- 100 estimators (trees)
- Max depth: 10
- Min samples split: 5
- Predicts match quality score (0-1)

### Training Process
1. Fetch historical allocations (status='ACCEPTED')
2. Extract features for each student-internship pair
3. Use ratings as target labels (normalized 1-5 → 0-1)
4. Train-test split (80-20)
5. Feature scaling with StandardScaler
6. Train Random Forest
7. Save model, scaler, and feature names

### Prediction Process
1. Extract same features from new pairs
2. Scale features using trained scaler
3. Get predictions from all trees
4. Calculate mean prediction + confidence (std dev)
5. Combine with rule-based score (60% ML, 40% rules)

## Environment Variables

Add to `.env`:
```env
# ML Configuration
USE_ML_SCORING=true          # Enable ML by default
```

## Troubleshooting

### Model Not Trained Error
**Problem**: "ML model not trained" error when running allocation
**Solution**: Train the model first using `/api/v1/ml/train` endpoint

### Python Not Found
**Problem**: "python3: command not found"
**Solution**: 
- Install Python 3.8+ from python.org
- Or specify python path in `mlService.js`: `pythonPath: '/path/to/python3'`

### Insufficient Training Data
**Problem**: "Need at least 10 training samples"
**Solution**: 
- Accept more allocations and add ratings
- Run allocation cycles to build history
- Initially use rule-based scoring until enough data

### Import Errors
**Problem**: "ModuleNotFoundError: No module named 'sklearn'"
**Solution**: 
```bash
pip3 install -r ml/requirements.txt
```

## Performance Tips

1. **Retrain periodically**: As more allocations complete, retrain for better accuracy
2. **Monitor metrics**: Check train/test scores to detect overfitting
3. **Feature importance**: Review which features matter most
4. **Hybrid approach**: Combine ML with rules for robustness
5. **Confidence threshold**: Filter low-confidence predictions

## Model Retraining Schedule

Recommended retraining frequency:
- **After 50 new allocations**: Significant new data
- **Monthly**: Keep model current with trends
- **After major changes**: New skills, sectors, or criteria added

## API Examples

### Train Model
```javascript
const response = await fetch('/api/v1/ml/train', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const result = await response.json();
console.log(result.metrics);
```

### Predict Single Match
```javascript
const response = await fetch('/api/v1/ml/predict-single', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    studentId: '507f1f77bcf86cd799439011',
    internshipId: '507f191e810c19729de860ea',
    includeConfidence: true
  })
});
const result = await response.json();
console.log(result.prediction); // { score: 0.82, confidence: 0.91 }
```

## Future Enhancements

- [ ] Deep learning models (Neural Networks)
- [ ] Real-time learning from feedback
- [ ] Collaborative filtering for recommendations
- [ ] A/B testing ML vs rule-based
- [ ] Explainable AI (SHAP values)
- [ ] Multi-objective optimization
- [ ] Transfer learning from similar domains
