const I = actor();

module.exports = {

  fields: {
    marriageBrokenDownYes: '#screenHasMarriageBroken-Yes',
    marriageBrokenDownNo: '#screenHasMarriageBroken-No',
    submit: 'button[type="submit"]'
  },

  async hasMarriageBrokenDown() {
    await I.waitForText('Has the marriage irretrievably broken down (it cannot be saved)?');
    await I.runAccessibilityTest();
    await I.click(this.fields.marriageBrokenDownYes);

    await I.waitForNavigationToComplete(this.fields.submit);
    await I.wait(1);
  }
};
