const I = actor();

module.exports = {

  fields: {
    legalConnections_A: '#legalConnections-A',
    legalConnections_B: '#legalConnections-B',
    legalConnections_C: '#legalConnections-C',

    submit: 'button[type="submit"]'
  },

  async selectLegalActionsAndSubmit() {
    await I.waitForText('Jurisdiction - Apply for a divorce');
    await I.runAccessibilityTest();
    await I.click(this.fields.legalConnections_A);
    await I.click(this.fields.legalConnections_B);
    await I.click(this.fields.legalConnections_C);

    await I.waitForNavigationToComplete(this.fields.submit);
    await I.wait(1);
  }
};
