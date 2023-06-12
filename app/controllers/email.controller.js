const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.triggerSend = (to, sub, body) => {
    const msg = {
        to: to,
        from: 'vinod.modukuri@eagles.oc.edu',
        subject: sub,
        html: body,
    };
    sgMail.send(msg)
    .then(() => {
        console.log('Email sent to ' + to)
    })
    .catch((error) => {
        console.error(error)
    });
}