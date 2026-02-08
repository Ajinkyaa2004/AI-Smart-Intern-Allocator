const Notification = require('../models/Notification');
const User = require('../models/User');
const emailService = require('./emailService');

class NotificationService {
    /**
     * Create a notification (in-app and optionally email)
     */
    async createNotification({ recipientId, recipientRole, type, title, message, link, data, priority = 'MEDIUM', sendEmail = false, emailData = {} }) {
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
            
            // Send email if requested
            if (sendEmail) {
                try {
                    const user = await User.findById(recipientId);
                    if (user && user.email) {
                        await this.sendEmailNotification(type, user.email, emailData);
                    }
                } catch (emailError) {
                    console.error('[Notification] Email send failed:', emailError.message);
                    // Don't throw - in-app notification already created, additionalData = {}) {
        return this.createNotification({
            recipientId: studentUserId,
            recipientRole: 'STUDENT',
            type: 'ALLOCATION_PROPOSED',
            title: '🎉 New Internship Match Found!',
            message: `You've been matched with ${internshipTitle} at ${orgName}. Match score: ${Math.round(matchScore * 100)}%`,
            link: '/student/matches',
            priority: 'HIGH',
            sendEmail: true,
            emailData: {
                studentName: additionalData.studentName,
                internshipTitle,
                orgName,
                matchScore,
                location: additionalData.location,
                startDate: additionalData.startDate
            }
    }

    /**
     * Send email based on notification type
     */
    async sendEmailNotification(type, recipientEmail, data) {
        switch (type) {
            case 'ALLOCATION_PROPOSED':
                return emailService.sendAllocationConfirmation(recipientEmail, data);
            case 'ALLOCATION_ACCEPTED':
            case 'ALLOCATION_REJECTED':
                return emailService.sendCandidateAlert(recipientEmail, data);
            case 'DROPOUT':
                return emailService.sendDropoutNotification(recipientEmail, data);
            case 'RATING_REQUEST':
                return emailService.sendRatingRequest(recipientEmail, data);
            default:
                return emailService.sendNotificationEmail(recipientEmail, {
                    title: data.title,
                    message: data.message,
                    actionUrl: data.actionUrl
                });
        }
    }

    /**
     * Notify student about new allocation
     */, orgName, studentName) {
        return this.createNotification({
            recipientId: studentUserId,
            recipientRole: 'STUDENT',
            type: 'RATING_REQUEST',
            title: '⭐ Rate Your Internship Experience',
            message: `Please share your feedback about ${internshipTitle}. Your input helps improve future allocations!`,
            link: '/student/feedback',
            priority: 'MEDIUM',
            sendEmail: true,
            emailData: {
                studentName,
                internshipTitle,
                orgName
            }tches',
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
