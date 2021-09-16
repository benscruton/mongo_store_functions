require("dotenv").config();
const {MongoClient} = require("mongodb");

async function main(){
  const dbName = process.env.DB_NAME || "fnTest";
  const connectionString = process.env.DB_CONNECTION || "mongodb://localhost/";

  const connectionOptions = {useNewUrlParser: true, useUnifiedTopology: true };
  const client = new MongoClient(connectionString, connectionOptions);

  const record = {
    key: "blarg",
    func: (x) => {
      x += 1;
      x **= 2;
      return x;
    },
    backupFunc: x => (x+1)**2
  };

  for(let key in record){
    if(typeof record[key] === "function"){
      record[key] = record[key].toString();
    }
  }

  try{
    await client.connect();
    const database = client.db(dbName);
    const testy = database.collection("testy");
    const obj = await testy.findOne({key: "blarg"});
    const f1 = eval(obj.func);
    const f2 = eval(obj.backupFunc);
    console.log(f1(5));
    console.log(f2(5));
  }
  catch (e) {
    console.error(e);
  }
  finally {
    await client.close();
    console.log("Did some stuff yo");
  }
};

async function listDatabases(client){
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

main().catch(console.error);