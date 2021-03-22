var mysql = require("mysql");
var config = require("../database/database.js");
var error = require("./error.js");
var globals = require('../globlal/globals.js');
var methods = require('../globlal/methods.js');
const request = require("request-promise");

let pool;
const createPool = async () => {
  pool = await mysql.createPool(config);
};

createPool();

module.exports = {

  obtenerChekoutId: function (req, res, next) {

    pool.query('SELECT * FROM credenciales WHERE modo = ? AND identificador = ?', [globals.entorno, 'DATAFAST-1'], function (err, rows, fields) {
      if (err) {
        console.log(err);
        error.guardarError('payment.js', 'obtenerChekoutId', JSON.stringify(err));
        res.status(500).send({ 'resultado': 5 });
      } else {
        var credentials = rows[0];

        var valores = { total: 0, subtotal0: 0, subtotal12: 0, iva: 0 };
        if (globals.entorno == 'PRODUCCION') {
          valores.subtotal12 = req.body.subtotal;
          valores.subtotal0 = "0.00";
          valores.iva = req.body.iva;
          valores.total = req.body.total;
        } else {
          valores.subtotal12 = "0.89";
          valores.subtotal0 = "0.00";
          valores.iva = "0.11";
          valores.total = "1.00";
        }


        var mode = (globals.entorno == 'PRODUCCION' ? '' : '&testMode=EXTERNAL');
        var body =
          "entityId=" + credentials.entityId + "" +
          "&amount=" + valores.total + "" +
          "&currency=USD" +
          "&paymentType=DB" +
          "&customer.givenName=" + req.body.primerNombre + "" +
          "&customer.middleName=" + req.body.segundoNombre + "" +
          "&customer.surname=" + req.body.apellido + "" +
          "&customer.ip=" + methods.generarIp() + "" +
          "&customer.merchantCustomerId=" + req.body.idCliente + "" +
          "&merchantTransactionId=" + req.body.idTransaccion + "" +
          "&customer.email=" + req.body.email + "" +
          "&customer.identificationDocType=IDCARD" +
          "&customer.identificationDocId=" + req.body.identificacion + "" +
          "&customer.phone=" + req.body.telefono + "" +
          "&shipping.street1=" + req.body.direccion + "" +
          "&billing.street1=" + req.body.direccion + "" +
          "&shipping.country=EC" +
          "&billing.country=EC" +
          mode +
          "&customParameters[SHOPPER_VAL_BASE0]=" + valores.subtotal0 + "" +
          "&customParameters[SHOPPER_VAL_BASEIMP]=" + valores.subtotal12 + "" +
          "&customParameters[SHOPPER_VAL_IVA]=" + valores.iva + "" +
          "&customParameters[SHOPPER_MID]=" + credentials.mid + "" +
          "&customParameters[SHOPPER_TID]=" + credentials.tid + "" +
          "&customParameters[SHOPPER_ECI]=" + credentials.eci + "" +
          "&customParameters[SHOPPER_PSERV]=" + credentials.pserv + "" +
          "&customParameters[SHOPPER_VERSIONDF]=" + credentials.versiondf + "" +
          "&risk.parameters[USER_DATA2]=" + credentials.userData + "" +
          "&cart.items['0'].name=" + req.body.nombreProducto + "" +
          "&cart.items['0'].description=" + req.body.nombreProducto + "" +
          "&cart.items['0'].price=" + valores.total + "" +
          "&cart.items['0'].quantity=1";

        var options = {
          method: 'POST',
          uri: credentials.url + "/v1/checkouts",
          headers: {
            'Authorization': "Bearer " + credentials.token,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: body,
          json: true
        };

        request(options).then(function (res_) {
          res.status(200).send({ 'resultado': res_ });
        }).catch(function (err) {
          error.guardarError('payment.js', 'obtenerChekoutId', JSON.stringify(err));
          res.status(500).send({ 'resultado': err });
        });

      }

    });
  },

  obtenerResultado: function (req, res, next) {

    pool.query('SELECT * FROM credenciales WHERE modo = ? AND identificador = ?', [globals.entorno, 'DATAFAST-1'], function (err, rows, fields) {
      if (err) {
        console.log(err);
        error.guardarError('payment.js', 'obtenerResultado', JSON.stringify(err));
        res.status(500).send({ 'resultado': 5 });
      } else {
        var credentials = rows[0];

        var options = {
          method: 'GET',
          uri: credentials.url + req.body.resourcePath + "?entityId=" + credentials.entityId + "",
          headers: {
            'Authorization': "Bearer " + credentials.token,
            'Content-Type': 'application/json'
          },
          json: true
        };

        request(options).then(function (res_) {
          res.status(200).send({ 'resultado': res_ });
        }).catch(function (err) {
          error.guardarError('payment.js', 'obtenerResultado', JSON.stringify(err));
          res.status(200).send({ 'resultado': err });
        });

      }

    });
  },
}
