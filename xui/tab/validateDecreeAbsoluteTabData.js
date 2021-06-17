const I = actor();
const labels = require('../data/tab-fields/decreeAbsolute.json');
const { formatDateToCcdDisplayDate } = require('../helper/utils');

module.exports = async (verifyContent) => {
  await I.clickTab(labels.name);
  await I.see(labels.respCanApplyDA);
  await I.see(formatDateToCcdDisplayDate(new Date(verifyContent.DateRespondentEligibleForDA)));
  await I.see(labels.finalDateForDA);
  await I.see(formatDateToCcdDisplayDate(new Date(verifyContent.DateCaseNoLongerEligibleForDA)));
};
