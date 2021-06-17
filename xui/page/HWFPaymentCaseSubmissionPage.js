const I = actor();

const { paymentType } = require('../common/constants');

module.exports = {

  fields: {
    helpWithFeesReference: '#helpWithFeesReferenceNumber',
    submit: 'button[type="submit"]'
  },

  async fillFormAndSubmit() {
    await I.waitInUrl('solicitor-submit-application/solicitor-submit-applicationHelpWithFees');
    await I.runAccessibilityTest();
    await I.fillField(this.fields.helpWithFeesReference, 'FEE001');
    await I.waitForNavigationToComplete(this.fields.submit);
    await I.wait(2);
  }
};
