const { connection } = require('../controllers');

const getEmployees = async (req, res) => {
    const response = await connection.query(`SELECT e.*, s.nombre nombreSucursal, d.nombre departamento, r.nombre nombreRecorrido FROM empleados e
    left join sucursales s
    on e.sucursal = s.id
    left join departamentos d
    on e.departamento = d.id
    left join recorridos r
    on e.recorrido = r.id
    `, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            res.status(200).send(rows);
        }
    });
}

const getEmployee = async (req, res) => {
    const { id } = req.params;
    const response = await connection.query(`SELECT * FROM empleados WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.length > 0) {
                res.status(200).send(rows[0]);
            } else {
                res.status(200).send({ message: 'No se encontró el empleado', success: false });
            }
        }
    });
}

const updateEmployee = async (req, res) => {
    const { id, idUsuario, nombre, tipo, departamento, sucursal, recorrido, contacto, telefono, telefonoEmergencia } = req.body;
    const response = await connection.query(`UPDATE empleados SET idUsuario = '${idUsuario}', nombre = '${nombre}', tipo = '${tipo}', departamento = '${departamento}', sucursal = '${sucursal}', recorrido = '${recorrido}', contacto = '${contacto}', telefono = '${telefono}', telefonoEmergencia = '${telefonoEmergencia}' WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Empleado actualizado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const createEmployee = async (req, res) => {
    const { idUsuario, nombre, tipo, departamento, sucursal, recorrido, contacto, telefono, telefonoEmergencia } = req.body;
    const response = await connection.query(`INSERT INTO empleados (idUsuario, nombre, tipo, departamento, sucursal, recorrido, contacto, telefono, telefonoEmergencia) VALUES ('${idUsuario}', '${nombre}', '${tipo}', '${departamento}', '${sucursal}', '${recorrido}', '${contacto}', '${telefono}', '${telefonoEmergencia}')`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Empleado creado correctamente', success: true, insertedId: rows.insertId });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const deleteEmployee = async (req, res) => {
    const { id } = req.body;
    const response = await connection.query(`DELETE FROM empleados WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Empleado eliminado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const updateEmployeesWay = async (req, res) => {
    const { ids, way } = req.body;
    //table: recorridos_empleados
    //insert into recorridos_empleados (idEmpleado, idRecorrido) values (1, 1), (2, 1), (3, 1), (4, 1), (5, 1);
    let query = 'insert into recorridos_empleados (idEmpleado, idRecorrido) values ';
    let values = '';
    ids.forEach((id, index) => {
        values += `(${id}, ${way})${index === ids.length - 1 ? ';' : ', '}`;
    });
    query += values;
    const response = await connection.query(query, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Valores actualizados correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const deleteEmployeeWay = async (req, res) => {
    const { id, way } = req.body;
    //table: recorridos_empleados
    const query = 'delete from recorridos_empleados where idEmpleado = ' + id + ' and idRecorrido = ' + way;
    const response = await connection.query(query, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Valores actualizados correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}


module.exports = {
    getEmployees,
    getEmployee,
    updateEmployee,
    createEmployee,
    deleteEmployee,
    updateEmployeesWay,
    deleteEmployeeWay
}