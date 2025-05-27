const app = require('./app'); 
const { checkConnection } = require('./config/database');
const createAllTable  = require('./utils/dbUtils');

const PORT = process.env.PORT || 4000; 

const startServer = async () => {
  try {
    await checkConnection();
    await createAllTable();
    app.listen(PORT, () => {
      console.log(`✅ Backend server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to initialize database:", error);
    process.exit(1);
  }
};

startServer();
