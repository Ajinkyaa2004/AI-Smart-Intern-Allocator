#!/bin/bash

# Test ML Integration
echo "🧪 Testing ML Integration for InternMatch AI"
echo ""

# Test 1: Check Python
echo "1️⃣ Checking Python installation..."
if command -v python3 &> /dev/null; then
    echo "   ✅ Python 3 found: $(python3 --version)"
else
    echo "   ❌ Python 3 not found"
    exit 1
fi
echo ""

# Test 2: Check Python dependencies
echo "2️⃣ Checking Python dependencies..."
python3 -c "import sklearn; print('   ✅ scikit-learn:', sklearn.__version__)" 2>/dev/null || echo "   ❌ scikit-learn not installed"
python3 -c "import pandas; print('   ✅ pandas:', pandas.__version__)" 2>/dev/null || echo "   ❌ pandas not installed"
python3 -c "import numpy; print('   ✅ numpy:', numpy.__version__)" 2>/dev/null || echo "   ❌ numpy not installed"
python3 -c "import joblib; print('   ✅ joblib:', joblib.__version__)" 2>/dev/null || echo "   ❌ joblib not installed"
echo ""

# Test 3: Check Node.js dependencies
echo "3️⃣ Checking Node.js dependencies..."
if node -e "require('python-shell')" 2>/dev/null; then
    echo "   ✅ python-shell installed"
else
    echo "   ❌ python-shell not installed"
fi
echo ""

# Test 4: Check ML scripts
echo "4️⃣ Checking ML scripts..."
if [ -f "ml/train_model.py" ]; then
    echo "   ✅ train_model.py exists"
else
    echo "   ❌ train_model.py not found"
fi

if [ -f "ml/predict.py" ]; then
    echo "   ✅ predict.py exists"
else
    echo "   ❌ predict.py not found"
fi

if [ -x "ml/train_model.py" ]; then
    echo "   ✅ train_model.py is executable"
else
    echo "   ⚠️  train_model.py not executable (run: chmod +x ml/train_model.py)"
fi
echo ""

# Test 5: Test sample data generation
echo "5️⃣ Testing sample data generation..."
if python3 ml/generate_sample_data.py > /dev/null 2>&1; then
    echo "   ✅ Sample data generator works"
    SAMPLE_COUNT=$(python3 ml/generate_sample_data.py | python3 -c "import sys, json; print(len(json.load(sys.stdin)))")
    echo "   ℹ️  Generated $SAMPLE_COUNT training samples"
else
    echo "   ❌ Sample data generator failed"
fi
echo ""

# Test 6: Test training with sample data
echo "6️⃣ Testing model training with sample data..."
python3 ml/generate_sample_data.py | python3 ml/train_model.py > /tmp/train_result.json 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ Model training successful"
    
    # Check if model files were created
    if [ -f "ml/models/matching_model.pkl" ]; then
        echo "   ✅ Model file created"
    fi
    
    # Show metrics
    TRAIN_SCORE=$(python3 -c "import json; data=json.load(open('/tmp/train_result.json')); print(f'{data[\"metrics\"][\"train_score\"]:.3f}')" 2>/dev/null)
    TEST_SCORE=$(python3 -c "import json; data=json.load(open('/tmp/train_result.json')); print(f'{data[\"metrics\"][\"test_score\"]:.3f}')" 2>/dev/null)
    
    if [ -n "$TRAIN_SCORE" ] && [ -n "$TEST_SCORE" ]; then
        echo "   ℹ️  Train score: $TRAIN_SCORE"
        echo "   ℹ️  Test score: $TEST_SCORE"
    fi
else
    echo "   ❌ Model training failed"
    echo "   Error output:"
    cat /tmp/train_result.json
fi
echo ""

# Test 7: Test prediction
echo "7️⃣ Testing model prediction..."
TEST_DATA='{"data":[{"skillOverlapCount":5,"skillOverlapRatio":0.8,"avgSkillLevel":4.2,"maxSkillLevel":5,"gpa":8.5,"domainMatch":true,"locationMatch":true,"locationPreference":1,"duration":12,"stipend":15000,"totalSkills":10,"verifiedSkills":6,"pastAllocations":1,"pastAvgRating":4.2}],"includeConfidence":true}'

echo "$TEST_DATA" | python3 ml/predict.py > /tmp/predict_result.json 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ Prediction successful"
    
    PRED_SCORE=$(python3 -c "import json; data=json.load(open('/tmp/predict_result.json')); print(f'{data[\"predictions\"][0][\"score\"]:.3f}')" 2>/dev/null)
    CONFIDENCE=$(python3 -c "import json; data=json.load(open('/tmp/predict_result.json')); print(f'{data[\"predictions\"][0][\"confidence\"]:.3f}')" 2>/dev/null)
    
    if [ -n "$PRED_SCORE" ] && [ -n "$CONFIDENCE" ]; then
        echo "   ℹ️  Predicted score: $PRED_SCORE"
        echo "   ℹ️  Confidence: $CONFIDENCE"
    fi
else
    echo "   ❌ Prediction failed"
    echo "   Error output:"
    cat /tmp/predict_result.json
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Test Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "ml/models/matching_model.pkl" ]; then
    echo "✅ ML Integration is working!"
    echo ""
    echo "Next steps:"
    echo "1. Start server: npm run dev"
    echo "2. Use real data: POST /api/v1/ml/train"
    echo "3. Enable ML: Set USE_ML_SCORING=true in .env"
else
    echo "⚠️  ML setup incomplete. Please check errors above."
    echo ""
    echo "Common fixes:"
    echo "1. Install Python deps: pip3 install -r ml/requirements.txt"
    echo "2. Make scripts executable: chmod +x ml/*.py"
fi

# Cleanup
rm -f /tmp/train_result.json /tmp/predict_result.json
