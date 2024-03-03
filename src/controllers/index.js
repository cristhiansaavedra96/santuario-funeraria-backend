const mysql = require('mysql');
const path = require('path');
const sharp = require('sharp');
const connection = require('../controllers/database');
const { getInsertSentence, getUpdateSentence } = require('../utils');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
    const { username, password, phone, mail, name } = req.body;
    const hash = bcrypt.hashSync(password, 10);
    const response = await connection.query(`INSERT INTO users (username, password, role, phone, mail, name) VALUES ('${username}', '${hash}', ${2}, '${phone}', '${mail}', '${name}')`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Usuario registrado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const login = async (req, res) => {
    const { username, password } = req.body;
    await connection.query(`SELECT id, usuario, perfil, nombre, email, password FROM usuarios where usuario = '${username}'`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.length > 0) {
                user = rows[0];
                if (bcrypt.compareSync(password, user.password)) {
                    delete user.password;
                    res.status(200).send({ message: 'Usuario logueado correctamente', success: true, user });
                } else {
                    res.status(200).send({ message: 'Usuario o contraseña incorrectos', success: false });
                }
            } else {
                res.status(200).send({ message: 'Usuario o contraseña incorrectos', success: false });
            }
        }
    });
}

const getUserPermissions = async (req, res) => {
    const { username } = req.params;
    await connection.query(`select pe.permiso, pe.tipo from permisos pe where pe.idPerfil = (SELECT p.id FROM perfiles p where p.id = (SELECT perfil from usuarios where usuario = '${username}')); `, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.length > 0) {
                let permissions = rows.map((permiso) => {
                    return {
                        permiso: permiso.permiso,
                        tipo: permiso.tipo
                    };
                });
                res.status(200).send({ message: 'Usuario logueado correctamente', success: true, permissions });
            } else {
                res.status(200).send({ message: 'Error al obtener los permisos', success: false });
            }
        }
    });
}

const getProfiles = async (req, res) => {
    const response = await connection.query('SELECT * FROM perfiles', function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            res.status(200).send(rows);
        }
    });
}

const getRequests = async (req, res) => {
    const response = await connection.query(`SELECT s.id, s.idContrato, c.nombre cliente, b.nombre AS beneficiario, f.nombre AS fallecido, p.nombrePaquete paquete, s.tipo
    FROM solicitudes s
    LEFT JOIN beneficiarios b ON s.idBeneficiario = b.id
    LEFT JOIN fallecidos f ON s.idFallecido = f.id
    LEFT JOIN clientes c ON s.idCliente = c.id
    LEFT JOIN paquetes p ON p.id = s.idPaquete ORDER BY ID DESC`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            res.status(200).send(rows);
        }
    });
}

const insertRequest = async (req, res) => {
    const { data } = req.body;
    const date = new Date();
    let parsedDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    const response = await connection.query(`INSERT INTO solicitudes (data, date) VALUES ('${data}', '${parsedDate}')`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            res.status(200).send('ok');
        }
    });
}

const getPermissionsByProfile = async (req, res) => {
    const { profile } = req.params;
    const response = await connection.query(`SELECT * FROM permisos WHERE idPerfil = '${profile}'`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            res.status(200).send(rows);
        }
    });
}

const updatePermissions = async (req, res) => {
    const { profile, permissions } = req.body;

    //new transaction

    let query = `DELETE FROM permisos WHERE idPerfil = '${profile}';`;
    let isOk = true;
    await connection.query(query, function (err, rows) {
        if (err) {
            isOk = false;
            console.log(err)
            res.status(409).send(err);
        }
    });
    if (!isOk) return;
    query = 'INSERT INTO permisos (permiso, idPerfil, tipo) VALUES'
    permissions.forEach((permission) => {
        query += `('${permission.permiso}', '${profile}', '${permission.tipo}'),`;
    });
    query = query.slice(0, -1);
    //wait 1 second

    setTimeout(async () => {
        await connection.query(query, function (err, rows) {
            if (err) {
                res.status(409).send(err);
            } else {
                if (rows?.affectedRows > 0) {
                    console.log(rows.affectedRows)
                    res.status(200).send({ message: 'Perfil actualizado correctamente', success: true });
                } else {
                    console.log(err)
                    res.status(200).send({ message: 'Ocurrió un error', success: false });
                }
            }
        });
    }, 1500);
}

