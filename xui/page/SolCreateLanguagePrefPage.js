const I = actor();

module.exports = {

  fields: {
    existingLanguagePreferences: '#applicant1LanguagePreferenceWelsh-No',
    submit: 'button[type="submit"]'
  },

  async fillFormAndSubmit() {
    await I.runAccessibilityTest();
    await I.waitForElement(this.fields.existingLanguagePreferences);
    await I.click(this.fields.existingLanguagePreferences);
    await I.waitForNavigationToComplete(this.fields.submit);
    await I.wait(1);
  }
};
