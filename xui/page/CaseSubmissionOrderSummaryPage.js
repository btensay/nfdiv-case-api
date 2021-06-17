const I = actor();

const { paymentType } = require('../common/constants');

module.exports = {

  fields: {
    submit: 'button[type="submit"]'
  },

  async fillFormAndSubmit(paymentMethod) {
    await I.waitInUrl('solicitor-submit-application/solicitor-submit-applicationSolPaymentSummary');
    await I.waitForText('Case submission');
    await I.runAccessibilityTest();
    if (paymentMethod === paymentType.FEE_ACCOUNT) {
      await I.see('Your fee account reference: Next case submitted');
    } else if (paymentMethod === paymentType.HWF) {
      await I.see('Help with fee reference: FEE001');
    }
    await I.wait(1);
    await I.waitForNavigationToComplete(this.fields.submit);
  }
};
