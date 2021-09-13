require("dotenv").config();
const {MongoClient} = require("mongodb");

async function main(){
  const dbName = process.env.DB_NAME || "fnTest";
  const connectionString = process.env.DB_CONNECTION || "mongodb://localhost/";

  const connectionOptions = {useNewUrlParser: true, useUnifiedTopology: true };
  const client = new MongoClient(connectionString, connectionOptions);

  try{
    await client.connect();
    const database = client.db(dbName);
    const testy = database.collection("testy");
    await testy.updateOne({key: "blarg"}, {$set: {rsp: x => x+1}});
    const obj = await testy.findOne({key: "blarg"});
    // const func = obj.rsp;
    // console.log(typeof JSON.parse(`${func}`));
    console.log(obj);
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