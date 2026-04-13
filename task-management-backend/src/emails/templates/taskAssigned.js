const taskAssignedEmail = (user, task, assignedBy) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; 
    margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; 
    overflow: hidden;">
      
      <!-- Header -->
      <div style="background-color: #4F46E5; padding: 20px; text-align: center;">
        <h2 style="color: white; margin: 0;">New Task Assigned</h2>
      </div>

      <!-- Body -->
      <div style="padding: 30px;">
        <p style="font-size: 16px;">Hi <strong>${user.name}</strong>,</p>
        <p>A new task has been assigned to you. Here are the details:</p>

        <!-- Task Details Table -->
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background: #f9f9f9;">
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 40%;">Task ID</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${task.taskId}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Title</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${task.title}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Description</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${task.description || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Priority</td>
            <td style="padding: 10px; border: 1px solid #ddd;">
              <span style="background: ${task.priority === "high" ? "#ff4444" :
            task.priority === "medium" ? "#ffaa00" : "#44bb44"
        }; color: white; padding: 3px 10px; border-radius: 12px;">
                ${task.priority.toUpperCase()}
              </span>
            </td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Project</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${task.project?.name || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Status</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${task.status}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Report To</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${task.reportTo?.name || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Assigned By</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${assignedBy.name}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Assigned At</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${new Date().toLocaleString()}</td>
          </tr>
        </table>

        <p style="color: #666; font-size: 14px;">
          Please log in to the system to view and start working on this task.
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #f4f4f4; padding: 15px; text-align: center;">
        <p style="margin: 0; color: #999; font-size: 12px;">
          Task Management System — This is an automated email, please do not reply.
        </p>
      </div>
    </div>
  `;
};

module.exports = { taskAssignedEmail };