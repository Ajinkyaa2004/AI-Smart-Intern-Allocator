#!/usr/bin/env python3
"""
Enhanced Sample Data Generator
Generates realistic students and internships for scalability testing
Usage: python3 ml/generate_full_sample_data.py --students 1000 --internships 200
"""

import json
import random
import argparse
from datetime import datetime, timedelta

# Sample data pools
FIRST_NAMES = [
    "Aarav", "Vivaan", "Aditya", "Arjun", "Sai", "Aryan", "Reyansh", "Krishna",
    "Aadhya", "Ananya", "Isha", "Diya", "Sara", "Priya", "Riya", "Aanya"
]

LAST_NAMES = [
    "Sharma", "Patel", "Kumar", "Singh", "Reddy", "Krishnan", "Gupta", "Desai",
    "Verma", "Jain", "Rao", "Iyer", "Nair", "Malhotra", "Chopra", "Mehta"
]

SKILLS = [
    "Python", "JavaScript", "React", "Node.js", "MongoDB", "SQL", "Java",
    "Machine Learning", "Data Analysis", "AWS", "Docker", "Git", "REST APIs",
    "HTML/CSS", "TypeScript", "Django", "Express", "PostgreSQL", "Redis",
    "Kubernetes", "CI/CD", "Agile", "Communication", "Problem Solving"
]

DOMAINS = [
    "Technology", "Finance", "Healthcare", "Education", "E-commerce",
    "Manufacturing", "Energy", "Agriculture", "Transportation", "Media"
]

CITIES = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata",
    "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Kochi"
]

DEGREES = ["B.Tech", "B.E.", "BCA", "B.Sc", "MCA", "M.Tech"]

ORGANIZATIONS = [
    {"name": "Tech Solutions India", "sector": "Technology"},
    {"name": "FinServe Corp", "sector": "Finance"},
    {"name": "HealthPlus Systems", "sector": "Healthcare"},
    {"name": "EduTech Ventures", "sector": "Education"},
    {"name": "ShopEasy Online", "sector": "E-commerce"},
    {"name": "GreenEnergy Ltd", "sector": "Energy"},
    {"name": "AgriGrow Solutions", "sector": "Agriculture"},
    {"name": "LogiMove Transport", "sector": "Transportation"},
    {"name": "MediaWorks Studio", "sector": "Media"},
    {"name": "CloudNine Tech", "sector": "Technology"}
]

JOB_TITLES = {
    "Technology": ["Software Developer Intern", "Full Stack Developer Intern", "ML Engineer Intern", "DevOps Intern"],
    "Finance": ["Financial Analyst Intern", "Risk Management Intern", "Trading Desk Intern"],
    "Healthcare": ["Healthcare IT Intern", "Clinical Data Analyst Intern", "Health Systems Intern"],
    "Education": ["EdTech Developer Intern", "Content Creator Intern", "Learning Analytics Intern"],
    "E-commerce": ["Product Manager Intern", "Growth Marketing Intern", "Backend Developer Intern"],
    "Energy": ["Energy Systems Analyst Intern", "Renewable Energy Intern", "Sustainability Intern"],
    "Agriculture": ["AgriTech Developer Intern", "Farm Analytics Intern", "Supply Chain Intern"],
    "Transportation": ["Logistics Analyst Intern", "Route Optimization Intern", "Fleet Management Intern"],
    "Media": ["Content Writer Intern", "Video Production Intern", "Social Media Intern"]
}

