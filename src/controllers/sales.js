const { connection } = require('../controllers');

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return formatDate(result);
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

const updateContractNumber = async (req, res) => {
    const { id, tableName, contractNumber } = req.body;
    const response = await connection.query(`UPDATE ${tableName} SET idContrato = ${contractNumber} WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Nro. de contrato actualizado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

//Beneficiaries

const getBeneficiary = async (req, res) => {
    const { id } = req.params;
    const response = await connection.query(`SELECT * FROM beneficiarios WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.length > 0) {
                res.status(200).send(rows[0]);
            } else {
                res.status(200).send({ message: 'No se encontró el beneficiario', success: false });
            }
        }
    });
}

const getBeneficiaries = async (req, res) => {
    const response = await connection.query(`SELECT * FROM beneficiarios`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            res.status(200).send(rows);
        }
    });
}

const createBeneficiary = async (req, res) => {
    // 	id 	idContrato 	nombre 	telefono 	fechaNacimiento 	parentesco 	correo 	domicilio 	codigoPostal
    const { nombre, telefono, fechaNacimiento, parentesco, correo, domicilio, codigoPostal } = req.body;
    const response = await connection.query(`INSERT INTO beneficiarios (nombre, telefono, fechaNacimiento, parentesco, correo, domicilio, codigoPostal) VALUES ('${nombre}', '${telefono}', '${fechaNacimiento}', '${parentesco}', '${correo}', '${domicilio}', '${codigoPostal}')`, async function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Beneficiario creado correctamente', success: true, insertedId: rows.insertId });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const updateBeneficiary = async (req, res) => {
    const { id, idContrato, nombre, telefono, fechaNacimiento, parentesco, correo, domicilio, codigoPostal } = req.body;
    const response = await connection.query(`UPDATE beneficiarios SET nombre = '${nombre}', telefono = '${telefono}', fechaNacimiento = '${fechaNacimiento}', parentesco = '${parentesco}', correo = '${correo}', domicilio = '${domicilio}', codigoPostal = '${codigoPostal}' WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Beneficiario actualizado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

//Services

const getService = async (req, res) => {
    const { id } = req.params;
    const response = await connection.query(`SELECT * FROM servicios WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.length > 0) {
                res.status(200).send(rows[0]);
            } else {
                res.status(200).send({ message: 'No se encontró el servicio', success: false });
            }
        }
    });
}

const createService = async (req, res) => {
    const { embalsamado, urna, especial, encapsulado, nocheAdicional, cremacion, extra } = req.body;
    const response = await connection.query(`INSERT INTO servicios (embalsamado, urna, especial, encapsulado, nocheAdicional, cremacion, extra) VALUES ('${embalsamado}', '${urna}', '${especial}', '${encapsulado}', '${nocheAdicional}', '${cremacion}', '${extra}')`, async function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Servicio creado correctamente', success: true, insertedId: rows.insertId });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const updateService = async (req, res) => {
    const { id, embalsamado, urna, especial, encapsulado, nocheAdicional, cremacion, extra } = req.body;
    const response = await connection.query(`UPDATE servicios SET embalsamado = '${embalsamado}', urna = '${urna}', especial = '${especial}', encapsulado = '${encapsulado}', nocheAdicional = '${nocheAdicional}', cremacion = '${cremacion}', extra = '${extra}' WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Servicio actualizado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

//Financing
//schema: id 	idContrato 	idCliente 	medioPago 	precioBase 	bonificacion 	enganche 	montoFinanciado 	numeroPagos 	interesMora 	periodo 	importeCuota 	importeTotal 	importePendiente 	importeAbonado 	fechaPrimerCuota 	fechaUltimaCuota 	

const getFinancings = async (req, res) => {
    const response = await connection.query(`SELECT f.id, f.idContrato, c.nombre as cliente, f.importeTotal, f.numeroPagos, f.importeCuota, f.importePendiente  FROM financiamientos f
    left join clientes c ON f.idCliente = c.id`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            res.status(200).send(rows);
        }
    });
}

const getFinancing = async (req, res) => {
    const { id } = req.params;
    const response = await connection.query(`SELECT * FROM financiamientos WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.length > 0) {
                res.status(200).send(rows[0]);
            } else {
                res.status(200).send({ message: 'No se encontró el financiamiento', success: false });
            }
        }
    });
}

