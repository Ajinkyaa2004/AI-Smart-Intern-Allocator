# ML Model Quick Reference

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install
pip3 install -r ml/requirements.txt

# 2. Train model (need historical data)
curl -X POST http://localhost:3000/api/v1/ml/train \
  -H "Authorization: Bearer ADMIN_TOKEN"

# 3. Enable ML scoring
# Add to .env: USE_ML_SCORING=true

# 4. Run allocation with ML
curl -X POST http://localhost:3000/api/v1/ml/allocation/run \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{"useML": true}'
```

## 📊 Model Info

**Algorithm**: Random Forest (100 trees)
**Input**: 15 features (skills, GPA, location, etc.)
**Output**: Match score 0-1 + confidence

## 🔑 Key Features Used

| Feature | Importance |
|---------|-----------|
| Skill Overlap Ratio | 32% |
| GPA | 18% |
| Avg Skill Level | 15% |
| Domain Match | 12% |
| Location Match | 10% |
| Others | 13% |

## 🎯 Scoring Formula

```
Final Score = (ML Score × 0.6) + (Rule Score × 0.4)
```

## 📡 API Endpoints

### Train Model
```http
POST /api/v1/ml/train
Authorization: Bearer {admin_token}
```

### Check Status
```http
GET /api/v1/ml/status
Authorization: Bearer {admin_token}
```

### Predict Single
```http
POST /api/v1/ml/predict-single
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "studentId": "...",
  "internshipId": "...",
  "includeConfidence": true
}
```

## ⚙️ Configuration

```env
# .env
USE_ML_SCORING=true
```

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| Model not trained | Run `/api/v1/ml/train` first |
| Python not found | Install Python 3.8+ |
| Need 10+ samples | Build history first |
| Low accuracy | Retrain with more data |

## 📈 When to Retrain

- After 50 new allocations
- Monthly
- After major changes
- When accuracy drops

## 💡 Tips

1. Start with rule-based, collect data
2. Train when you have 50+ allocations
3. Monitor train vs test scores
4. Retrain periodically
5. Use hybrid approach for reliability
