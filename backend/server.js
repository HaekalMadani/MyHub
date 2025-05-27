
const app = require('./app'); 
const { checkConnection } = require('./config/database');
const {default: createAllTable } = require('./utils/dbUtils');

app.listen(async() => {
  console.log(`Backend server running on`);
  try{
    await checkConnection();
    await createAllTable();
  }catch(error){
    console.log("Failed to initialize database", error)
  }
});
