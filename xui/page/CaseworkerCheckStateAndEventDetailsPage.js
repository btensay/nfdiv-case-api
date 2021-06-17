const I = actor();

const { signOut } = require('../common/constants');

module.exports = {

  async checkEventAndStateOnPageAndSignOut(state, event) {
    await I.wait(1);
    await I.see(state);
    await I.see(event);
    await I.wait(3);
    await I.click(signOut);
  }

};
