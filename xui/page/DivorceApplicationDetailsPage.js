const I = actor();

module.exports = {

  fields: {
    marriageDateDay: '#marriageDate-day',
    marriageDateMonth: '#marriageDate-month',
    marriageDateYear: '#marriageDate-year',
    petitionerFullname: '#marriageApplicant1Name',
    respondentFullname: '#marriageApplicant2Name',
    placeOfMarriage:'#marriagePlaceOfMarriage',
    eventSummary:'#field-trigger-summary',
    eventDescription:'#field-trigger-description',
    submit: 'button[type="submit"]'
  },

  async fillFormAndSubmit() {
    await I.waitInUrl('/issue-application/issue-applicationissueApplication');
    await I.runAccessibilityTest();
    await I.fillField(this.fields.marriageDateDay, '09');
    await I.fillField(this.fields.marriageDateMonth, '04');
    await I.fillField(this.fields.marriageDateYear, '2011');
    await I.fillField(this.fields.petitionerFullname, 'James St Patrick');
    await I.fillField(this.fields.respondentFullname, 'Tasha St Patrick');
    await I.fillField(this.fields.placeOfMarriage, 'Point Pedro');
    await I.waitForNavigationToComplete(this.fields.submit);
    await I.wait(1);
  },

  async fillEventSummaryAndDescription(){
    await I.waitInUrl('/issue-application/submit');
    await I.runAccessibilityTest();
    await I.fillField(this.fields.eventSummary, 'Issue Application Event Summary');
    await I.fillField(this.fields.eventDescription, 'Issue Application Event Description');
    await I.waitForNavigationToComplete(this.fields.submit);
    await I.wait(1);
  }

};
