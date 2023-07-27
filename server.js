const app = require('./src/app');
require('dotenv').config();

const PORT = process.env.PORT || 4090;

const server = app.listen(PORT, () => {
   console.log(`Server is running on port ${server.address().port}`);
});

process.on('SIGINT', () => {
   server.close(() => {
      console.log(`Server closed!`);
      process.exit(0);
   });
});

