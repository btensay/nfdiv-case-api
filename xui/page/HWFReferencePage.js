const I = actor();

const { paymentType,eventDisplayName } = require('../common/constants');

module.exports = {

  fields: {
    hwfReferenceOk: '#hwfCodeValidForFullAmount-Yes',
    hwfEventSummary:'#field-trigger-summary',
    hwfEventDescription:'#field-trigger-description',
    HWF_RESULTS:'HWF Results',
    submit: 'button[type="submit"]'
  },

  async fillFormAndSubmit() {
    await I.wait(2);
    await I.waitInUrl('trigger/validate-hwf-code/validate-hwf-codehwfCodeValidationResults');
    //await I.runAccessibilityTest();
    await I.see(this.fields.HWF_RESULTS);
    await I.click(this.fields.hwfReferenceOk);
    await I.waitForNavigationToComplete(this.fields.submit);
    await I.wait(2);
  },

  async fillEventSummaryAndDescription(caseNumber){
    await I.waitInUrl('validate-hwf-code/submit');
    await I.fillField(this.fields.hwfEventSummary, 'HWF EventSummary for '+caseNumber);
    await I.fillField(this.fields.hwfEventDescription, 'HWF Event Description for '+ caseNumber);
    await I.waitForNavigationToComplete(this.fields.submit);
    await I.wait(2);

  }
};
