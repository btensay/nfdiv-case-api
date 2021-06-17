const I = actor();

module.exports = {

  fields: {
    firstName: '#applicant2FirstName',
    lastName: '#applicant2LastName',
    respondentChangedName: '#applicant2NameDifferentToMarriageCertificate-No',
    respondentGender: '#applicant2Gender',
    wishToEffectServiceOnRespondent: '#PetitionerSolicitorToEffectService-Yes',
    respondentUsingASolicitor: '#D8RespondentCorrespondenceSendToSol-No',
    respondentServiceAddress: '#D8DerivedRespondentCorrespondenceAddr',
    applicant2DocumentInWelsh: '#applicant2WelshLanguagePreference-Yes',
    submit: 'button[type="submit"]'
  },

  async fillFormAndSubmit() {
    await I.waitForElement(this.fields.firstName);
    await I.runAccessibilityTest();
    await I.fillField(this.fields.firstName, 'Tasha');
    await I.fillField(this.fields.lastName, 'St Patrick');
    await I.click(this.fields.respondentChangedName);
    await I.selectOption(this.fields.respondentGender, 'Female');
    //await I.click(this.fields.applicant2DocumentInWelsh);
    await I.wait(1);
    await I.waitForNavigationToComplete(this.fields.submit);
  }
};
