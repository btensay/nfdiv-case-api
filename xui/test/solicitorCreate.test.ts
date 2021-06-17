import { paymentType, yesorno } from '../common/constants';
import { testConfig } from "../testConfig";

let caseNumber;

Feature('Solicitor create NFD case - with fee account');

//NFD Create Case + Submit Application
Scenario('Solicitor create case and make payment', async ({ I }) => {

  await I.amOnHomePage();
  await I.login(testConfig.TestEnvSolUser, testConfig.TestEnvSolPassword);
  await I.clickCreateCase();

  await I.fillCreateCaseFormAndSubmit();
  await I.fillSoleOrJointOptionForDivorce();

  // About Solicitor
  await I.fillAboutSolicitorFormAndSubmit();

  // Marriage - Irretrievably Broken Down
  await I.marriageBrokenDown();

  // About Applicant1
  await I.fillAboutThePetitionerFormAndSubmit();

  // About Applicant2
  await I.fillAboutTheRespondentFormAndSubmit();

  // Applicant 2 Service Details
  await I.fillAboutRespSolicitorFormAndSubmit();

  // Marriage Certificate Details
  await I.completeMarriageCertificateDetailsPageAndSubmit();

  // Jurisdiction
  await I.selectJurisdictionQuestionPageAndSubmit();

  // Other Legal Proceedings
  await I.otherLegalProceedings();

  // Financial Orders
  await I.financialOrdersSelectButton();

  // Claim Costs
  await I.claimForCostsSelectButton();

  // Upload the marriage certificate
  await I.uploadTheMarriageCertificateOptional();

  // Select Language
  await I.languagePreferenceSelection();


  // Create Application 'Save Application' and 'Check Your Answers'
  await I.solicitorCreateCheckYourAnswerAndSubmit();
  // TODO ASSERT the STATE of the case here after Case Creation
  // Case Submission Steps
  caseNumber = await I.solicitorCaseCreatedAndSubmit();
  caseNumber = caseNumber.replace(/\D/gi, '');
  console.log('--------------------------------------------- CASE NUMBER ------------------------------------------'+ caseNumber);

  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~ ~~~~~~~~~~~~~  Solicitor Create Case Done ~~~~~~~~~~~~~ ~~~~~~~~~~~~~ ~~~~~~~~~~~~~ ~~~~~~~~~~~~~ ');

  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~ ~~~~~~~~~~~~~ Start Solicitor Submit Application  ~~~~~~~~~~~~~ ~~~~~~~~~~~~~ ~~~~~~~~~~~~~ ');

  // Case Submission - StatementOfTruth Reconciliation Page.
  await I.statementOfTruthAndReconciliationPageFormAndSubmit(yesorno.No);

  // Case Submission  - Help With Fees Page and Fees Reference Number.
  await I.paymentWithHelpWithFeeAccount();

  // HWF Reference Entered ....
  await I.casePaymentWithHWFAndSubmissionPageFormAndSubmit();

  //Case Submission - ORDER Summary
  await I.caseOrderSummaryPageFormAndSubmit(paymentType.HWF);

  // Case Submission - Before You Submit
  await I.caseApplicationCompletePageFormAndSubmit();

  // Case Submission Check Your Answers.
  await I.caseCheckYourAnswersPageFormAndSubmit();

  // No draft petition should be present , but Uploaded Docs should be present.
  await I.solAwaitingPaymentConfPageFormAndSubmit();

  console.log('~~~~~~~~~~~~~  Solicitor Submit Application Done ~~~~~~~~');

  await I.wait(8);

  // Login as CaseWorker and Validate HWF Reference

  console.log('....... Caseworker Login to Validate HWF Code ...');

  await I.login(testConfig.TestEnvCWUser, testConfig.TestEnvCWPassword);
  await I.wait(7);
  await I.shouldBeOnCaseListPage();
  await I.wait(5);
  await I.amOnPage('/case-details/' + caseNumber);
  await I.wait(5);

  await I.selectHWFReferenceValidation();
  await I.validateHWFCode();
  await I.fillHwfEventSummaryFor(caseNumber);
  await I.wait(2);
  await I.cwCheckStateAndEvent('Application paid and submitted','Validate HWF Code');

  console.log('~~ HWF Code Validated and State is now Submitted');

  // Login As CourtAdmin and Issue the Case ( ie Move case from Submitted State to Issued )

  console.log('....... Login as CourtAdmin And Issue the Case - ie Move case from Submitted to Issued............');

  await I.login(testConfig.TestEnvCourtAdminUser, testConfig.TestEnvCourtAdminPassword);
  await I.wait(7);
  await I.shouldBeOnCaseListPage();
  await I.wait(5);
  await I.amOnPage('/case-details/' + caseNumber);
  await I.wait(5);
  await I.selectEvent('Issue Application')
  await I.issueDivorceApplication();
  await I.fillIssueApplicationEventDetails();
  await I.cwCheckStateAndEvent('Application issued','Issue Application');

  console.log('~~~~~~~~~~~~~  Application Issued ~~~~~~~~~~~~ ');

}).retry(testConfig.TestRetryScenarios);
