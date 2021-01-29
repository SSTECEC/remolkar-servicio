var mail = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

module.exports = {

    enviarEmail: function (req, res) {

        var asunto = req.body.asunto;
        var message =   "<body>"+
                            "<h3>Plataforma Remolkar</h3>"+
                            "<br><h6>Detalle</h6>"+
                            "<b>Nombre: </b><span>" + req.body.nombre + "</span><br>"+
                            "<b>Correo: </b><span>" + req.body.correo + "</span><br>"+
                            "<b>Mensaje: </b><br><span>" + req.body.mensaje + "</span>"+
                        "</body>";

     
        let credenciales = mail.createTransport(smtpTransport({
            host: 'smtp.gmail.com',
            port: '587',
            secure: false,
            auth: {
              user: 'remolkar.ec@gmail.com',
              pass: 'r3m0lk4r123'
            }   
          }));

          let opciones = {
            to: 'ventas@remolkar.com;ventas1@remolkar.com;repuestos@remolkar.com;gruas1@remolkar.com, gruas2@remolkar.com', 
            subject: asunto,
            html: message,
          };
  
          credenciales.sendMail(opciones, (error, info) => {
            if (error) {
              console.log(error);
              res.status(500).send({ 'resultado': error });
            } else {
              console.log('Message %s sent: %s', info.messageId, info.response);
              res.status(200).send({ 'resultado': info });
            }
          });
    },
  
  }