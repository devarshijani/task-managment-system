const welcomeUserEmail = (name, email, password) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to Task Management System!</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>Your account has been created. Here are your login credentials:</p>
      <div style="background: #f4f4f4; padding: 15px; border-radius: 5px;">
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
      </div>
      <p style="color: red;">Please change your password after first login.</p>
      <p>Regards,<br/>Task Management Team</p>
    </div>
  `;
};

module.exports = { welcomeUserEmail };