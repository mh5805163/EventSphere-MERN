
import "dotenv/config";
import app from "./src/app.js";
import { startSessionReminders } from "./src/services/sessionreminders.js";

export default app;

// Local development only
if (process.env.NODE_ENV !== "production") {
  const port = Number(process.env.PORT || 3000);

  app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
    startSessionReminders();
  });
}
