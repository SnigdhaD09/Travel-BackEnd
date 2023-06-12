const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.triggerSend = (to, sub, body) => {
    const msg = {
        to: to,
        from: 'vinod.modukuri@eagles.oc.edu',
        subject: sub,
        html: body,
    };
    console.log(msg);
    sgMail.send(msg)
    .then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error(error)
    });
}

exports.triggerSendPersonalized = (personalizations, body) => {
    const msg = {
        personalizations: personalizations,
        from: 'vinod.modukuri@eagles.oc.edu',
        html: body,
    };
    console.log(msg);
    sgMail.send(msg)
    .then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error(error)
    });
}