const createFinancing = async (req, res) => {
    const { idCliente, medioPago, precioBase, bonificacion, enganche, montoFinanciado, numeroPagos, interesMora, periodo, importeCuota, importeTotal, importePendiente, importeAbonado, fechaPrimerCuota, fechaUltimaCuota } = req.body;
    const atraso = req.body?.atraso;
    const adelanto = req.body?.adelanto;
    const activo = req.body?.activo === 'NO' ? 'NO' : 'SI';
    const response = await connection.query(`INSERT INTO financiamientos (idCliente, medioPago, precioBase, bonificacion, enganche, montoFinanciado, numeroPagos, interesMora, periodo, importeCuota, importeTotal, importePendiente, importeAbonado, atraso, adelanto, fechaPrimerCuota, fechaUltimaCuota, activo) VALUES ('${idCliente}', '${medioPago}', '${precioBase}', '${bonificacion}', '${enganche}', '${montoFinanciado}', '${numeroPagos}', '${interesMora}', '${periodo}', '${importeCuota}', '${importeTotal}', '${importePendiente}', '${importeAbonado}', '${atraso}', '${adelanto}', '${fechaPrimerCuota}', '${fechaUltimaCuota}', '${activo}')`, async function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Financiamiento creado correctamente', success: true, insertedId: rows.insertId });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const updateFinancing = async (req, res) => {
    const { id, idCliente, medioPago, precioBase, bonificacion, enganche, montoFinanciado, numeroPagos, interesMora, periodo, importeCuota, importeTotal, importePendiente, importeAbonado, fechaPrimerCuota, fechaUltimaCuota } = req.body;
    const atraso = req.body?.atraso;
    const adelanto = req.body?.adelanto;
    const activo = req.body?.activo === 'NO' ? 'NO' : 'SI';
    const response = await connection.query(`UPDATE financiamientos SET idCliente = '${idCliente}', medioPago = '${medioPago}', precioBase = '${precioBase}', bonificacion = '${bonificacion}', enganche = '${enganche}', montoFinanciado = '${montoFinanciado}', numeroPagos = '${numeroPagos}', interesMora = '${interesMora}', periodo = '${periodo}', importeCuota = '${importeCuota}', importeTotal = '${importeTotal}', importePendiente = '${importePendiente}', importeAbonado = '${importeAbonado}', atraso = '${atraso}', adelanto = '${adelanto}', fechaPrimerCuota = '${fechaPrimerCuota}', fechaUltimaCuota = '${fechaUltimaCuota}', activo = '${activo}' WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Financiamiento actualizado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

//Deceased
//schema:  	id 	idContrato 	nombre 	lugarVelacion 	causas 	fechaNacimiento 	fechaDefuncion 	edad 	estadoCivil

const getDeceased = async (req, res) => {
    const { id } = req.params;
    const response = await connection.query(`SELECT * FROM fallecidos WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.length > 0) {
                res.status(200).send(rows[0]);
            } else {
                res.status(200).send({ message: 'No se encontró el fallecido', success: false });
            }
        }
    });
}

const createDeceased = async (req, res) => {
    const { nombre, lugarVelacion, causas, fechaNacimiento, fechaDefuncion, edad, estadoCivil, lugarDefuncion, lugarRecoleccion } = req.body;
    const response = await connection.query(`INSERT INTO fallecidos (nombre, lugarVelacion, causas, fechaNacimiento, fechaDefuncion, edad, estadoCivil, lugarDefuncion, lugarRecoleccion) VALUES ('${nombre}', '${lugarVelacion}', '${causas}', '${fechaNacimiento}', '${fechaDefuncion}', '${edad}', '${estadoCivil}', '${lugarDefuncion}', '${lugarRecoleccion}')`, async function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Fallecido creado correctamente', success: true, insertedId: rows.insertId });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const updateDeceased = async (req, res) => {
    const { id, nombre, lugarVelacion, causas, fechaNacimiento, fechaDefuncion, edad, estadoCivil, lugarDefuncion, lugarRecoleccion } = req.body;
    const response = await connection.query(`UPDATE fallecidos SET nombre = '${nombre}', lugarVelacion = '${lugarVelacion}', causas = '${causas}', fechaNacimiento = '${fechaNacimiento}', fechaDefuncion = '${fechaDefuncion}', edad = '${edad}', estadoCivil = '${estadoCivil}', lugarDefuncion = '${lugarDefuncion}', lugarRecoleccion = '${lugarRecoleccion}' WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Fallecido actualizado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const getDeceaseds = async (req, res) => {
    const response = await connection.query(`SELECT * FROM fallecidos`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            res.status(200).send(rows);
        }
    });
}

//Ceremony
//schema:  	id 	idContrato 	idFallecido 	familia 	diaMisa 	horaMisa 	templo 	panteon 	novenarios 	spotsRadio 	esquelasImpresas 	publicacionPagina 	fotografia 	

const getCeremony = async (req, res) => {
    const { id } = req.params;
    const response = await connection.query(`SELECT * FROM ceremonias WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.length > 0) {
                res.status(200).send(rows[0]);
            } else {
                res.status(200).send({ message: 'No se encontró la ceremonia', success: false });
            }
        }
    });
}

