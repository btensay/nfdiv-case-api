const I = actor();

module.exports = {

  fields: {
    marriageDateDay: '#marriageDate-day',
    marriageDateMonth: '#marriageDate-month',
    marriageDateYear: '#marriageDate-year',
    petitionerFullname: '#marriageApplicant1Name',
    respondentFullname: '#marriageApplicant2Name',
    didMarriageTakePlaceInUK: '#marriageMarriedInUk-Yes',
    submit: 'button[type="submit"]'
  },

  async fillFormAndSubmit() {
    await I.waitInUrl('solicitor-create-applicationMarriageCertificateDetails');
    await I.waitForElement(this.fields.marriageDateDay);
    await I.runAccessibilityTest();
    await I.fillField(this.fields.marriageDateDay, '09');
    await I.fillField(this.fields.marriageDateMonth, '04');
    await I.fillField(this.fields.marriageDateYear, '2011');
    await I.fillField(this.fields.petitionerFullname, 'James St Patrick');
    await I.fillField(this.fields.respondentFullname, 'Tasha St Patrick');
    await I.click(this.fields.didMarriageTakePlaceInUK);
    await I.waitForNavigationToComplete(this.fields.submit);
    await I.wait(2);
  }
};
