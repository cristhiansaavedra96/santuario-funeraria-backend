const { connection } = require('../controllers');
const moment = require('moment');

const getCuts = async (req, res) => {
    const response = await connection.query(`SELECT c.*, e.nombre empleado
    FROM cortes c
    left join empleados e
    on c.idEmpleado = e.id`
        , function (err, rows) {
            if (err) {
                res.status(409).send(err);
            } else {
                res.status(200).send(rows);
            }
        });
}

const createCut = async (req, res) => {
    const { idEmpleado, monto, cantidadCobros, idsCobros, origen } = req.body;
    const datetime = moment().format('YYYY-MM-DD HH:mm:ss');
    const estado = 'Pendiente';
    const textIdsCobros = idsCobros.join(',');

    const response = await connection.query(`INSERT INTO cortes (idEmpleado, monto, cantidadCobros, fecha, estado, idsCobros, origen) VALUES ('${idEmpleado}', '${monto}', '${cantidadCobros}', '${datetime}', '${estado}', '${textIdsCobros}', '${origen}')`, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Corte creado correctamente', success: true, insertedId: rows.insertId });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const getCut = async (req, res) => {
    const { id } = req.params;
    const response = await connection.query(`SELECT c.*, e.nombre as nombreEmpleado FROM cortes c, empleados e WHERE c.idEmpleado = e.id AND c.id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        }
        if (rows?.length > 0) {
            res.status(200).send(rows[0]);
        } else {
            res.status(200).send({ message: 'No se encontró el corte', success: false });
        }
    });
}

const updateCutStatus = async (req, res) => {
    const { id, estado } = req.body;
    const response = await connection.query(`UPDATE cortes SET estado = '${estado}' WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Corte actualizado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const createBreakdownCut = async (req, res) => {
    const { breakdowns } = req.body;
    let query = `INSERT INTO cortes_desglose (idCorte, idCuota, monto, fecha, observacion, origen, estado) VALUES`;

    breakdowns.forEach(breakdown => {
        query += `('${breakdown.idCorte}', '${breakdown.idCuota}', '${breakdown.monto}', '${breakdown.fecha}', '${breakdown.observacion}', '${breakdown.origen}', '${breakdown.estado}'),`;
    });

    query = query.slice(0, -1);

    const response = await connection.query(query, function (err, rows) {
        if (err) {
            console.log(err)
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Detalle de corte creado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const createPendingPayment = async (req, res) => {
    const { idCuota, monto, fecha, observacion, origen, estado, idEmpleado } = req.body;
    //table: pagos_pendientes
    const response = await connection.query(`INSERT INTO pagos_pendientes (idCuota, monto, fecha, observacion, origen, estado, idEmpleado) VALUES ('${idCuota}', '${monto}', '${fecha}', '${observacion}', '${origen}', '${estado}', '${idEmpleado}')`, function (err, rows) {
        if (err) {
            console.log(err)
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Pago pendiente creado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const updatePendingPaymentStatus = async (req, res) => {
    const { id, estado } = req.body;
    const response = await connection.query(`UPDATE pagos_pendientes SET estado = '${estado}' WHERE id = ${id}`, function (err, rows) {
        if (err) {
            console.log(err)
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Pago pendiente creado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const cleanPendingPayments = async (req, res) => {
    const { idEmpleado } = req.body;
    const response = await connection.query(`UPDATE pagos_pendientes set estado = 'PROCESADO' WHERE idEmpleado = '${idEmpleado}'`, function (err, rows) {
        if (err) {
            console.log(err)
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Se limpiaron correctamente los pagos pendientes', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const deletePendingPayment = async (req, res) => {
    const { id } = req.body;
    const response = await connection.query(`DELETE from pagos_pendientes where id = ${id}`, function (err, rows) {
        if (err) {
            console.log(err)
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Se eliminó correctamente el pago pendiente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const updateBreakdownCutPayments = async (req, res) => {
    const { idCorte, estado } = req.body;
    const response = await connection.query(`UPDATE cortes_desglose SET estado = '${estado}' WHERE idCorte = ${idCorte}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Detalle de corte actualizado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const getPendingPayments = async (req, res) => {
    const response = await connection.query(`
        SELECT pp.*, f.idContrato, f.idCliente, c.nombre, c.domicilioCobranza, e.nombre as nombreEmpleado 
        FROM pagos_pendientes pp, financiamientos f, cobranzas cc, clientes c, empleados e
        WHERE pp.idCuota = cc.id
        AND cc.idFinanciamiento = f.id
        AND f.idCliente = c.id
        AND pp.idEmpleado = e.id
        AND pp.estado <> 'PROCESADO'
        `, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            res.status(200).send(rows);
        }
    });
}

const deleteBreakdownCut = async (req, res) => {
    const { id } = req.body;

    let query = `
        UPDATE cortes c SET c.cantidadCobros = c.cantidadCobros - 1, c.monto = c.monto - (SELECT cg.monto FROM cortes_desglose cg WHERE cg.id = ${id}) WHERE c.id = (SELECT cg2.idCorte FROM cortes_desglose cg2 WHERE cg2.id = ${id});
        DELETE FROM cortes_desglose WHERE id = ${id};
    `;

    const response = await connection.query(query, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Detalle de corte eliminado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const updateBreakdownCut = async (req, res) => {
    const { id, idCorte, idCuota, monto, fecha, observacion } = req.body;
    const response = await connection.query(`UPDATE cortes_desglose SET idCorte = '${idCorte}', idCuota = '${idCuota}', monto = '${monto}', fecha = '${fecha}', observacion = '${observacion}' WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Detalle de corte actualizado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const getBreakdownCuts = async (req, res) => {
    const { id } = req.params;
    const response = await connection.query(`SELECT cg.*, c.valor, cl.nombre, f.importePendiente, f.periodo, c.nroCuota, f.numeroPagos, f.medioPago, f.montoFinanciado, f.atraso, f.importeAbonado, f.idContrato, f.importePendiente, (f.importePendiente - cg.monto) as nuevoImportePendiente FROM cortes_desglose cg, financiamientos f, clientes cl, cobranzas c
    WHERE cg.idCuota = c.id
    AND c.idFinanciamiento = f.id 
    AND f.idCliente = cl.id
    AND idCorte = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        }
        if (rows?.length > 0) {
            res.status(200).send(rows);
        } else {
            res.status(200).send({ message: 'No se encontraron detalles de corte', success: false });
        }
    });
}

const getPendingPaymentDetail = async (req, res) => {
    const { id } = req.body;
    console.log(id)
    const response = await connection.query(`SELECT pp.*, c.valor, cl.nombre, f.importePendiente, f.atraso, f.importeAbonado, f.idContrato, f.importePendiente, (f.importePendiente - pp.monto) as nuevoImportePendiente FROM pagos_pendientes pp, financiamientos f, clientes cl, cobranzas c
    WHERE pp.idCuota = c.id
    AND c.idFinanciamiento = f.id 
    AND f.idCliente = cl.id
    AND pp.id = ${id}`, function (err, rows) {
        if (err) {
            console.log(err)
            res.status(409).send(err);
        } else {
            if (rows?.length > 0) {
                res.status(200).send(rows);
            } else {
                res.status(200).send({ message: 'No se encontraron detalles de corte', success: false });
            }
        }
    });
}

module.exports = {
    getCuts,
    createCut,
    getCut,
    updateCutStatus,
    createBreakdownCut,
    deleteBreakdownCut,
    updateBreakdownCut,
    getBreakdownCuts,
    createPendingPayment,
    updatePendingPaymentStatus,
    cleanPendingPayments,
    getPendingPayments,
    deletePendingPayment,
    getPendingPaymentDetail,
    updateBreakdownCutPayments
}
