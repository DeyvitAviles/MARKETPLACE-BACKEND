const mysql = require('mysql2');

const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "marketplace"
});


conexion.connect((error)=>{
    if(error){
        console.log("Error al conectar MySQL:", error);
        return;
    }

    console.log("MySQL conectado correctamente");
});


module.exports = conexion;