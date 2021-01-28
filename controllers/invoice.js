var mysql = require("mysql");
var config = require("../database/database.js");
var error = require("./error.js");

let pool;
const createPool = async () => {
  pool = await mysql.createPool(config);
};

createPool();

module.exports = {

  gestionFactura: function (req, res, next) {

    pool.query('SELECT gestion_factura(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) AS res',
      [
        req.body.identificador,
        req.body.idFactura,
        req.body.codigo,
        req.body.autorizacion,
        req.body.fecha,
        req.body.subtotal12,
        req.body.subtotal0,
        req.body.subtotalSinImpuestos,
        req.body.descuento,
        req.body.ice,
        req.body.iva,
        req.body.total,
        req.body.estado,
        req.body.idCliente,
        req.body.idEmpleado,
        req.body.idFormaPago,
        req.body.idDetallePago,
        req.body.idTaller,
        req.body.ruta
      ], function (err, rows, fields) {
          if (err) {
            console.log(err);
            error.guardarError('invoice.js', 'gestionFactura', JSON.stringify(err));
            res.status(500).send({ 'resultado': err });
          } else {
            var result = rows[0].res;
            res.status(200).send({ 'resultado': result });
          }

        });
    //pool.end();
  },

  gestionFacturaDetalle: function (req, res, next) {

    pool.query('CALL gestion_factura_detalle(?)',
      [req.body.trama], function (err, rows, fields) {
        if (err) {
          console.log(err);
          error.guardarError('invoice.js', 'gestionFacturaDetalle', JSON.stringify(err));
          res.status(500).send({ 'resultado': 5 });
        } else {
          var result = rows[0];
          if (result == undefined) {
            res.status(200).send({ 'resultado': err });
          } else {
            res.status(200).send({ 'resultado': result });
          }
        }

      });
    //pool.end();
  },
}
