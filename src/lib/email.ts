import emailjs from '@emailjs/browser';

/**
 * Utility to send email notifications to the admin via EmailJS.
 * This avoids the need for Firebase Cloud Functions for simple MVPs.
 */

interface EmailParams {
  type: 'Property Listing' | 'Property Requirement' | 'Home Shifting Request';
  userName: string;
  userPhone: string;
  details: string;
  location: string;
  budget?: string;
}

export const sendAdminNotification = async (params: EmailParams) => {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.warn('EmailJS credentials missing. Notification not sent.');
    return;
  }

  try {
    const response = await emailjs.send(
      serviceId,
      templateId,
      {
        notification_type: params.type,
        user_name: params.userName,
        user_phone: params.userPhone,
        post_details: params.details,
        location: params.location,
        budget: params.budget || 'N/A',
        admin_email: 'helpnestil@gmail.com',
      },
      publicKey
    );
    return response;
  } catch (error) {
    console.error('Failed to send email notification:', error);
    throw error;
  }
};