def generate_students(count):
    """Generate realistic student profiles"""
    students = []
    
    for i in range(count):
        first_name = random.choice(FIRST_NAMES)
        last_name = random.choice(LAST_NAMES)
        email = f"{first_name.lower()}.{last_name.lower()}{random.randint(1, 999)}@student.edu"
        
        # Generate skills (3-8 skills per student)
        num_skills = random.randint(3, 8)
        student_skills = random.sample(SKILLS, num_skills)
        skills = [
            {
                "name": skill,
                "level": random.randint(1, 5),
                "isVerified": random.choice([True, False])
            }
            for skill in student_skills
        ]
        
        # Academic info
        gpa = round(random.uniform(6.5, 9.5), 2)
        degree = random.choice(DEGREES)
        year = random.choice([2, 3, 4])
        
        # Preferences
        preferred_locations = random.sample(CITIES, random.randint(1, 3))
        preferred_domains = random.sample(DOMAINS, random.randint(1, 3))
        
        student = {
            "personal": {
                "firstName": first_name,
                "lastName": last_name,
                "email": email,
                "phone": f"+91{random.randint(7000000000, 9999999999)}",
                "dateOfBirth": f"{random.randint(2000, 2004)}-{random.randint(1, 12):02d}-{random.randint(1, 28):02d}"
            },
            "academic": {
                "degree": degree,
                "institution": f"Institute of Technology {random.choice(['Mumbai', 'Delhi', 'Bangalore'])}",
                "year": year,
                "gpa": gpa
            },
            "skills": skills,
            "preferences": {
                "locations": preferred_locations,
                "domains": preferred_domains,
                "duration": random.choice([8, 12, 16, 24]),
                "remote": random.choice([True, False])
            },
            "availability": True,
            "allocationStatus": "PENDING"
        }
        
        students.append(student)
    
    return students

def generate_internships(count):
    """Generate realistic internship postings"""
    internships = []
    
    for i in range(count):
        org = random.choice(ORGANIZATIONS)
        sector = org["sector"]
        title = random.choice(JOB_TITLES.get(sector, ["General Intern"]))
        
        # Required skills (3-6 skills)
        num_skills = random.randint(3, 6)
        required_skills = random.sample(SKILLS, num_skills)
        skills_required = [
            {
                "name": skill,
                "minLevel": random.randint(2, 4)
            }
            for skill in required_skills
        ]
        
        # Generate start date (1-6 months from now)
        start_date = datetime.now() + timedelta(days=random.randint(30, 180))
        duration = random.choice([8, 12, 16, 24])  # weeks
        
        internship = {
            "title": title,
            "organization": org["name"],
            "sector": sector,
            "description": f"Exciting opportunity to work on {sector.lower()} projects and gain hands-on experience.",
            "skillsRequired": skills_required,
            "location": random.choice(CITIES),
            "remote": random.choice([True, False]),
            "duration": duration,
            "stipend": random.choice([5000, 8000, 10000, 12000, 15000, 20000, 25000]),
            "capacity": random.randint(1, 10),
            "startDate": start_date.strftime("%Y-%m-%d"),
            "applicationDeadline": (start_date - timedelta(days=15)).strftime("%Y-%m-%d"),
            "status": "OPEN",
            "requirements": {
                "minGPA": round(random.uniform(6.0, 7.5), 1),
                "eligibleYears": random.sample([2, 3, 4], random.randint(1, 3))
            }
        }
        
        internships.append(internship)
    
    return internships

def main():
    parser = argparse.ArgumentParser(description='Generate sample data for InternMatch AI')
    parser.add_argument('--students', type=int, default=1000, help='Number of students to generate')
    parser.add_argument('--internships', type=int, default=200, help='Number of internships to generate')
    parser.add_argument('--output', type=str, default='sample_data.json', help='Output file name')
    
    args = parser.parse_args()
    
    print(f"🔄 Generating {args.students} students and {args.internships} internships...")
    
    students = generate_students(args.students)
    internships = generate_internships(args.internships)
    
    data = {
        "students": students,
        "internships": internships,
        "metadata": {
            "generated_at": datetime.now().isoformat(),
            "student_count": len(students),
            "internship_count": len(internships),
            "total_capacity": sum(i["capacity"] for i in internships),
            "avg_skills_per_student": sum(len(s["skills"]) for s in students) / len(students),
            "avg_skills_required": sum(len(i["skillsRequired"]) for i in internships) / len(internships)
        }
    }
    
    # Save to file
    with open(args.output, 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"✅ Generated {len(students)} students and {len(internships)} internships")
    print(f"📊 Total internship capacity: {data['metadata']['total_capacity']} positions")
    print(f"💾 Saved to: {args.output}")
    print(f"\n📈 Statistics:")
    print(f"   • Avg skills per student: {data['metadata']['avg_skills_per_student']:.1f}")
    print(f"   • Avg skills required: {data['metadata']['avg_skills_required']:.1f}")
    print(f"   • Potential matches: {len(students) * len(internships):,}")

if __name__ == '__main__':
    main()
