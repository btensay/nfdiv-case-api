const I = actor();
const { testConfig } = require('../testConfig');
const constants = require('../common/constants');

const {soleOrJoint} = require('../common/constants');

module.exports = {

  fields: {
    jurisdiction: 'select[id="cc-jurisdiction"]',
    caseType: 'select[id="cc-case-type"]',
    applicationType: 'select[id="applicationType"]',
    divorceOrDissolution:'#divorceOrDissolution-divorce',

    event: 'select[id="cc-event"]',
    submit: 'button[type="submit"]'
  },

  async clickCreateCase() {
    await I.waitForText('Create case');
    await I.click('Create case');
  },

  async fillFormAndSubmit() {
    if (testConfig.TestForCrossBrowser) {
      await I.wait(60);
    } else {
      await I.wait(5);
    }
    await I.waitForText('Family Divorce');
    await I.retry(5).selectOption(this.fields.jurisdiction, 'Family Divorce');
    await I.retry(5).selectOption(this.fields.caseType, constants.currentCaseType);
    await I.wait(10);
    await I.waitForText('Apply for a divorce');
    await I.retry(5).selectOption(this.fields.event, 'Apply for a divorce');
    await I.waitForNavigationToComplete(this.fields.submit);
    await I.wait(1);
  },

  //kasi
  async fillHowDoYouWantToApplyForDivorce(soleOrJoint) {
    if (testConfig.TestForCrossBrowser) {
      await I.wait(60);
    } else {
      await I.wait(5);
    }
    await I.waitForText('How do you want to apply for the divorce');
    //await I.retry(5).selectOption(this.fields.caseType, 'Sole Application');

    // TODO sole or joint check
    //if(soleOrJoint  === 'SoleApplicant') {
    //}

    await I.retry(5).selectOption(this.fields.applicationType, 'Sole Application');
    await I.click(this.fields.divorceOrDissolution);
    await I.waitForNavigationToComplete(this.fields.submit);
    await I.wait(1);
  }
};
