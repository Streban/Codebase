class CredentialsClass {
  credentials;
  retries;

  constructor() {
    this.credentials = [];
    this.retries = 0;
  }

  init() {}

  getTransporter(country = "", type = "", env) {
    if (![].includes(country)) {
      return null;
    }

    if (![].includes(type)) {
      return null;
    }
  }
}

const Credentails = new CredentialsClass();
