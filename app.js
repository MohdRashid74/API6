const express = require("express");
const app = express();
const { open } = require("sqlite");
const path = require("path");
const dbpath = path.join(__dirname, "covid19India.db");
app.use(express.json());
const sqlite3 = require("sqlite3");
let db = null;

const initializationdbserver = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Started at http://localhost3000/");
    });
  } catch (e) {
    console.log(`Error:${e.message}`);
    process.exit(1);
  }
};
initializationdbserver();

//API 1

app.get("/states/", async (request, response) => {
  const getquery = `
    SELECT *
    FROM state`;
  const final = await db.all(getquery);
  response.send(final);
});

//API 2

app.get("/states/:stateId/", async (request, response) => {
  const { stateId } = request.params;
  const getindivisiualquery = `
    SELECT *
    FROM state
    WHERE state_id=${stateId}`;
  const final2 = await db.get(getindivisiualquery);
  response.send(final2);
});

//API 3
app.post("/districts/", async (request, response) => {
  const postdetail = request.body;
  const { districtName, stateId, cases, cured, active, deaths } = postdetail;
  const postvalue = `
         INSERT INTO
         district (district_name,state_id,cases,cured,active,deaths)
         VALUES(
             "${districtName}",${stateId},${cases},${cured},${active},${deaths}
         )`;
  const final4 = await db.run(postvalue);
  const result = final4.lastID;
  response.send("District Successfully Added");
});
//API 4

app.get("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const getdistrictquery = `
      SELECT *
      FROM district 
      WHERE district_id=${districtId}`;
  const final5 = await db.get(getdistrictquery);
  response.send(final5);
});

//API 5

app.delete("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const deletequery = `
    DELETE FROM 
    district
    WHERE district_id=${districtId}`;
  const final6 = await db.run(deletequery);
  response.send("District Removed");
});

//API 6
app.put("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const putdetails = request.body;
  const { districtName, stateId, cases, cured, active, deaths } = putdetails;
  const final8 = `
  UPDATE district 
  SET 
  district_name="${districtName}",
  state_id=${stateId},
  cases=${cases},
  cured=${cured},
  active=${active},
  deaths=${deaths},
  WHERE 
  district_id=${districtId}`;
  const final9 = await db.run(final8);
  response.send(final9);
});
