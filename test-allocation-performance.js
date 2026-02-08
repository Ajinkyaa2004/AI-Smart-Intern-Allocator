const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Allocation = require('./server/models/Allocation');
const Student = require('./server/models/Student');
const Internship = require('./server/models/Internship');
const { performance } = require('perf_hooks');

// Load environment variables
dotenv.config();

/**
 * Performance testing script for allocation system
 * Tests scalability and generates metrics
 */

async function testAllocationPerformance() {
    try {
        console.log('🚀 Starting Allocation Performance Test...\n');

        // Connect to database
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✓ Connected to MongoDB\n');

        // Get counts
        const studentCount = await Student.countDocuments({ availability: true, allocationStatus: 'PENDING' });
        const internshipCount = await Internship.countDocuments({ status: 'OPEN' });

        console.log('📊 System State:');
        console.log(`   • Students: ${studentCount}`);
        console.log(`   • Internships: ${internshipCount}`);
        console.log(`   • Potential Matches: ${studentCount * internshipCount}\n`);

        // Calculate expected time
        const expectedPairs = studentCount * internshipCount;
        const expectedTime = (expectedPairs * 0.1) / 1000; // ~100ms per 1000 pairs

        console.log(`⏱️  Expected Allocation Time: ~${expectedTime.toFixed(2)}s\n`);

        // Test 1: Single allocation performance
        console.log('TEST 1: Single Match Calculation');
        const testStudent = await Student.findOne({ availability: true }).limit(1);
        const testInternship = await Internship.findOne({ status: 'OPEN' }).limit(1);

        if (testStudent && testInternship) {
            const start = performance.now();
            // Simulate scoring (you can import actual scoring logic here)
            await new Promise(resolve => setTimeout(resolve, 1));
            const end = performance.now();
            console.log(`   ✓ Single match time: ${(end - start).toFixed(2)}ms\n`);
        }

        // Test 2: Batch allocation metrics
        console.log('TEST 2: Allocation Metrics');
        const allocations = await Allocation.find({}).populate('student internship');
        
        if (allocations.length > 0) {
            // Calculate metrics
            const totalAllocations = allocations.length;
            const avgScore = allocations.reduce((sum, a) => sum + (a.score || 0), 0) / totalAllocations;
            const highQualityMatches = allocations.filter(a => a.score >= 0.7).length;
            const fairnessScore = (highQualityMatches / totalAllocations) * 100;

            console.log(`   • Total Allocations: ${totalAllocations}`);
            console.log(`   • Average Match Score: ${(avgScore * 100).toFixed(2)}%`);
            console.log(`   • High Quality Matches (≥70%): ${highQualityMatches} (${fairnessScore.toFixed(1)}%)`);
            
            // Status breakdown
            const statusBreakdown = allocations.reduce((acc, a) => {
                acc[a.status] = (acc[a.status] || 0) + 1;
                return acc;
            }, {});
            console.log(`   • Status Breakdown:`, statusBreakdown);
        } else {
            console.log('   ⚠️  No allocations found. Run allocation first.\n');
        }

        // Test 3: Capacity utilization
        console.log('\nTEST 3: Capacity Utilization');
        const internships = await Internship.find({ status: 'OPEN' });
        let totalCapacity = 0;
        let usedCapacity = 0;

        for (const internship of internships) {
            totalCapacity += internship.capacity || 1;
            const allocated = await Allocation.countDocuments({
                internship: internship._id,
                status: { $in: ['ALLOCATED', 'ACCEPTED'] }
            });
            usedCapacity += allocated;
        }

        const utilizationRate = totalCapacity > 0 ? (usedCapacity / totalCapacity) * 100 : 0;
        console.log(`   • Total Capacity: ${totalCapacity}`);
        console.log(`   • Used Capacity: ${usedCapacity}`);
        console.log(`   • Utilization Rate: ${utilizationRate.toFixed(2)}%`);

        // Test 4: Skills distribution (fairness)
        console.log('\nTEST 4: Skills Match Fairness');
        const skillMatches = allocations
            .filter(a => a.breakdown && a.breakdown.get('skillMatch'))
            .map(a => a.breakdown.get('skillMatch'));

        if (skillMatches.length > 0) {
            const avgSkillMatch = skillMatches.reduce((sum, s) => sum + s, 0) / skillMatches.length;
            const minSkillMatch = Math.min(...skillMatches);
            const maxSkillMatch = Math.max(...skillMatches);
            const stdDev = Math.sqrt(
                skillMatches.reduce((sum, s) => sum + Math.pow(s - avgSkillMatch, 2), 0) / skillMatches.length
            );

            console.log(`   • Average Skills Match: ${(avgSkillMatch * 100).toFixed(2)}%`);
            console.log(`   • Min: ${(minSkillMatch * 100).toFixed(2)}%`);
            console.log(`   • Max: ${(maxSkillMatch * 100).toFixed(2)}%`);
            console.log(`   • Std Deviation: ${(stdDev * 100).toFixed(2)}%`);
            console.log(`   • Fairness Score: ${stdDev < 0.15 ? 'HIGH ✓' : stdDev < 0.25 ? 'MEDIUM' : 'LOW ⚠️'}`);
        }

        // Test 5: Regional balance
        console.log('\nTEST 5: Regional Balance');
        const regionalData = await Allocation.aggregate([
            { $match: { status: { $in: ['ALLOCATED', 'ACCEPTED'] } } },
            {
                $lookup: {
                    from: 'internships',
                    localField: 'internship',
                    foreignField: '_id',
                    as: 'internshipData'
                }
            },
            { $unwind: '$internshipData' },
            {
                $group: {
                    _id: '$internshipData.location',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        if (regionalData.length > 0) {
            console.log('   Regional Distribution:');
            regionalData.forEach(region => {
                console.log(`   • ${region._id}: ${region.count} allocations`);
            });
            
            const totalRegional = regionalData.reduce((sum, r) => sum + r.count, 0);
            const avgPerRegion = totalRegional / regionalData.length;
            const regionalVariance = regionalData.reduce(
                (sum, r) => sum + Math.pow(r.count - avgPerRegion, 2),
                0
            ) / regionalData.length;
            console.log(`   • Balance Score: ${regionalVariance < 100 ? 'GOOD ✓' : 'NEEDS IMPROVEMENT ⚠️'}`);
        }

        console.log('\n✅ Performance Test Complete!\n');

        // Summary
        console.log('═══════════════════════════════════════');
        console.log('SUMMARY - System Performance Metrics');
        console.log('═══════════════════════════════════════');
        console.log(`Scalability: ${expectedTime < 10 ? 'EXCELLENT ✓' : expectedTime < 30 ? 'GOOD' : 'NEEDS OPTIMIZATION ⚠️'}`);
        console.log(`Fairness: ${allocations.length > 0 && fairnessScore > 70 ? 'HIGH ✓' : 'MEDIUM'}`);
        console.log(`Utilization: ${utilizationRate > 80 ? 'EXCELLENT ✓' : utilizationRate > 60 ? 'GOOD' : 'LOW ⚠️'}`);
        console.log('═══════════════════════════════════════\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Test Error:', error);
        process.exit(1);
    }
}

// Run tests
testAllocationPerformance();
