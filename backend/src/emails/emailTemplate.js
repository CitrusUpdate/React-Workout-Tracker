export function createWelcomeEmailTemplate(name, clientURL) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Workout Tracker!</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #e0e0e0; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #121212;">
    <div style="background: linear-gradient(to right, #2a2a2a, #1a1a1a); padding: 30px; text-align: center; border-radius: 12px 12px 0 0; border-bottom: 2px solid #36D1DC;">
      <img src="https://img.freepik.com/free-photo/male-athlete-plank-pose-exercising-strength-sports-training-gym_637285-8314.jpg?t=st=1767470815~exp=1767474415~hmac=0b83df5f13f3b7a29001d88dc36b33056ce8f2849c622f490e8f09d8ff4f106e" alt="Man working out" style="width: 80px; height: 80px; margin-bottom: 20px; border-radius: 50%; background-color: #2a2a2a; padding: 10px; border: 2px solid #36D1DC;">
      <h1 style="color: #36D1DC; margin: 0; font-size: 28px; font-weight: 500; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">Welcome to Workout Tracker!</h1>
    </div>
    <div style="background-color: #1e1e1e; padding: 35px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); border: 1px solid #2a2a2a;">
      <p style="font-size: 18px; color: #36D1DC;"><strong>Hello ${name},</strong></p>
      <p style="color: #b0b0b0;">We're excited to have you join our workout tracker. Create and track your workouts wherever you are and see your progress!</p>
      
      <div style="background-color: #2a2a2a; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #5B86E5;">
        <p style="font-size: 16px; margin: 0 0 15px 0; color: #ffffff;"><strong>Get started in just a few steps:</strong></p>
        <ul style="padding-left: 20px; margin: 0; color: #b0b0b0;">
          <li style="margin-bottom: 10px;">Complete initial survey</li>
          <li style="margin-bottom: 10px;">Create your workout plan</li>
          <li style="margin-bottom: 10px;">Start working out</li>
          <li style="margin-bottom: 10px;">Fill your workout results</li>
          <li style="margin-bottom: 0;">See your progress on the main dashboard!</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${clientURL}" style="background: linear-gradient(to right, #36D1DC, #5B86E5); color: white; text-decoration: none; padding: 12px 30px; border-radius: 50px; font-weight: 500; display: inline-block; box-shadow: 0 4px 12px rgba(54, 209, 220, 0.3); transition: transform 0.2s;">
          Open Workout Tracker
        </a>
      </div>
      
      <p style="margin-bottom: 5px; color: #b0b0b0;">If you need any help or have questions, we're always here to assist you.</p>
      <p style="margin-top: 0; color: #b0b0b0;">Good workouts!</p>
      
      <p style="margin-top: 25px; margin-bottom: 0; color: #b0b0b0;">
        Best regards,<br>
        <span style="color: #36D1DC;">The Workout Tracker team</span>
      </p>
    </div>
    
    <div style="text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #2a2a2a; margin-top: 20px;">
      <p>© ${new Date().getFullYear()} Workout Tracker. All rights reserved.</p>
      <p>
        <a href="#" style="color: #5B86E5; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
        <a href="#" style="color: #5B86E5; text-decoration: none; margin: 0 10px;">Terms of Service</a>
        <a href="#" style="color: #5B86E5; text-decoration: none; margin: 0 10px;">Contact Us</a>
      </p>
    </div>
  </body>
  </html>
  `;
}