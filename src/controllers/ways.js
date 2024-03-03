const { connection } = require('../controllers');

const getWays = async (req, res) => {
    const response = await connection.query('SELECT * FROM recorridos', function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            res.status(200).send(rows);
        }
    });
}

const getWay = async (req, res) => {
    const { id } = req.params;
    const response = await connection.query(`SELECT * FROM recorridos WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.length > 0) {
                res.status(200).send(rows[0]);
            } else {
                res.status(200).send({ message: 'No se encontró el recorrido', success: false });
            }
        }
    });
}

const createWay = async (req, res) => {
    const { nombre, descripcion } = req.body;
    const response = await connection.query(`INSERT INTO recorridos (nombre, descripcion) VALUES ('${nombre}', '${descripcion}')`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Recorrido creado correctamente', success: true, insertedId: rows.insertId });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const updateWay = async (req, res) => {
    const { nombre, descripcion, id } = req.body;
    const response = await connection.query(`UPDATE recorridos SET nombre = '${nombre}', descripcion = '${descripcion}' WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Recorrido actualizado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const deleteWay = async (req, res) => {
    const { id } = req.body;
    const response = await connection.query(`DELETE FROM recorridos WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Recorrido eliminado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const insertMassiveSalesWays = async (req, res) => {
    const { recorridos } = req.body;
    query = 'INSERT INTO recorridos_ventas (idRecorrido, idVenta, orden) VALUES'
    recorridos.forEach((r) => {
        query += `('${r.idRecorrido}', '${r.idVenta}', '${r.orden}'),`;
    });
    query = query.slice(0, -1);
    const response = await connection.query(query, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Recorrido actualizado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const deleteSalesWays = async (req, res) => {
    const { id } = req.body;
    const response = await connection.query(`DELETE FROM recorridos_ventas WHERE idRecorrido = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Recorrido eliminado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const createSalesWays = async (req, res) => {
    const { idRecorrido, idVenta, orden } = req.body;
    const response = await connection.query(`INSERT INTO recorridos_ventas (idRecorrido, idVenta, orden) VALUES ('${idRecorrido}', '${idVenta}', '${orden}')`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Recorrido creado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const getLastOrder = async (req, res) => {
    const { id } = req.params;
    const response = await connection.query(`SELECT MAX(orden) as orden FROM recorridos_ventas WHERE idRecorrido = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            res.status(200).send({ orden: rows[0].orden, success: true });
        }
    });
}

const substractOrder = async (req, res) => {
    const { id, firstOrder } = req.body;
    const response = await connection.query(`UPDATE recorridos_ventas SET orden = orden - 1 WHERE idRecorrido = ${id} AND orden > ${firstOrder}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            res.status(200).send({ message: 'Recorrido actualizado correctamente', success: true });
        }
    });
}

const getCompleteWay = async (req, res) => {
    const { id } = req.params;
    const query = `SELECT nombre_cliente, direccion_cliente, fecha, valor, orden, id_venta, id_cuota, importePendiente, id_contrato, id_cliente, periodo, nroCuota, importeAbonado, importeTotal, numeroPagos
    FROM (
      SELECT c.nombre AS nombre_cliente, c.domicilio AS direccion_cliente, c.id AS id_cliente, co.fecha, co.valor, rv.orden, v.id AS id_venta, co.id AS id_cuota, co.nroCuota, f.periodo, f.importePendiente, f.idContrato AS id_contrato, f.importeAbonado, f.importeTotal, f.numeroPagos,
             ROW_NUMBER() OVER (PARTITION BY v.id ORDER BY co.fecha ASC) AS row_num
      FROM clientes c
      JOIN ventas v ON c.id = v.idCliente
      JOIN recorridos_ventas rv ON v.id = rv.idVenta
      JOIN cobranzas co ON v.idFinanciamiento = co.idFinanciamiento
      JOIN financiamientos f ON f.id = v.idFinanciamiento
      WHERE co.estado = 'Pendiente' AND rv.idRecorrido = ${id}
      ORDER BY rv.orden 
    ) subquery
    WHERE row_num = 1;`

    const response = await connection.query(query, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            res.status(200).send({ wayData: rows, success: true });
        }
    });
}

const getEmployeesWays = async (req, res) => {
    const query = `SELECT * from recorridos_empleados`;

    const response = await connection.query(query, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            res.status(200).send({ employeesWays: rows, success: true });
        }
    });
}

const getEmployeeWays = async (req, res) => {
    const id = req.params.id;
    const query = `
        SELECT re.*, r.nombre from recorridos_empleados re, recorridos r 
        WHERE re.idEmpleado = ${id}
        AND re.idRecorrido = r.id`;
    const response = await connection.query(query, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            res.status(200).send({ employeeWays: rows, success: true });
        }
    });
}

module.exports = {
    getWays,
    getWay,
    createWay,
    updateWay,
    deleteWay,
    deleteSalesWays,
    createSalesWays,
    insertMassiveSalesWays,
    getLastOrder,
    substractOrder,
    getCompleteWay,
    getEmployeesWays,
    getEmployeeWays
}
