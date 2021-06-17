const {yesorno} = require('../common/constants');
const I = actor();

module.exports = {

  fields: {
    //caseUrgentYes: '#SolUrgentCase-Yes',
    //caseUrgentNo: '#solUrgentCase-No',
    caseUrgentYes: '#solUrgentCase-Yes',
    caseUrgentNo: '#solUrgentCase-No',
    //caseUrgentSupportingInfoTextBox: '#SolUrgentCaseSupportingInformation',
    caseUrgentSupportingInfoTextBox: '#solUrgentCaseSupportingInformation',

    reconciliationWithThePetitioner: '#SolStatementOfReconciliationCertify-Yes',
    reconciliationWithApplicant1: '#solStatementOfReconciliationCertify-Yes',

    namesAndAddressesOfPersonsQualified: '#solStatementOfReconciliationDiscussed-Yes',
    petitionerBelievesFactsTrue: '#statementOfTruth-Yes',
    applicant1_BelievesFactsTrue: '#statementOfTruth-Yes',

    amAuthorisedByPetitionerToSign: '#solSignStatementofTruth-Yes',
    amAuthorisedByApplicant1ToSign: '#solSignStatementOfTruth-Yes',

    //yourName: '#SolStatementOfReconciliationName',
    yourName: '#solStatementOfReconciliationName',
    //nameOfYourFirm: '#SolStatementOfReconciliationFirm',
    nameOfYourFirm: '#solStatementOfReconciliationFirm',
    howToServeRespondent:'#SolServiceMethod-courtService',
    serveRespondentPersonalService:'#solServiceMethod-personalService',

  //additionalComments: '#StatementOfReconciliationComments',
    additionalComments: '#statementOfReconciliationComments',

    submit: 'button[type="submit"]'
  },

  async fillFormAndSubmit(urgent) {
    //await I.waitInUrl('solicitorStatementOfTruthPaySubmit/solicitorStatementOfTruthPaySubmitSolStatementOfTruth');
    // nfdiv change in url
    await I.waitInUrl('solicitor-submit-application/solicitor-submit-applicationSolStatementOfTruth');

    await I.runAccessibilityTest();
    if (urgent === yesorno.No) {
      await I.click(this.fields.caseUrgentNo);
    } else if (urgent === yesorno.Yes) {
      await I.click(this.fields.caseUrgentYes);
      await I.fillField(this.fields.caseUrgentSupportingInfoTextBox, 'here is the supporting information and instructions for the urgency');
    }

    await I.retry().click(this.fields.serveRespondentPersonalService);
    await I.see("After service is complete you must notify the court by completing the 'Confirm Service' form in CCD");
    await I.click(this.fields.reconciliationWithApplicant1);
    await I.click(this.fields.namesAndAddressesOfPersonsQualified);

    await I.click(this.fields.applicant1_BelievesFactsTrue);
    await I.click(this.fields.amAuthorisedByApplicant1ToSign);
    await I.fillField(this.fields.yourName, 'James Porter');
    await I.fillField(this.fields.nameOfYourFirm, 'Nicole Denvir and Purnell');
    await I.fillField(this.fields.additionalComments, 'Additional Comments');
    await I.waitForNavigationToComplete(this.fields.submit);
  }
};
