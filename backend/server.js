
const app = require('./app'); 
const { checkConnection } = require('./config/database');
const {default: createAllTable } = require('./utils/dbUtils');

const PORT = 4000;
app.listen(PORT, async() => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  try{
    await checkConnection();
    await createAllTable();
  }catch(error){
    console.log("Failed to initialize database", error)
  }
});
