const I = actor();

module.exports = {

  fields: {
    solicitorsName: '#applicant1SolicitorName',
    referenceNumer: '#applicant1SolicitorReference',
    applicant1SolicitorPhone: '#applicant1SolicitorPhone',
    applicant1SolicitorEmail: '#applicant1SolicitorEmail',
    correspondenceByEmail:'#applicant1SolicitorAgreeToReceiveEmails-Yes',
    firmDxAddress: '#derivedApplicant1SolicitorAddress',
    yourReferenceNumber: '#D8SolicitorReference',
    phoneNumber: '#PetitionerSolicitorPhone',
    email: '#PetitionerSolicitorEmail',
    solicitorAgree: '#SolicitorAgreeToReceiveEmails-Yes',
    searchOrganisation:'#search-org-text',

    submit: 'button[type="submit"]',
    OrgNamesText: 'Organisation name and address',
    OrgSearchBar: '#search-org-text',
    OrgResultTable: '#organisation-table',
    OrgSelectLink: 'a[title="Select the organisation NFD Solicitor Organisation"]'

  },

  async fillFormAndSubmit() {
    await I.waitForElement(this.fields.solicitorsName);
    await I.fillField(this.fields.solicitorsName, 'E2E TEST SOLICITOR NAME');
    await I.fillField(this.fields.referenceNumer, 'AWS11234');
    await I.fillField(this.fields.applicant1SolicitorPhone, '02086431254');
    await I.fillField(this.fields.applicant1SolicitorEmail, 'sols1@mailinator.com');
    await I.click(this.fields.correspondenceByEmail);

    await I.waitForElement(this.fields.searchOrganisation);
    await I.fillField(this.fields.searchOrganisation, 'NFD');
    await I.waitForElement(this.fields.OrgResultTable);

    await I.scrollTo(this.fields.OrgSelectLink);
    await I.click(this.fields.OrgSelectLink);
    await I.waitForNavigationToComplete(this.fields.submit);

  }
};
