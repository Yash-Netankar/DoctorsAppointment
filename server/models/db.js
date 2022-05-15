import mysql2 from "mysql2";

const con = mysql2.createConnection({
    database:"doctors_appointment",
    host:"localhost",
    user:"root",
    password:"",
})

con.connect(function(err){
    if(err){
        throw err;
    }
    else 
        console.log("Database Connected Successfully :)");
})

export default con