const { transporter, baseUrl } = require('./emailConfig');
const sendResponseNotification = async (postTitle, requestData, responseData, user ,payload, requestDateitemData) => {
    // console.log('Preparing to send email to requester:', requesterEmail);
    // console.log('postTitle', postTitle);
    // console.log('payload', payload);
    const {user_id, email, username, position} = user;
    const requestItems = requestData[0];
    const responseItems = responseData[0];
    // console.log('requestItems', requestItems);
    // console.log('responseItems', responseItems);
    const toReciver = [];
    // const requestDateitems = payload.requestDateitems
    // console.log('postTitle', postTitle);
    // console.log('payload', payload);
    // Reponser///
    // toReciver.push("Warawan@compact-brake.com")
    toReciver.push(responseItems.response_by, responseItems.assign_processor_email, responseItems.assign_approver_email, responseItems.email, requestItems.email)
    const mailOptions = {
      from: `"Drawing Request System Notification ${postTitle}" <noreply@yourdomain.com>`,
      to: [toReciver],
      subject: `Your Drawing Request ${postTitle} Has Been ${requestItems.status_name}`,
      
      text: `Your drawing request for "${postTitle}"  has been successfully ${requestItems.status_name}`,
      
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <!-- Header -->
          <div style="background-color: #004a99; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Drawing Request System</h1>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 30px; background-color: #f9f9f9;">
            
            <p>Dear,</p>
            
            <p>Your drawing request has been ${requestItems.status_name}.</p>
            <p>Please see bellow detail.</p>
            
            <!-- Request Details Box -->
            <div style="background-color: #ffffff; border-left: 4px solid #004a99; padding: 15px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>เลขที่ขอ:</strong> ${responseItems.request_no}</p>
              <p style="margin: 5px 0;"><strong>คำขอของคุณได้รับแล้ว:</strong> </p>
              <p style="margin: 5px 0;"><strong>คำขอของคุณได้รับแล้วและได้  Assign โคย:</strong> ${responseItems.response_by} </p>
              <p style="margin: 5px 0;"><strong>รายละเอียดผู้ดำเนินการ:</strong> </p>
              <p style="margin: 5px 0;"><strong>ผู้ดำเนินการ:</strong> ${responseItems.assign_processor_email} </p>
              <p style="margin: 5px 0;"><strong>ผู้อนุมัติ:</strong> ${responseItems.assign_approver_email}</p>
              <p style="margin: 5px 0;"><strong>ผู้ขอ:</strong> ${requestItems.email}</p>
              <p style="margin: 5px 0;">
                <strong>ประเภทที่ขอ:</strong>
              </p>
                <table style="width:100%; border-collapse:collapse;">
                <thead>
                    <tr>
                    <th style="border:1px solid #ddd;">#</th>
                    <th style="border:1px solid #ddd;">Request Date</th>
                    <th style="border:1px solid #ddd;">Expect Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${requestDateitemData
                    ?.map(
                        (item, index) => `
                        <tr>
                            <td style="border:1px solid #ddd;">${index + 1}</td>
                            <td style="border:1px solid #ddd;">${item.request_date}</td>
                            <td style="border:1px solid #ddd;">${item.expected_date}</td>
                        </tr>
                        `
                    )
                    .join('')}
                </tbody>
                </table>

              <p style="margin: 5px 0;"><strong>ตำแหน่ง:</strong> <span style="color: #28a745;">${position}</span></p>
              <p style="margin: 5px 0;"><strong>ชื่อ:</strong> <span style="color: #28a745;">${username}</span></p>
              <p style="margin: 5px 0;"><strong>สถานะ:</strong> <span style="color: #28a745;">${requestItems.status_name}</span></p>
            </div>
            
            <p>คำขอของคุณได้ถูกส่งไปยังผู้อนุมัติเรียบร้อยแล้ว</p>
            
            <!-- Action Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${baseUrl}${requestItems.id}" 
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
              Reference ID: ${requestItems.id}
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

module.exports = {
    sendResponseNotification
}