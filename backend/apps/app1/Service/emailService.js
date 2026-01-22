const nodemailer = require('nodemailer');

/**
 * CONFIGURATION FOR OUTLOOK 365
 * Outlook uses port 587 with STARTTLS encryption.
 */
//Loptop
const baseUrl  = 'http://192.168.5.92:4001/exist/drawingrequest/';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        // user: 'tongmeanlove15@gmail.com',
        // pass: 'piin cfrp bvih ucxu', 
        user: 'drp021@compact-brake.com',
        pass: 't l p h e o i j z j f b x f k s', 
    }
 
});
const sendRequesterNotification = async (requesterEmail, postTitle, payload, insertedRequest, position, username) => {
    // console.log('Preparing to send email to requester:', requesterEmail);
    // console.log('postTitle', postTitle);
    // console.log('payload', payload);
    const toReciver = [requesterEmail];
    // toReciver.push("tongmeanfc@gmail.com")
    const mailOptions = {
      from: `"Drawing System Notification" <noreply@yourdomain.com>`,
      to: [toReciver],
      subject: `Your Drawing Request ${payload.request_no} Has Been Submitted`,
      
      text: `Your drawing request for "${postTitle}" (Request #${payload.request_no}) has been successfully submitted`,
      
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <!-- Header -->
          <div style="background-color: #004a99; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Drawing Request System</h1>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 30px; background-color: #f9f9f9;">
            <h2 style="color: #004a99; margin-top: 0;">Request Submitted Successfully</h2>
            
            <p>Dear Requester,</p>
            
            <p>Your drawing request has been successfully submitted.</p>
            <p>Please see bellow detail.</p>
            
            <!-- Request Details Box -->
            <div style="background-color: #ffffff; border-left: 4px solid #004a99; padding: 15px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>หัวข้อ:</strong> ${postTitle}</p>
              <p style="margin: 5px 0;"><strong>เลขที่ขอ:</strong> ${payload.request_no}</p>
              <p style="margin: 5px 0;"><strong>หน่วยงาน:</strong> ${payload.department}</p>
              <p style="margin: 5px 0;">
                <strong>ประเภทที่ขอ:</strong>
                ${payload.request_item
                    .map(item => item.document_name)
                    .join(', ')
                }
              </p>

              <p style="margin: 5px 0;"><strong>ตำแหน่ง:</strong> <span style="color: #28a745;">${position}</span></p>
              <p style="margin: 5px 0;"><strong>ชื่อ:</strong> <span style="color: #28a745;">${username}</span></p>
              <p style="margin: 5px 0;"><strong>สถานะ:</strong> <span style="color: #28a745;">Submmited</span></p>
            </div>
            
            <p>คำขอของคุณได้ถูกส่งไปยังผู้อนุมัติเรียบร้อยแล้ว</p>
            
            <!-- Action Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${baseUrl}${insertedRequest.request_id}" 
                 style="background-color: #004a99; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Print Request Form
              </a>
            </div>
            
            <p style="font-size: 12px; color: #666; margin-top: 30px;">
              <strong>Note:</strong> You will receive another notification once your request has been reviewed.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #333; padding: 20px; text-align: center;">
            <p style="color: #999; font-size: 11px; margin: 5px 0;">
              This is an automated message. Please do not reply to this email.
            </p>
            <p style="color: #999; font-size: 11px; margin: 5px 0;">
              Reference ID: ${insertedRequest.request_id}
            </p>
            <p style="color: #999; font-size: 11px; margin: 5px 0;">
              © ${new Date().getFullYear()} Drawing System. All rights reserved.
            </p>
          </div>
        </div>
      `,
      
      headers: {
        'X-Priority': '3',
        'X-Mailer': 'Nodemailer'
      }
    };

    return transporter.sendMail(mailOptions);
};
// Function for Approver
const sendApproverNotification = async (requesterEmail, postTitle, payload, position, username) => {
    const toReciver = [requesterEmail];
    // toReciver.push("tongmeanfc@gmail.com")
    const mailOptions = {
      from: `"Drawing System Notification" <noreply@yourdomain.com>`,
      to: [toReciver],
      subject: `Your Drawing Request ${payload.request_no} Has Been Approved`,
      
      text: `Your drawing request for "${postTitle}" (Request #${payload.request_no}) has been Approved`,
      
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <!-- Header -->
          <div style="background-color: #004a99; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Drawing Request System</h1>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 30px; background-color: #f9f9f9;">
            <h2 style="color: #004a99; margin-top: 0;">Request have been Approved</h2>
            
            <p>Dear Requester,</p>
            
            <p>Your drawing request has been successfully submitted.</p>
            <p>Please see bellow detail.</p>
            
            <!-- Request Details Box -->
            <div style="background-color: #ffffff; border-left: 4px solid #004a99; padding: 15px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>หัวข้อ:</strong> ${postTitle}</p>
              <p style="margin: 5px 0;"><strong>เลขที่ขอ:</strong> ${payload.request_no}</p>
              <p>
                    <strong>File Path:</strong><br />
                    ${payload.urls.join('<br />')}
                </p>


              <p style="margin: 5px 0;"><strong>ตำแหน่ง:</strong> <span style="color: #28a745;">${position}</span></p>
              <p style="margin: 5px 0;"><strong>ชื่อ:</strong> <span style="color: #28a745;">${username}</span></p>
              <p style="margin: 5px 0;"><strong>สถานะ:</strong> <span style="color: #28a745;">Submmited</span></p>
            </div>
            
            <p>คำขอของคุณได้ถูกส่งไปยังผู้อนุมัติเรียบร้อยแล้ว</p>
            
            <!-- Action Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${baseUrl}${payload.request_id}" 
                 style="background-color: #004a99; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Print Request Form
              </a>
            </div>
            
            <p style="font-size: 12px; color: #666; margin-top: 30px;">
              <strong>Note:</strong> You will receive another notification once your request has been reviewed.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #333; padding: 20px; text-align: center;">
            <p style="color: #999; font-size: 11px; margin: 5px 0;">
              This is an automated message. Please do not reply to this email.
            </p>
            <p style="color: #999; font-size: 11px; margin: 5px 0;">
              Reference ID: ${payload.request_id}
            </p>
            <p style="color: #999; font-size: 11px; margin: 5px 0;">
              © ${new Date().getFullYear()} Drawing System. All rights reserved.
            </p>
          </div>
        </div>
      `,
      
      headers: {
        'X-Priority': '3',
        'X-Mailer': 'Nodemailer'
      }
    };

    return transporter.sendMail(mailOptions);
};

// 2. EXPORT USING COMMONJS (This fixes your error)
module.exports = {
    sendRequesterNotification,
    sendApproverNotification
  };