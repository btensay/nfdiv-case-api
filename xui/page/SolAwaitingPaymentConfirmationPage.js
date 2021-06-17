const I = actor();

const { signOut } = require('../common/constants');

module.exports = {
  async checkPageAndSignOut() {
    await I.wait(1);
    await I.see("Case submission");

    await I.click(signOut);
    console.log('...~~~~~~~~~~~~~~~~ Solicitor Signed Out ~~~~~~~~~~~~~');

  }
};