const createCeremony = async (req, res) => {
    const { idFallecido, familia, diaMisa, horaMisa, templo, panteon, novenarios, spotsRadio, esquelasImpresas, publicacionPagina, fotografia, spotsRedesSociales } = req.body;
    const response = await connection.query(`INSERT INTO ceremonias (idFallecido, familia, diaMisa, horaMisa, templo, panteon, novenarios, spotsRadio, esquelasImpresas, publicacionPagina, fotografia, spotsRedesSociales) VALUES ('${idFallecido}', '${familia}', '${diaMisa}', '${horaMisa}', '${templo}', '${panteon}', '${novenarios}', '${spotsRadio}', '${esquelasImpresas}', '${publicacionPagina}', '${fotografia}', '${spotsRedesSociales}')`, async function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Ceremonia creada correctamente', success: true, insertedId: rows.insertId });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const updateCeremony = async (req, res) => {
    const { id, idFallecido, familia, diaMisa, horaMisa, templo, panteon, novenarios, spotsRadio, esquelasImpresas, publicacionPagina, fotografia, spotsRedesSociales } = req.body;
    const response = await connection.query(`UPDATE ceremonias SET idFallecido = '${idFallecido}', familia = '${familia}', diaMisa = '${diaMisa}', horaMisa = '${horaMisa}', templo = '${templo}', panteon = '${panteon}', novenarios = '${novenarios}', spotsRadio = '${spotsRadio}', esquelasImpresas = '${esquelasImpresas}', publicacionPagina = '${publicacionPagina}', fotografia = '${fotografia}', spotsRedesSociales = '${spotsRedesSociales}' WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Ceremonia actualizada correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const getCeremonies = async (req, res) => {
    const response = await connection.query(`SELECT * FROM ceremonias`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            res.status(200).send(rows);
        }
    });
}

//Request
//schema:  	id 	idContrato 	idCliente 	idBeneficiario 	idPaquete 	idServicio 	idCeremonia 	tipo 	

const getRequest = async (req, res) => {
    const { id } = req.params;
    const response = await connection.query(`SELECT * FROM solicitudes WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.length > 0) {
                res.status(200).send(rows[0]);
            } else {
                res.status(200).send({ message: 'No se encontró la solicitud', success: false });
            }
        }
    });
}

const createRequest = async (req, res) => {
    const { idCliente, idBeneficiario, idFallecido, idPaquete, idServicio, idCeremonia, tipo } = req.body;
    const response = await connection.query(`INSERT INTO solicitudes (idCliente, idBeneficiario, idFallecido, idPaquete, idServicio, idCeremonia, tipo) VALUES ('${idCliente}', '${idBeneficiario}', '${idFallecido}', '${idPaquete}', '${idServicio}', '${idCeremonia}', '${tipo}')`, async function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Solicitud creada correctamente', success: true, insertedId: rows.insertId });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const updateRequest = async (req, res) => {
    const { id, idCliente, idBeneficiario, idFallecido, idPaquete, idServicio, idCeremonia, tipo } = req.body;
    const response = await connection.query(`UPDATE solicitudes SET idCliente = ${idCliente}, idBeneficiario = ${idBeneficiario}, idFallecido = ${idFallecido}, idPaquete = ${idPaquete}, idServicio = ${idServicio}, idCeremonia = ${idCeremonia}, tipo = '${tipo}' WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Solicitud actualizada correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

//Contract
//schema: id 	idCliente 	idFinanciamiento 	idSolicitud 	idPaquete 	fecha 	tipo 	asesor 	estado 	impMunicipal 	traslado 	exhumacion 	otros 	observaciones 

const getContract = async (req, res) => {
    const { id } = req.params;
    const response = await connection.query(`SELECT * FROM contratos WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.length > 0) {
                res.status(200).send(rows[0]);
            } else {
                res.status(200).send({ message: 'No se encontró el contrato', success: false });
            }
        }
    });
}

