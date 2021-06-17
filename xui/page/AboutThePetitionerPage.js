const I = actor();

module.exports = {

  fields: {
    firstName: '#applicant1FirstName',
    lastName: '#applicant1LastName',
    applicant1_changedName: '#applicant1NameDifferentToMarriageCertificate-No',
    whoIsApplicant1Divorcing: '#divorceWho',
    addressLine1_Building:'#applicant1HomeAddress_AddressLine1',
    applicant1Gender: '#applicant1Gender',
    sameSex: '#marriageIsSameSexCouple-No',
    applicant1_postcode:'#applicant1HomeAddress_applicant1HomeAddress_postcodeInput',
    applicant1_selected_address:'#applicant1HomeAddress_applicant1HomeAddress_addressList',
    findAddressButton:'button[type="button" ]',
    selectAddresssDropDown: '#applicant1HomeAddress_applicant1HomeAddress_addressList',

    //petitionerHomeAddress: '#D8DerivedPetitionerHomeAddress',
    applicant1_phoneNumber: '#applicant1PhoneNumber',
    applicant1_email: '#applicant1Email',
    keepPetitionerContactDetails: '#applicant1ContactDetailsConfidential',
    submit: 'button[type="submit"]'
  },

  async fillFormAndSubmit() {
    await I.waitForElement(this.fields.firstName);
    await I.fillField(this.fields.firstName, 'E2E James');
    await I.fillField(this.fields.lastName, 'Patterson');
    await I.click(this.fields.applicant1_changedName);
    await I.selectOption(this.fields.whoIsApplicant1Divorcing, 'Wife');
    await I.selectOption(this.fields.applicant1Gender, 'Male');

    await I.click(this.fields.sameSex);

    await I.click('I can\'t enter a UK postcode');

    // TODO AddressSearch and select dropdown. ( Find Address button )

    await I.wait(3);
    await I.fillField(this.fields.addressLine1_Building, 'Building 007');
    await I.fillField(this.fields.applicant1_phoneNumber, '02086452154');
    await I.fillField(this.fields.applicant1_email, 'JamesStPatrick@power.com');

    await I.selectOption(this.fields.keepPetitionerContactDetails, '2: keep');
    await I.wait(2);

    await I.waitForNavigationToComplete(this.fields.submit);
  }
};
