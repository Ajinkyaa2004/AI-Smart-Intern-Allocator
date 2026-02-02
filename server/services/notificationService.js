const Notification = require('../models/Notification');
const User = require('../models/User');

class NotificationService {
    /**
     * Create a notification
     */
    async createNotification({ recipientId, recipientRole, type, title, message, link, data, priority = 'MEDIUM' }) {
        try {
            const notification = await Notification.create({
                recipient: recipientId,
                recipientRole,
                type,
                title,
                message,
                link,
                data,
                priority
            });

            console.log(`[Notification] Created ${type} for user ${recipientId}`);
            return notification;
        } catch (error) {
            console.error('[Notification] Error creating notification:', error);
            throw error;
        }
    }

    /**
     * Notify student about new allocation
     */
    async notifyAllocationProposed(studentUserId, internshipTitle, orgName, matchScore) {
        return this.createNotification({
            recipientId: studentUserId,
            recipientRole: 'STUDENT',
            type: 'ALLOCATION_PROPOSED',
            title: '🎉 New Internship Match Found!',
            message: `You've been matched with ${internshipTitle} at ${orgName}. Match score: ${Math.round(matchScore * 100)}%`,
            link: '/student/matches',
            priority: 'HIGH'
        });
    }

    /**
     * Notify organization about student acceptance
     */
    async notifyAllocationAccepted(orgUserId, studentBlindId, internshipTitle) {
        return this.createNotification({
            recipientId: orgUserId,
            recipientRole: 'ORG',
            type: 'ALLOCATION_ACCEPTED',
            title: '✅ Student Accepted Your Offer!',
            message: `Student ${studentBlindId} has accepted the offer for ${internshipTitle}`,
            link: '/org/candidates',
            priority: 'HIGH'
        });
    }

    /**
     * Notify organization about student rejection
     */
    async notifyAllocationRejected(orgUserId, studentBlindId, internshipTitle) {
        return this.createNotification({
            recipientId: orgUserId,
            recipientRole: 'ORG',
            type: 'ALLOCATION_REJECTED',
            title: '❌ Student Declined Offer',
            message: `Student ${studentBlindId} has declined the offer for ${internshipTitle}`,
            link: '/org/candidates',
            priority: 'MEDIUM'
        });
    }

    /**
     * Request rating from student
     */
    async requestStudentRating(studentUserId, internshipTitle) {
        return this.createNotification({
            recipientId: studentUserId,
            recipientRole: 'STUDENT',
            type: 'RATING_REQUEST',
            title: '⭐ Rate Your Internship Experience',
            message: `Please share your feedback about ${internshipTitle}. Your input helps improve future allocations!`,
            link: '/student/feedback',
            priority: 'MEDIUM'
        });
    }

    /**
     * Notify about incomplete profile
     */
    async notifyIncompleteProfile(userUserId, role, completionPercentage) {
        return this.createNotification({
            recipientId: userUserId,
            recipientRole: role,
            type: 'PROFILE_INCOMPLETE',
            title: '📝 Complete Your Profile',
            message: `Your profile is ${completionPercentage}% complete. Add more details to get better matches!`,
            link: role === 'STUDENT' ? '/student/profile' : '/org/profile',
            priority: 'LOW'
        });
    }

    /**
     * Notify students about new internship postings
     */
    async notifyNewInternship(studentUserIds, internshipTitle, orgName) {
        const notifications = studentUserIds.map(userId => 
            this.createNotification({
                recipientId: userId,
                recipientRole: 'STUDENT',
                type: 'NEW_INTERNSHIP',
                title: '🆕 New Internship Available',
                message: `${orgName} posted a new internship: ${internshipTitle}`,
                link: '/student/matches',
                priority: 'LOW'
            })
        );

        return Promise.all(notifications);
    }

    /**
     * System alert for admins
     */
    async notifyAdminAlert(adminUserIds, title, message) {
        const notifications = adminUserIds.map(userId =>
            this.createNotification({
                recipientId: userId,
                recipientRole: 'ADMIN',
                type: 'SYSTEM_ALERT',
                title,
                message,
                link: '/admin/analytics',
                priority: 'URGENT'
            })
        );

        return Promise.all(notifications);
    }
}

module.exports = new NotificationService();