const getContracts = async (req, res) => {
    const response = await connection.query(`
        SELECT c.id, cl.nombre as cliente, c.idFinanciamiento, c.idSolicitud, p.nombrePaquete as paquete, e.nombre as asesor, c.fecha, c.tipo, c.estado FROM contratos c
        LEFT JOIN clientes cl ON c.idCliente = cl.id
        LEFT JOIN paquetes p ON c.idPaquete = p.id
        LEFT JOIN empleados e ON c.asesor = e.id
        ORDER BY ID DESC`
        , function (err, rows) {
            if (err) {
                res.status(409).send(err);
            } else {
                res.status(200).send(rows);
            }
        });
}

const createContract = async (req, res) => {
    const { idCliente, idFinanciamiento, idSolicitud, idPaquete, fecha, tipo, asesor, estado, impMunicipal, traslado, exhumacion, otros, observaciones, referencia, complementarioBasico, paqueteEspecial, contratoRelacionado } = req.body;
    const response = await connection.query(`INSERT INTO contratos (idCliente, idFinanciamiento, idSolicitud, idPaquete, fecha, tipo, asesor, estado, impMunicipal, traslado, exhumacion, otros, observaciones, referencia, complementarioBasico, paqueteEspecial, contratoRelacionado) VALUES ('${idCliente}', '${idFinanciamiento}', '${idSolicitud}', '${idPaquete}', '${fecha}', '${tipo}', '${asesor}', '${estado}', '${impMunicipal}', '${traslado}', '${exhumacion}', '${otros}', '${observaciones}', '${referencia}', '${complementarioBasico}', '${paqueteEspecial}', '${contratoRelacionado}')`, async function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Contrato creado correctamente', success: true, insertedId: rows.insertId });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const updateContract = async (req, res) => {
    const { id, idCliente, idFinanciamiento, idSolicitud, idPaquete, fecha, tipo, asesor, estado, impMunicipal, traslado, exhumacion, otros, observaciones, referencia, complementarioBasico, paqueteEspecial, contratoRelacionado } = req.body;
    const response = await connection.query(`UPDATE contratos SET idCliente = '${idCliente}', idFinanciamiento = '${idFinanciamiento}', idSolicitud = '${idSolicitud}', idPaquete = '${idPaquete}', fecha = '${fecha}', tipo = '${tipo}', asesor = '${asesor}', estado = '${estado}', impMunicipal = '${impMunicipal}', traslado = '${traslado}', exhumacion = '${exhumacion}', otros = '${otros}', observaciones = '${observaciones}', referencia = '${referencia}', complementarioBasico = '${complementarioBasico}', paqueteEspecial = '${paqueteEspecial}', contratoRelacionado = '${contratoRelacionado}' WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Contrato actualizado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

//Sale
//schema: id 	idCliente 	idContrato 	idSolicitud 	idFinanciamiento 	estado 	asesor 	cobrador 	metodoPago 	fechaLiquidacion 

const getSales = async (req, res) => {
    const response = await connection.query(`
        SELECT v.id, c.nombre as cliente, v.idCliente, v.idContrato, v.estado, e.nombre as asesor, e2.nombre as cobrador, v.metodoPago, v.fechaLiquidacion, v.recorrido, co.estado as estadoContrato FROM ventas v
        LEFT JOIN clientes c ON v.idCliente = c.id 
        LEFT JOIN empleados e ON v.asesor = e.id
        LEFT JOIN empleados e2 ON v.cobrador = e2.id
        LEFT JOIN contratos co ON v.idContrato = co.id`
        , function (err, rows) {
            if (err) {
                res.status(409).send(err);
            } else {
                res.status(200).send(rows);
            }
        });
}


const getSale = async (req, res) => {
    const { id } = req.params;
    const response = await connection.query(`SELECT * FROM ventas WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.length > 0) {
                res.status(200).send(rows[0]);
            } else {
                res.status(200).send({ message: 'No se encontró la venta', success: false });
            }
        }
    });
}

