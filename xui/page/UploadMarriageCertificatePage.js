const I = actor();
const { testConfig } = require('../testConfig');

module.exports = {

  fields: {
    addNewButton: 'button[type="button"]',
    chooseFile: 'input[id="documentsUploaded_0_documentLink"]',
    fileComment: '#documentsUploaded_0_documentComment',
    submit: 'button[type="submit"]'
  },

  async fillFormAndSubmit() {
    await I.waitInUrl('/solicitor-create-applicationUploadSupportingDocuments');
    await I.runAccessibilityTest();
    await I.see('Documents uploaded (Optional)');
    const isAttachFileSupportedBrowser = !(await I.isMicrosoftEdgeOrSafariBrowser());

    // TODO Remove , once sorted for Chromium browswer .
    await I.click(this.fields.addNewButton);
    await I.attachFile(this.fields.chooseFile, 'data/fileupload.txt');
    await I.fillField(this.fields.fileComment, 'Uploading a dummy file');

    // existing code in master
    if (testConfig.TestForCrossBrowser && isAttachFileSupportedBrowser) {
      await I.click(this.fields.addNewButton);
      await I.attachFile(this.fields.chooseFile, 'data/fileupload.txt');
      await I.fillField(this.fields.fileComment, 'Uploading a dummy file');
    }

    await I.wait(2);
    await I.waitForNavigationToComplete(this.fields.submit);
  }
};
