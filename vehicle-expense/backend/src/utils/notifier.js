const nodemailer = require('nodemailer');
const logger = require('../config/logger');
const config = require('../config/env');

class NotificationService {
  constructor() {
    this.transporter = null;
    this.initializeEmail();
  }

  // Initialize email transporter
  initializeEmail() {
    if (config.EMAIL_USER && config.EMAIL_PASS) {
      this.transporter = nodemailer.createTransporter({
        host: config.EMAIL_HOST,
        port: config.EMAIL_PORT,
        secure: false,
        auth: {
          user: config.EMAIL_USER,
          pass: config.EMAIL_PASS
        }
      });
    }
  }

  // Send email notification
  async sendEmail(to, subject, html, text = '') {
    try {
      if (!this.transporter) {
        logger.warn('Email transporter not configured');
        return false;
      }

      const mailOptions = {
        from: config.EMAIL_USER,
        to,
        subject,
        html,
        text
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully to ${to}: ${result.messageId}`);
      return true;
    } catch (error) {
      logger.error('Email sending failed:', error);
      return false;
    }
  }

  // Send expense shared notification
  async notifyExpenseShared(expense, sharedUsers) {
    try {
      const subject = `New Expense Shared: ${expense.title}`;
      
      for (const user of sharedUsers) {
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Expense Shared</h2>
            <p>Hello ${user.firstName},</p>
            <p>An exporter has shared a new expense with you:</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0;">${expense.title}</h3>
              <p><strong>Amount:</strong> ${expense.amount} ${expense.currency}</p>
              <p><strong>Category:</strong> ${expense.category.replace('_', ' ').toUpperCase()}</p>
              <p><strong>Date:</strong> ${new Date(expense.date).toLocaleDateString()}</p>
              ${expense.description ? `<p><strong>Description:</strong> ${expense.description}</p>` : ''}
            </div>
            
            <p>Please log in to your account to view and respond to this expense.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
              <p>This is an automated notification from the Vehicle Expense Management System.</p>
            </div>
          </div>
        `;

        await this.sendEmail(user.email, subject, html);
      }

      return true;
    } catch (error) {
      logger.error('Expense shared notification failed:', error);
      return false;
    }
  }

  // Send share status update notification
  async notifyShareStatusUpdate(expense, user, status, notes) {
    try {
      const subject = `Expense Status Updated: ${expense.title}`;
      
      const statusText = {
        accepted: 'accepted',
        rejected: 'rejected',
        requested_info: 'requested more information'
      };

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Expense Status Updated</h2>
          <p>Hello,</p>
          <p>The status of the shared expense has been updated:</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">${expense.title}</h3>
            <p><strong>Status:</strong> ${statusText[status] || status}</p>
            <p><strong>Updated by:</strong> ${user.firstName} ${user.lastName}</p>
            ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
          </div>
          
          <p>Please log in to your account to view the updated status.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            <p>This is an automated notification from the Vehicle Expense Management System.</p>
          </div>
        </div>
      `;

      // Send to exporter
      await this.sendEmail(expense.exporterId.email, subject, html);

      return true;
    } catch (error) {
      logger.error('Share status update notification failed:', error);
      return false;
    }
  }

  // Send welcome email
  async sendWelcomeEmail(user) {
    try {
      const subject = 'Welcome to Vehicle Expense Management System';
      
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Vehicle Expense Management System</h2>
          <p>Hello ${user.firstName},</p>
          <p>Welcome to the Vehicle Expense Management System! Your account has been created successfully.</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Account Details</h3>
            <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Role:</strong> ${user.role.replace('ROLE_', '').toLowerCase()}</p>
          </div>
          
          <p>You can now log in to your account and start using the system.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            <p>This is an automated notification from the Vehicle Expense Management System.</p>
          </div>
        </div>
      `;

      await this.sendEmail(user.email, subject, html);
      return true;
    } catch (error) {
      logger.error('Welcome email failed:', error);
      return false;
    }
  }

  // Send push notification (placeholder for future implementation)
  async sendPushNotification(userId, title, message, data = {}) {
    try {
      // In a real application, you would integrate with a push notification service
      // like Firebase Cloud Messaging (FCM) or Apple Push Notification Service (APNs)
      
      logger.info(`Push notification sent to user ${userId}: ${title} - ${message}`);
      return true;
    } catch (error) {
      logger.error('Push notification failed:', error);
      return false;
    }
  }

  // Send real-time notification via Socket.IO
  sendRealtimeNotification(io, userId, event, data) {
    try {
      io.to(`user_${userId}`).emit(event, data);
      logger.info(`Real-time notification sent to user ${userId}: ${event}`);
      return true;
    } catch (error) {
      logger.error('Real-time notification failed:', error);
      return false;
    }
  }
}

module.exports = new NotificationService();