const createSale = async (req, res) => {
    const { idCliente, idContrato, idSolicitud, idFinanciamiento, estado, asesor, recorrido, metodoPago, fechaLiquidacion } = req.body;
    const response = await connection.query(`INSERT INTO ventas (idCliente, idContrato, idSolicitud, idFinanciamiento, estado, asesor, recorrido, metodoPago, fechaLiquidacion) VALUES ('${idCliente}', '${idContrato}', '${idSolicitud}', '${idFinanciamiento}', '${estado}', '${asesor}', '${recorrido}', '${metodoPago}', '${fechaLiquidacion}')`, async function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Venta creada correctamente', success: true, insertedId: rows.insertId });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const updateSale = async (req, res) => {
    const { id, idCliente, idContrato, idSolicitud, idFinanciamiento, estado, asesor, recorrido, metodoPago, fechaLiquidacion } = req.body;
    const response = await connection.query(`UPDATE ventas SET idCliente = '${idCliente}', idContrato = '${idContrato}', idSolicitud = '${idSolicitud}', idFinanciamiento = '${idFinanciamiento}', estado = '${estado}', asesor = ${asesor}, recorrido = ${recorrido}, metodoPago = '${metodoPago}', fechaLiquidacion = '${fechaLiquidacion}' WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Venta actualizada correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

//Payment

const getPayments = async (req, res) => {
    const { id } = req.params;
    const response = await connection.query(`SELECT * FROM cobranzas WHERE idFinanciamiento = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            res.status(200).send(rows);
        }
    });
}


