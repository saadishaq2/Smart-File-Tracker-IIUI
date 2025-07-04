export const suggestReminder = async (req, res) => {
  const { dueDate } = req.body;
  const due = new Date(dueDate);
  if (isNaN(due.getTime())) {
    return res.status(400).json({ error: "Invalid due date" });
  }

  const now = new Date();
  const timeDiff = due.getTime() - now.getTime();
  const oneHour = 60 * 60 * 1000;
  const oneDay = 24 * oneHour;

  let reminderAt;

  if (timeDiff <= oneHour) {
    // Due soon: 15 mins before
    reminderAt = new Date(due.getTime() - 15 * 60 * 1000);
  } else if (timeDiff <= 3 * oneHour) {
    // Due in few hours: 1 hour before
    reminderAt = new Date(due.getTime() - oneHour);
  } else if (timeDiff <= oneDay) {
    // Due today: 3 hours before
    reminderAt = new Date(due.getTime() - 3 * oneHour);
  } else if (timeDiff <= 3 * oneDay) {
    // Due in 2–3 days: remind 1 day before at 10 AM
    reminderAt = new Date(due.getTime() - oneDay);
    reminderAt.setHours(10, 0, 0, 0);
  } else {
    // Due later: remind 2 days before at 10 AM
    reminderAt = new Date(due.getTime() - 2 * oneDay);
    reminderAt.setHours(10, 0, 0, 0);
  }

  // Fallback if reminder is in the past
  if (reminderAt < now) {
    reminderAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 mins from now
  }

  return { reminderAt: reminderAt.toISOString() };
};

