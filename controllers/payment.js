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

        var mode = (globals.entorno == 'PRODUCCION' ? '' : '&testMode=EXTERNAL');
        var body =
          "entityId=" + credentials.entityId + "" +
          "&amount=3.12" +
          "&currency=USD" +
          "&paymentType=DB" +
          "&customer.givenName=MARIO" +
          "&customer.middleName=FERNANDO" +
          "&customer.surname=PALOMO" +
          "&customer.ip=" + methods.generarIp() + "" +
          "&customer.merchantCustomerId=897982" +
          "&merchantTransactionId=897982" +
          "&customer.email=mariofpalomoa@gmail.com" +
          "&customer.identificationDocType=IDCARD" +
          "&customer.identificationDocId=1724395536" +
          "&customer.phone=0979212157" +
          mode +
          "&customParameters[SHOPPER_VAL_BASE0]=2.00" +
          "&customParameters[SHOPPER_VAL_BASEIMP]=1.00" +
          "&customParameters[SHOPPER_VAL_IVA]=0.12" +
          "&customParameters[SHOPPER_MID]=" + credentials.mid + "" +
          "&customParameters[SHOPPER_TID]=" + credentials.tid + "" +
          "&risk.parameters[USER_DATA2]=" + credentials.userData + "" +
          "&cart.items['0'].name=LLANTA CST 2.50-17 C7226 4PR 38L" +
          "&cart.items['0'].description=LLANTA CST 2.50-17 C7226 4PR 38L" +
          "&cart.items['0'].price=3.12" +
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
