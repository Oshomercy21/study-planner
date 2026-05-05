let reminderStarted = false;

export function startReminderSystem() {
  if (reminderStarted) return;
  reminderStarted = true;

  if (!("Notification" in window)) return;

  if (Notification.permission === "default") {
    Notification.requestPermission();
  }

  setInterval(() => {
    const enabled = localStorage.getItem("remindersEnabled");
    if (enabled === "false") return;

    if (Notification.permission !== "granted") return;

    const studyPlan =
      JSON.parse(localStorage.getItem("semesterStudyPlan")) || [];

    const now = new Date();
    const today = now.toLocaleDateString("en-US", { weekday: "long" });

    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    studyPlan.forEach((session) => {
      const sessionDay = session.studyDay || session.day;
      if (sessionDay !== today) return;

      const sessionHour = convertTo24Hour(
        session.startHour,
        session.startPeriod
      );

      const sessionMinute = Number(session.startMinute || 0);

      const reminderKey = `reminded-${session.id}-${today}-${sessionHour}-${sessionMinute}`;

      if (
        currentHour === sessionHour &&
        currentMinute === sessionMinute &&
        !localStorage.getItem(reminderKey)
      ) {
        new Notification("Study Reminder 📚", {
          body: `Time to study ${session.courseCode || "your course"}${
            session.courseTitle ? ` - ${session.courseTitle}` : ""
          }`,
        });

        localStorage.setItem(reminderKey, "true");
      }
    });
  }, 30000);
}

function convertTo24Hour(hour, period) {
  let h = Number(hour);

  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;

  return h;
}