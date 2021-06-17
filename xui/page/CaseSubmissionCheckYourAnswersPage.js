const I = actor();

module.exports = {

  fields: {
    submit: 'button[type="submit"]'
  },

  async fillFormAndSubmit() {
    await I.waitInUrl('solicitor-submit-application/submit');
    await I.runAccessibilityTest();
    await I.see('Case submission');
    await I.see('Check your answers');
    await I.waitForNavigationToComplete(this.fields.submit);
    await I.wait(1);
  }
};
