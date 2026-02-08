const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

class EmailService {
    constructor() {
        this.transporter = null;
        this.emailEnabled = process.env.EMAIL_ENABLED === 'true';
        
        if (this.emailEnabled) {
            this.initializeTransporter();
        }
    }

    initializeTransporter() {
        try {
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT) || 587,
                secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD
                }
            });

            // Verify connection
            this.transporter.verify((error, success) => {
                if (error) {
                    console.error('[Email] SMTP connection error:', error.message);
                } else {
                    console.log('[Email] SMTP server ready to send emails');
                }
            });
        } catch (error) {
            console.error('[Email] Failed to initialize email service:', error.message);
            this.emailEnabled = false;
        }
    }

    /**
     * Load and populate email template
     */
    loadTemplate(templateName, variables) {
        try {
            const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.html`);
            let template = fs.readFileSync(templatePath, 'utf-8');

            // Replace variables in template
            Object.keys(variables).forEach(key => {
                const regex = new RegExp(`{{${key}}}`, 'g');
                template = template.replace(regex, variables[key]);
            });

            return template;
        } catch (error) {
            console.error(`[Email] Template ${templateName} not found, using fallback`);
            return this.fallbackTemplate(templateName, variables);
        }
    }

    /**
     * Fallback template if HTML template not found
     */
    fallbackTemplate(templateName, variables) {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>${variables.title || 'InternMatch AI Notification'}</h2>
                <p>${variables.message || 'You have a new update from InternMatch AI.'}</p>
                ${variables.actionUrl ? `<a href="${variables.actionUrl}" style="background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">View Details</a>` : ''}
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                <p style="color: #666; font-size: 12px;">This is an automated email from InternMatch AI. Please do not reply.</p>
            </div>
        `;
    }

    /**
     * Send email
     */
    async sendEmail({ to, subject, html, text }) {
        if (!this.emailEnabled || !this.transporter) {
            console.log('[Email] Email service disabled, skipping send');
            return { success: false, reason: 'Email service not enabled' };
        }

        try {
            const mailOptions = {
                from: process.env.EMAIL_FROM || '"InternMatch AI" <noreply@internmatch.ai>',
                to,
                subject,
                html,
                text: text || subject
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log(`[Email] Sent to ${to}: ${info.messageId}`);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('[Email] Failed to send email:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Send allocation confirmation to student
     */
    async sendAllocationConfirmation(studentEmail, data) {
        const html = this.loadTemplate('allocation-confirmation', {
            studentName: data.studentName || 'Student',
            internshipTitle: data.internshipTitle,
            orgName: data.orgName,
            matchScore: Math.round(data.matchScore * 100),
            startDate: data.startDate || 'TBD',
            location: data.location || 'TBD',
            actionUrl: `${process.env.APP_URL}/student/matches`,
            year: new Date().getFullYear()
        });

        return this.sendEmail({
            to: studentEmail,
            subject: '🎉 Internship Allocation Confirmed - InternMatch AI',
            html
        });
    }

    /**
     * Send candidate alert to organization
     */
    async sendCandidateAlert(orgEmail, data) {
        const html = this.loadTemplate('candidate-alert', {
            orgName: data.orgName,
            internshipTitle: data.internshipTitle,
            studentBlindId: data.studentBlindId,
            matchScore: Math.round(data.matchScore * 100),
            skillsMatch: data.skillsMatch || 'N/A',
            actionUrl: `${process.env.APP_URL}/org/candidates`,
            year: new Date().getFullYear()
        });

        return this.sendEmail({
            to: orgEmail,
            subject: '👤 New Candidate Allocated - InternMatch AI',
            html
        });
    }

    /**
     * Send dropout notification
     */
    async sendDropoutNotification(recipientEmail, data) {
        const html = this.loadTemplate('dropout-notification', {
            recipientName: data.recipientName || 'User',
            internshipTitle: data.internshipTitle,
            dropoutReason: data.reason || 'Not specified',
            replacementInfo: data.replacementBlindId ? `Replacement candidate: ${data.replacementBlindId}` : 'Searching for replacement...',
            actionUrl: `${process.env.APP_URL}${data.dashboardPath}`,
            year: new Date().getFullYear()
        });

        return this.sendEmail({
            to: recipientEmail,
            subject: '⚠️ Dropout Alert - InternMatch AI',
            html
        });
    }

    /**
     * Send rating request to student
     */
    async sendRatingRequest(studentEmail, data) {
        const html = this.loadTemplate('rating-request', {
            studentName: data.studentName || 'Student',
            internshipTitle: data.internshipTitle,
            orgName: data.orgName,
            actionUrl: `${process.env.APP_URL}/student/feedback`,
            year: new Date().getFullYear()
        });

        return this.sendEmail({
            to: studentEmail,
            subject: '⭐ Rate Your Internship Experience',
            html
        });
    }

    /**
     * Send generic notification email
     */
    async sendNotificationEmail(recipientEmail, { title, message, actionUrl }) {
        const html = this.loadTemplate('generic-notification', {
            title,
            message,
            actionUrl: actionUrl || process.env.APP_URL,
            year: new Date().getFullYear()
        });

        return this.sendEmail({
            to: recipientEmail,
            subject: title,
            html
        });
    }
}

module.exports = new EmailService();
