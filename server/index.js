import { PORT } from './config/env.js';
import { initDb } from './services/bootstrapService.js';
import { startRetention } from './services/retentionService.js';
import { createApp } from './app.js';

await initDb();
startRetention();
createApp().listen(PORT, () => console.log(`Art et saveur by Aude → http://localhost:${PORT}  (admin: /admin)`));