const deleteContract = async (req, res) => {
    const { id } = req.body;
    const response = await connection.query(`DELETE FROM contratos WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Contrato eliminado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'No se encontró el contrato', success: false });
            }
        }
    });
}

const deleteRequest = async (req, res) => {
    const { id } = req.body;
    const response = await connection.query(`DELETE FROM solicitudes WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Solicitud eliminada correctamente', success: true });
            } else {
                res.status(200).send({ message: 'No se encontró la solicitud', success: false });
            }
        }
    });
}

const uploadLogo = async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: 'No image uploaded' });
    } else {
        await sharp(file.buffer).png().toFile('./' + `/uploads/logo.png`)
        res.status(200).send({ message: 'Imagen subida satisfactoriamente', file: file });
    }
};

const getLogo = async (req, res) => {
    let basePath = __basedir;
    const filepath = path.join(basePath, 'uploads', 'logo.png');
    console.log(filepath)
    res.sendFile(filepath);
};

const getCompanyData = async (req, res) => {
    const response = await connection.query('SELECT * FROM empresa', function (err, rows) {
        if (rows) {
            res.status(200).send(rows[0]);
        } else {
            res.status(200).send({ message: 'Ocurrió un error', success: false });
        }
    });
}

const updateCompanyData = async (req, res) => {
    //nombre 	correo 	telefono 	direccion 	ayudaTelefono 	ayudaCorreo 	ayudaNombre 	
    let query = getUpdateSentence('empresa', req.body);

    const response = await connection.query(query, function (err, rows) {
        if (rows) {
            res.status(200).send({ message: 'Datos actualizados correctamente', success: true });
        } else {
            res.status(200).send({ message: 'Ocurrió un error', success: false });
        }
    });
}

const createCompanyData = async (req, res) => {
    //nombre 	correo 	telefono 	direccion 	ayudaTelefono 	ayudaCorreo 	ayudaNombre
    let query = getInsertSentence('empresa', req.body);

    const response = await connection.query(query, function (err, rows) {
        if (rows) {
            res.status(200).send({ message: 'Datos actualizados correctamente', success: true });
        } else {
            res.status(200).send({ message: 'Ocurrió un error', success: false });
        }
    });
}

const createProfile = async (req, res) => {
    const { nombre } = req.body;
    const response = await connection.query(`INSERT INTO perfiles (nombre) VALUES ('${nombre}')`, function (err, rows) {
        if (rows) {
            res.status(200).send({ message: 'Perfil creado correctamente', success: true });
        } else {
            res.status(200).send({ message: 'Ocurrió un error', success: false });
        }
    });
}

const genericDelete = async (req, res) => {
    const { table, id } = req.body;
    let field = req.body?.field;
    let keyField = field || 'id';
    const response = await connection.query(`DELETE FROM ${table} WHERE ${keyField} = ${id}`, function (err, rows) {
        if (rows) {
            res.status(200).send({ message: 'Eliminado correctamente', success: true });
        } else {
            res.status(200).send({ message: 'Ocurrió un error', success: false });
        }
    });
}

const genericGet = async (req, res) => {
    const { table } = req.body;
    let field = req.body?.field;
    let id = req.body?.id;
    let keyField = field || 'id';
    let query = '';
    if (id) {
        query = `SELECT * FROM ${table} WHERE ${keyField} = ${id}`;
    } else {
        query = `SELECT * FROM ${table}`;
    }
    const response = await connection.query(query, function (err, rows) {
        if (rows) {
            if (rows?.length > 0) {
                res.status(200).send({ rows: rows, success: true });
            } else {
                res.status(200).send({ message: 'No se encontraron datos', success: false });
            }
        } else {
            res.status(401).send({ message: 'Ocurrió un error', success: false });
        }
    });
}

const genericUpdate = async (req, res) => {
    const { table, id, data } = req.body;
    let field = req.body?.field;
    let keyField = field || 'id';
    let query = '';
    let values = '';
    let keys = Object.keys(data);
    keys.forEach((key, index) => {
        if (index === keys.length - 1) {
            values += `${key} = '${data[key]}'`;
        } else {
            values += `${key} = '${data[key]}', `;
        }
    });
    query = `UPDATE ${table} SET ${values} WHERE ${keyField} = ${id}`;
    const response = await connection.query(query, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            res.status(200).send({ message: 'Datos actualizados correctamente', success: true });
        }
    });
}

module.exports = { connection, genericUpdate, genericGet, genericDelete, createProfile, updateCompanyData, createCompanyData, getCompanyData, getLogo, uploadLogo, login, getProfiles, updatePermissions, getUserPermissions, getPermissionsByProfile, register, getRequests, insertRequest, deleteContract, deleteRequest }
