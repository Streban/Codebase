function marketingEmail() {
  return `
    <style>
        .container {
            padding: 10px 35px;
        }

        .text-center {
            text-align: center;
        }
    </style>
    <div class="container">
        Dear User, <br>

       We Welcome you onboard to Expert.
        <br>
        <br>
        <br>
            <p >This is automated marketing email. Kindly don't reply to it </p>
        <br>
        <br>
        <br>
        <br>

        Thanks & Regards<br>
        Seltec SMC Ltd.
    </div>
    `;
}

function emailTemplate(otpCode = "OTP-CODE-HERE", name = "Every One") {
  return `
    <style>
        .container {
            padding: 10px 35px;
        }

        .text-center {
            text-align: center;
        }
    </style>
    <div class="container">
        Hi ${name},<br>

        Welcome to Expert, Below is your verification OTP Code.
        <br>
        <br>
        <br>
            <p class="text-center">${otpCode} </p>
        <br>
        <br>
        <br>
        <br>

        Thanks & Regards<br>
        Seltec SMC Ltd.
    </div>
    `;
}

module.exports = {
  emailTemplate,
  marketingEmail,
};