const getPayment = async (req, res) => {
    const { id } = req.params;
    const response = await connection.query(`SELECT * FROM cobranza WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.length > 0) {
                res.status(200).send(rows[0]);
            } else {
                res.status(200).send({ message: 'No se encontró la cobranza', success: false });
            }
        }
    });
}

const createMassivePayment = async (req, res) => {
    const { idFinanciamiento, nroCuotas, importeCuota, enganche, fechaPrimerCuota, periodo, montoUltimaCuota, adelanto, fechaInicio, tipo } = req.body;
    const importeAbonado = req?.body?.importeAbonado || 0;
    let cuotasPagas = 0;
    let nroCuotaIncompleta = 0;
    let importeRestante = importeAbonado;
    let importePagado = 0;
    if (importeAbonado > 0) {
        if (importeAbonado < importeCuota) {
            cuotasPagas = 1;
            importeRestante = importeCuota - importeAbonado;
            nroCuotaIncompleta = 1;
            importePagado = importeAbonado;
        } else {
            //int without decimals
            cuotasPagas = Math.trunc(importeAbonado / importeCuota);
            let resto = importeAbonado % importeCuota;
            if (resto > 0) {
                cuotasPagas = cuotasPagas + 1;
                nroCuotaIncompleta = cuotasPagas;
                importeRestante = importeCuota - resto;
                importePagado = resto;
            }
        }
    }

    //schema:  	id 	idFinanciamiento 	nroCuota 	fecha 	valor 	tipo 	descripcion 	estado
    const values = [];
    let actualDate = null;
    actualDate = new Date(fechaPrimerCuota);
    if (enganche) {
        values.push(`(${idFinanciamiento}, 0, '${fechaInicio}', ${enganche}, 'Enganche', 'Enganche', 'Pagado', ${enganche}, 0)`);
    }
    if (adelanto) {
        values.push(`(${idFinanciamiento}, 0, '${fechaInicio}', ${adelanto}, 'Adelanto', 'Adelanto', 'Pagado', ${adelanto}, 0)`);
    }

    if (tipo === 'Crédito') {
        for (let i = 0; i < nroCuotas; i++) {
            let cuota = i + 1;
            if (i !== 0) {
                actualDate = addDays(fechaPrimerCuota, periodo * cuota);
            } else {
                actualDate = fechaPrimerCuota;
            }
            let tipo = 'Cuota';
            if (i + 1 === nroCuotas && montoUltimaCuota) {
                if (cuota <= cuotasPagas) {
                    if (nroCuotaIncompleta === i + 1) {
                        values.push(`(${idFinanciamiento}, ${cuota}, '${actualDate}', ${nroCuotaIncompleta}, '${tipo}', 'Cuota ${cuota}/${nroCuotas}', 'Pagado', ${importePagado}, ${importeRestante})`);
                    } else {
                        values.push(`(${idFinanciamiento}, ${cuota}, '${actualDate}', ${montoUltimaCuota}, '${tipo}', 'Cuota ${cuota}/${nroCuotas}', 'Pagado', ${montoUltimaCuota}, 0)`);
                    }
                } else {
                    values.push(`(${idFinanciamiento}, ${cuota}, '${actualDate}', ${montoUltimaCuota}, '${tipo}', 'Cuota ${cuota}/${nroCuotas}', 'Pendiente', 0, ${montoUltimaCuota})`);
                }
            } else {
                if (cuota <= cuotasPagas) {
                    if (nroCuotaIncompleta === i + 1) {
                        values.push(`(${idFinanciamiento}, ${cuota}, '${actualDate}', ${importeRestante}, '${tipo}', 'Cuota ${cuota}/${nroCuotas}', 'Pagado', ${importePagado} , ${importeRestante})`);
                    }
                    else {
                        values.push(`(${idFinanciamiento}, ${cuota}, '${actualDate}', ${importeCuota}, '${tipo}', 'Cuota ${cuota}/${nroCuotas}', 'Pagado', ${importeCuota}, 0)`);
                    }
                } else {
                    values.push(`(${idFinanciamiento}, ${cuota}, '${actualDate}', ${importeCuota}, '${tipo}', 'Cuota ${cuota}/${nroCuotas}', 'Pendiente', 0 , ${importeCuota})`);
                }
            }
        }
    } else {
        values.push(`(${idFinanciamiento}, 1, '${fechaPrimerCuota}', ${importeCuota}, 'Contado', 'Cuota 1/1', 'Pendiente', 0, ${importeCuota})`);
    }

    const response = await connection.query(`INSERT INTO cobranzas (idFinanciamiento, nroCuota, fecha, valor, tipo, descripcion, estado, importePago, importePendiente) VALUES ${values.join(',')}`, async function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Venta creada correctamente', success: true, lastDate: actualDate });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const updateCashPayment = async (req, res) => {
    const { idFinanciamiento, fecha } = req.body;
    const response = await connection.query(`UPDATE cobranzas SET fecha = '${fecha}' WHERE idFinanciamiento = ${idFinanciamiento} AND tipo = 'Contado'`, async function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Pago actualizado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const updateFinishDate = async (req, res) => {
    const { idContrato, fecha } = req.body;
    //financiamientos y ventas
    const response = await connection.query(`UPDATE financiamientos SET fechaUltimaCuota = '${fecha}' WHERE idContrato = ${idContrato}; UPDATE ventas SET fechaLiquidacion = '${fecha}' WHERE idContrato = ${idContrato}`, async function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Datos actualizados correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const getCompleteContract = async (req, res) => {
    const { id } = req.params;
    const response = await connection.query(`SELECT con.*, cl.*, sol.*, ser.*
	FROM contratos con
    LEFT JOIN clientes cl ON con.idCliente = cl.id
    LEFT JOIN solicitudes sol ON con.idSolicitud = sol.id
    LEFT JOIN servicios ser ON sol.idServicio = ser.id
    WHERE con.id = ${id}`, async function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.length > 0) {
                res.status(200).send(rows[0]);
            } else {
                res.status(200).send({ message: 'No se encontró el contrato', success: false });
            }
        }
    });
}

const updateSalesWithWay = async (req, res) => {
    const { ids, way } = req.body;
    const response = await connection.query(`UPDATE ventas SET recorrido = '${way}' WHERE id IN (${ids.join(',')})`, async function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            res.status(200).send({ message: 'Datos actualizados correctamente', success: true });
        }
    });
}

const createPayment = async (req, res) => {
    const { id, fecha, valor, importePago, observacion, importePendiente, idContrato, importeAbonado, atraso } = req.body;
    let importePendienteCuota = valor - importePago;
    if (importePendienteCuota < 0) importePendienteCuota = 0;
    let nuevoImportePendiente = importePendiente - importePago;
    if (nuevoImportePendiente < 0) nuevoImportePendiente = 0;
    let nuevoImporteAbonado = importeAbonado + importePago;
    const queryPago = `UPDATE cobranzas SET importePago = ${importePago}, importePendiente = ${importePendienteCuota}, estado = 'Pagado', fechaPago = '${fecha}', observaciones = '${observacion}' WHERE id = ${id}`;
    let queryFinanciamiento = '';
    let nuevoAtraso = 0;
    if (importePago < valor) {
        nuevoAtraso = atraso + (valor - importePago);
    } else if (importePago > valor) {
        nuevoAtraso = atraso - (importePago - valor);
    } else {
        nuevoAtraso = atraso;
    }
    queryFinanciamiento = `UPDATE financiamientos SET importeAbonado = ${nuevoImporteAbonado}, importePendiente = ${nuevoImportePendiente}, atraso = ${nuevoAtraso}, fechaUltimoPago = '${fecha}' WHERE idContrato = ${idContrato}`;
    if (importePago >= importePendiente) {
        const response = await connection.query(`UPDATE contratos SET estado = 'Pagado' WHERE id = ${idContrato}`, async function (err, rows) {
            if (err) {
                res.status(409).send(err);
            } else {
                const response2 = await connection.query(queryPago, async function (err, rows) {
                    if (err) {
                        res.status(409).send(err);
                    }
                    else {
                        const response3 = await connection.query(queryFinanciamiento, async function (err, rows) {
                            if (err) {
                                res.status(409).send(err);
                            } else {
                                res.status(200).send({ message: 'Pago realizado correctamente', success: true });
                            }
                        });
                    }
                });
            }
        });
    } else {
        const response = await connection.query(queryPago, async function (err, rows) {
            if (err) {
                res.status(409).send(err);
            } else {
                const response3 = await connection.query(queryFinanciamiento, async function (err, rows) {
                    if (err) {
                        res.status(409).send(err);
                    } else {
                        res.status(200).send({ message: 'Pago realizado correctamente', success: true });
                    }
                });
            }
        });
    }
}

const getLastPendingPayment = async (req, res) => {
    const { id } = req.params;
    const response = await connection.query(`SELECT * FROM cobranzas WHERE idFinanciamiento = ${id} AND estado = 'Pendiente'
     AND id NOT IN(SELECT idCuota FROM pagos_pendientes WHERE estado = 'PENDIENTE' OR estado = 'Pendiente')
     ORDER BY nroCuota ASC LIMIT 1`, async function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.length > 0) {
                res.status(200).send(rows[0]);
            } else {
                res.status(200).send({ message: 'No se encontró la cuota', success: false });
            }
        }
    });
}

const resetFinancing = async (req, res) => {
    const { id } = req.body;
    const response = await connection.query(`DELETE from cobranzas where idFinanciamiento = (SELECT idFinanciamiento FROM contratos where id = ${id});
    UPDATE financiamientos SET montoFinanciado = 0, importeAbonado = 0, importeTotal = 0, bonificacion = 0, enganche = 0, numeroPagos = 0, periodo = 0, importeCuota = 0, importePendiente = 0, atraso = 0, adelanto = 0, precioBase = 0
        WHERE idContrato = ${id};
    UPDATE contratos SET idPaquete = 0 WHERE id = ${id};`, async function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            res.status(200).send({ message: 'Datos actualizados correctamente', success: true });
        }
    });
}



module.exports = {
    updateContractNumber,
    getBeneficiary,
    createBeneficiary,
    updateBeneficiary,
    getFinancing,
    createFinancing,
    updateFinancing,
    getContract,
    getContracts,
    createContract,
    updateContract,
    getSale,
    createSale,
    updateSale,
    getPayment,
    createMassivePayment,
    getRequest,
    createRequest,
    updateRequest,
    getCeremony,
    createCeremony,
    updateCeremony,
    getDeceased,
    createDeceased,
    updateDeceased,
    getService,
    createService,
    updateService,
    getSales,
    getPayments,
    getFinancings,
    getDeceaseds,
    getCeremonies,
    getBeneficiaries,
    updateFinishDate,
    getCompleteContract,
    updateSalesWithWay,
    updateCashPayment,
    createPayment,
    getLastPendingPayment,
    resetFinancing
}





