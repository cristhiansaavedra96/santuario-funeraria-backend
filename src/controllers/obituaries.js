const { connection } = require('../controllers');

const getObituaries = async (req, res) => {
    const response = await connection.query('SELECT * FROM esquelas', function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            res.status(200).send(rows);
        }
    });
}

const getObituary = async (req, res) => {
    const { id } = req.params;
    const response = await connection.query(`SELECT * FROM esquelas WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.length > 0) {
                res.status(200).send(rows[0]);
            } else {
                res.status(200).send({ message: 'No se encontró la esquela', success: false });
            }
        }
    });
}

const updateObituary = async (req, res) => {
    const { id, nombre, descripcion, url_view, url_share } = req.body;
    const query = `UPDATE esquelas SET nombre = '${nombre}', descripcion = '${descripcion}', url_view = '${url_view}', url_share = '${url_share}' WHERE id = ${id}`;

    const response = await connection.query(query, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Esquela actualizada correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const createObituary = async (req, res) => {
    const { nombre, descripcion, url_view, url_share } = req.body;
    const response = await connection.query(`INSERT INTO esquelas (nombre, descripcion, url_view, url_share) VALUES ('${nombre}', '${descripcion}', '${url_view}', '${url_share}')`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Esquela creada correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const deleteObituary = async (req, res) => {
    const { id } = req.body;
    const response = await connection.query(`DELETE FROM esquelas WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Esquela eliminada correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

module.exports = {
    getObituaries,
    getObituary,
    updateObituary,
    createObituary,
    deleteObituary
}