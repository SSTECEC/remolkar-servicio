var mysql = require("mysql");
var config = require("../database/database.js");
var error = require("./error.js");

let pool;
const createPool = async () => {
  pool = await mysql.createPool(config);
};

createPool();
module.exports = {

  obtenerPath: function (req, res, next) {
    res.status(200).send({ 'resultado': req.file });
  },

  gestionDetallePago: function (req, res, next) {

    pool.query('SELECT gestion_detalle_pago(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) AS res',
      [
        req.body.identificador,
        req.body.idDetallePago,
        req.body.tipo,
        req.body.ruta,
        req.body.estado,
        req.body.id,
        req.body.paymentType,
        req.body.paymentBrand,
        req.body.merchantTransactionId,
        req.body.code_,
        req.body.description,
        req.body.ReferenceNbr,
        req.body.ExtendedDescription,
        req.body.AcquirerResponse,
        req.body.bin,
        req.body.binCountry,
        req.body.last4Digits,
        req.body.holder,
        req.body.expiryMonth,
        req.body.expiryYear,
        req.body.merchantCustomerId,
        req.body.recurring,
        req.body.trama
      ], function (err, rows, fields) {
        if (err) {
          console.log(err);
          error.guardarError('paymentDetail.js', 'gestionDetallePago', JSON.stringify(err));
          res.status(500).send({ 'resultado': err });
        } else {
          var result = rows[0].res;
          res.status(200).send({ 'resultado': result });
        }

      });
    //pool.end();
  },

}
