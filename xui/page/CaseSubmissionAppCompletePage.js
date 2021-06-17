const I = actor();

module.exports = {

  fields: {
    submit: 'button[type="submit"]'
  },

  async fillFormAndSubmit() {
    await I.runAccessibilityTest();
    await I.see('Before you submit');
    await I.see('What happens next');
    await I.see('Please continue to submit your application on the next screen');
    await I.see('0300 303 0642');
    I.waitForNavigationToComplete(this.fields.submit);
    await I.wait(1);
  }
};
