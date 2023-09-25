const mysql = require('mysql');

//allowPublicKeyRetrieval: true
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD || '',
    user: process.env.DB_USER || 'root',
    database: process.env.DB_DATABASE || 'db',
    port: process.env.DB_PORT || 3306,
    multipleStatements: true,
});

//getConnection
const connect = pool.getConnection(function (err, connection) {
    if (err) {
        //connection.release();
        console.error('Error al conectarse a la base de datos:', err);
        //setTimeout(connect, 2000); // intenta reconectar después de 2 segundos
    } else {
        console.log('Conexión establecida con la base de datos');
    }
});

module.exports = pool;