const I = actor();

module.exports = {

  fields: {
    petitionerWantsToClaimCosts: '#divorceCostsClaim-Yes',
    submit: 'button[type="submit"]'
  },

  async fillFormAndSubmit() {
    await I.waitInUrl('solicitor-create-applicationClaimForCosts');
    await I.runAccessibilityTest();
    await I.click(this.fields.petitionerWantsToClaimCosts);
    await I.waitForNavigationToComplete(this.fields.submit);
    await I.wait(1);
  }
};
