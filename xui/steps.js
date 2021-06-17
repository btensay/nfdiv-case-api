
const CaseListPage = require('./page/CaseListPage');
const CaseDetailsPage = require('./page/CaseDetailsPage');
const CreateCasePage = require('./page/CreateCasePage');
const AboutSolicitorPage = require('./page/AboutSolicitorPage');
const AboutThePetitionerPage = require('./page/AboutThePetitionerPage');
const AboutTheRespondentPage = require('./page/AboutTheRespondentPage');
const RespSolicitorRepresented = require('./page/RespSolicitorRepresented');
const JurisdictionPage = require('./page/JurisdictionPage');
const ReasonForTheDivorcePage = require('./page/ReasonForTheDivorcePage');
const StatementOfCaseAdulteryPage = require('./page/StatementOfCaseAdulteryPage');
const StatementOfCaseBehaviourPage = require('./page/StatementOfCaseBehaviourPage');
const StatementOfCaseDesertionPage = require('./page/StatementOfCaseDesertionPage');
const StatementOfCaseSeparationDetail = require('./page/StatementOfCaseSeparationDetail');
const LivedApartPage = require('./page/LivedApartPage');
const StatementOfCaseAdulterySecPage = require('./page/StatementOfCaseAdulterySecPage');
const OtherLegalProceedingsPage = require('./page/OtherLegalProceedingsPage');
const FinancialOrdersPage = require('./page/FinancialOrdersPage');
const ClaimForCostsPage = require('./page/ClaimForCostsPage');
const UploadMarriageCertificatePage = require('./page/UploadMarriageCertificatePage');
const SolCreateLanguagePrefPage = require('./page/SolCreateLanguagePrefPage');
const SolCreateCheckYourAnswersPage = require('./page/SolCreateCheckYourAnswersPage');
const SolCaseCreatedPage = require('./page/SolCaseCreatedPage');
const StatementOfTruthAndRecPage = require('./page/StatementOfTruthAndRecPage');
const FeeAccountPaymentCaseSubmissionPage = require('./page/FeeAccountPaymentCaseSubmissionPage');
const HWFPaymentCaseSubmissionPage = require('./page/HWFPaymentCaseSubmissionPage');
const HWFReferencePage=require('./page/HWFReferencePage');
const CaseSubmissionOrderSummaryPage = require('./page/CaseSubmissionOrderSummaryPage');
const CaseSubmissionAppCompletePage = require('./page/CaseSubmissionAppCompletePage');
const CaseSubmissionCheckYourAnswersPage = require('./page/CaseSubmissionCheckYourAnswersPage');
const SolAwaitingPaymentConfirmationPage = require('./page/SolAwaitingPaymentConfirmationPage');
const CcdCaseCreatedLandingPage = require('./page/CcdCaseCreatedLandingPage');
const AwaitingPetitionerPage = require('./page/AwaitingPetitionerPage');
const IssuePage = require('./page/IssuePage');
const IssueCheckYourAnswersPage = require('./page/IssueCheckYourAnswersPage');
const CcdCaseCreatedPetitionIssuedLandingPage = require('./page/CcdCaseCreatedPetitionIssuedLandingPage');
// const AosPackIssueTestPage = require('./page/AosPackIssueTestPage');
const IssueAosPackToRespondentCheckYourAnswersPage = require('./page/IssueAosPackToRespondentCheckYourAnswersPage');
const IssueAosPackToRespondentLandingPage = require('./page/IssueAosPackToRespondentLandingPage');
const AosStartedPage = require('./page/AosStartedPage');
const AosStartedCheckYourAnswersPage = require('./page/AosStartedCheckYourAnswersPage');
const AosReceivedUndefendedMoveToDN = require('./page/AosReceivedUndefendedMoveToDN');
const SetTestDataForDA = require('./page/SetTestDataForDA');
const SelectEventAndSubmit = require('./page/SelectEventAndSubmit');
const SelectEvent = require('./page/SelectEvent');
const MarriageCertificateDetailsPage = require('./page/MarriageCertificateDetailsPage');
const TransferCaseToADifferentRDCsPage = require('./page/TransferCaseToADifferentRDCsPage');
const TransferBetweenRDCsPage = require('./page/TransferBetweenRDCsPage');
const TransferToRDCLandingPage = require('./page/TransferToRDCLandingPage');
const ServiceApplicationReceivedPage = require('./page/ServiceApplicationReceivedPage');
const ConfirmServicePaymentPage = require('./page/ConfirmServicePaymentPage');
const IssueBailiffPackPage = require('./page/IssueBailiffPackPage');
const MarriageBrokenDownPage = require('./page/MarriageBrokenDownIrretrievablyPage');
const CaseworkerCheckStatAndEventPage = require('./page/CaseworkerCheckStateAndEventDetailsPage');
const DivorceApplicationDetailsPage = require('./page/DivorceApplicationDetailsPage');

const validatePetitionTabData = require ('./tab/validatePetitionTabData');
const validateConfidentialPetitionerTab = require ('./tab/validateConfidentialPetitionerTab');
const validateAOSTabData = require ('./tab/validateAOSTabData');
const validateCoRespTabData = require ('./tab/validateCoRespTabData');
const validateDecreeNisiTabData = require ('./tab/validateDecreeNisiTabData');
const validateOutcomeOfDNTabData = require ('./tab/validateOutcomeOfDNTabData');
const validateDecreeAbsoluteTabData = require ('./tab/validateDecreeAbsoluteTabData');
const validateMarriageCertTabData = require ('./tab/validateMarriageCertTabData');
const validateDocumentTabData = require ('./tab/validateDocumentTabData');
const validatePaymentTabData = require ('./tab/validatePaymentTabData');
const validateLanguageTabData = require ('./tab/validateLanguageTabData');
const validateLinkedCaseTabData = require ('./tab/validateLinkedCaseTabData');
const {LoginPage} = require("./page/LoginPage");

module.exports = function () {
  return actor({

    // Define custom steps here, use 'this' to access default methods of I.
    // It is recommended to place a general 'login' function here.
    amOnHomePage: function () {
      return this.amOnPage('');
    },

    login: function (email, password) {
      return LoginPage.submitLogin(email, password);
    },

    selectACaseFromList: function () {
      return CaseListPage.selectCase();
    },

    shouldBeOnCaseDetailsPage: function () {
      return CaseDetailsPage.shouldDisplayTabs();
    },

    shouldBeOnCaseListPage: function (caseNumber) {
      return CaseListPage.resetFilter(caseNumber);
    },

    selectHWFReferenceValidation: function (){
      return CaseListPage.checkEventAndStateAndBeginHWFValidation();
    },

    ShouldBeAbleToFilterAnUrgentCase: function (urgent, state, caseNum) {
      return CaseListPage.urgentCaseFilter(urgent, state, caseNum);
    },

    clickCreateCase: function() {
      return CreateCasePage.clickCreateCase();
    },

    clickCreateList: function() {
      return CaseListPage.clickCreateList();
    },

    fillCreateCaseFormAndSubmit() {
      return CreateCasePage.fillFormAndSubmit();
    },

    // kasi
    // Issue Divorce Application
    issueDivorceApplication(){
      return DivorceApplicationDetailsPage.fillFormAndSubmit();
    },

    fillIssueApplicationEventDetails(){
      return DivorceApplicationDetailsPage.fillEventSummaryAndDescription();
    },


    // How do you want to apply for Divorce Sole/Joint
    fillSoleOrJointOptionForDivorce(){
      return CreateCasePage.fillHowDoYouWantToApplyForDivorce();
    },

    fillAboutSolicitorFormAndSubmit() {
      return AboutSolicitorPage.fillFormAndSubmit();
    },

    fillAboutThePetitionerFormAndSubmit() {
      return AboutThePetitionerPage.fillFormAndSubmit();
    },

    fillAboutTheRespondentFormAndSubmit() {
      return AboutTheRespondentPage.fillFormAndSubmit();
    },

    fillAboutRespSolicitorFormAndSubmit() {
      return RespSolicitorRepresented.fillFormAndSubmit();
    },

    fillAboutRepresentedRespSolicitorFormAndSubmit() {
      return RespSolicitorRepresented.fillFormForRepresentedRespondentAndSubmit();
    },

    completeMarriageCertificateDetailsPageAndSubmit: function () {
      return MarriageCertificateDetailsPage.fillFormAndSubmit();
    },

    selectJurisdictionQuestionPageAndSubmit: function () {
      return JurisdictionPage.selectLegalActionsAndSubmit();
    },

    marriageBrokenDown: function () {
      return MarriageBrokenDownPage.hasMarriageBrokenDown();
    },


    selectReasonForTheDivorceQuestionPageAndSubmit: function (reason) {
      return ReasonForTheDivorcePage.fillFormAndSubmit(reason);
    },

    fillAdulteryDetailsFormAndSubmit() {
      return StatementOfCaseAdulteryPage.fillFormAndSubmit();
    },

    fillAdulteryDetailsSecondPageFormAndSubmit() {
      return StatementOfCaseAdulterySecPage.fillFormAndSubmit();
    },

    fillBehaviourDetailsFormAndSubmit() {
      return StatementOfCaseBehaviourPage.fillFormAndSubmit();
    },

    fillDesertionDetailsFormAndSubmit() {
      return StatementOfCaseDesertionPage.fillFormAndSubmit();
    },

    fillSeparationDetailsFormAndSubmit() {
      return StatementOfCaseSeparationDetail.fillFormAndSubmit();
    },

    fillLiveApartFormAndSubmit(reason) {
      return LivedApartPage.fillFormAndSubmit(reason);
    },

    otherLegalProceedings: function() {
      return OtherLegalProceedingsPage.fillFormAndSubmit();
    },

    financialOrdersSelectButton: function() {
      return FinancialOrdersPage.fillFormAndSubmit();
    },

    claimForCostsSelectButton: function() {
      return ClaimForCostsPage.fillFormAndSubmit();
    },

    uploadTheMarriageCertificateOptional: function() {
      return UploadMarriageCertificatePage.fillFormAndSubmit();
    },

    languagePreferenceSelection: function() {
      return SolCreateLanguagePrefPage.fillFormAndSubmit();
    },

    solicitorCreateCheckYourAnswerAndSubmit: function() {
      return SolCreateCheckYourAnswersPage.fillFormAndSubmit();
    },

    solicitorCaseCreatedAndSubmit: function() {
      return SolCaseCreatedPage.fillFormAndSubmit();
    },

    statementOfTruthAndReconciliationPageFormAndSubmit: function (urgent) {
      return StatementOfTruthAndRecPage.fillFormAndSubmit(urgent);
    },

    paymentWithHelpWithFeeAccount: function() {
      return FeeAccountPaymentCaseSubmissionPage.fillFormAndSubmit();
    },

    casePaymentWithHWFAndSubmissionPageFormAndSubmit: function() {
      return HWFPaymentCaseSubmissionPage.fillFormAndSubmit();
    },

    validateHWFCode:function(){
      return HWFReferencePage.fillFormAndSubmit();
    },

    fillHwfEventSummaryFor:function(caseNumber){
      return HWFReferencePage.fillEventSummaryAndDescription(caseNumber);
    },

    caseOrderSummaryPageFormAndSubmit: function(paymentType) {
      return CaseSubmissionOrderSummaryPage.fillFormAndSubmit(paymentType);
    },

    caseApplicationCompletePageFormAndSubmit: function() {
      return CaseSubmissionAppCompletePage.fillFormAndSubmit();
    },

    caseCheckYourAnswersPageFormAndSubmit: function() {
      return CaseSubmissionCheckYourAnswersPage.fillFormAndSubmit();
    },

    solAwaitingPaymentConfPageFormAndSubmit: function() {
      return SolAwaitingPaymentConfirmationPage.checkPageAndSignOut();
    },

    // TODO refactor to generic name checkStateAndEvent
    cwCheckStateAndEvent: function(state, event){
      return CaseworkerCheckStatAndEventPage.checkEventAndStateOnPageAndSignOut(state,event);
    },

    ccdCaseCreatedFromJsonLandingPageFormAndSubmit: function() {
      return CcdCaseCreatedLandingPage.fillFormAndSubmit();
    },

    awaitingPetitionerFormAndSubmit: function () {
      return AwaitingPetitionerPage.fillFormAndSubmit();
    },

    issueFromSubmittedPageFormAndSubmit: function() {
      return IssuePage.fillFormAndSubmit();
    },

    issueCheckYourAnswersPageFormAndSubmit: function() {
      return IssueCheckYourAnswersPage.fillFormAndSubmit();
    },

    petitionIssuedPageAndAosPackSelectPageFormAndSubmit: function() {
      return CcdCaseCreatedPetitionIssuedLandingPage.fillFormAndSubmit();
    },

    // aosPackIssueTestPageFormAndSubmit: function() {
    //   AosPackIssueTestPage.fillFormAndSubmit();
    // },

    aosPackIssueTestCheckYourAnswersPageFormAndSubmit: function() {
      return IssueAosPackToRespondentCheckYourAnswersPage.fillFormAndSubmit();
    },

    aosPackToRespondentLandingPageFormAndSubmit: function() {
      return IssueAosPackToRespondentLandingPage.fillFormAndSubmit();
    },

    aosReceivedUndefendedMoveToDNFormSubmit: function() {
      return AosReceivedUndefendedMoveToDN.fillFormAndSubmit();
    },

    setTestDataForDA: function() {
      return SetTestDataForDA.fillFormAndSubmit();
    },

    selectAndSubmitEvent: function(eventName) {
      return SelectEventAndSubmit.fillFormAndSubmit(eventName);
    },

    selectEvent: function(eventName) {
      return SelectEvent.fillFormAndSubmit(eventName);
    },

    aosStartedPageFormAndSubmit: function() {
      return AosStartedPage.fillFormAndSubmit();
    },

    aosStartedCheckYourAnswersPageFormAndSubmit: function() {
      return AosStartedCheckYourAnswersPage.fillFormAndSubmit();
    },

    changeToCourtsAndTribunalsServiceCentrePageFormAndSubmit: function() {
      return TransferCaseToADifferentRDCsPage.fillFormAndSubmit();
    },

    enterRDCChangeSummaryAndDescriptionPageFormAndSubmit: function() {
      return TransferBetweenRDCsPage.fillFormAndSubmit();
    },

    caseCreatedCTSCServiceCentrePageFormAndSubmit: function() {
      return TransferToRDCLandingPage.fillFormAndSubmit();
    },

    serviceApplicationReceivedPageFormAndSubmit: function(serviceApplicationType) {
      return ServiceApplicationReceivedPage.fillFormAndSubmit(serviceApplicationType);
    },

    confirmServicePaymentPageFormAndSubmit: function () {
      return ConfirmServicePaymentPage.fillFormAndSubmit();
    },

    issueBailiffPackPageFormAndSubmit: function() {
      return IssueBailiffPackPage.fillFormAndSubmit();
    },

    validatePetitionTabData: function(reason,verifyContent) {
      return validatePetitionTabData(reason,verifyContent);
    },

    validateCoRespTabData: function(verifyContent) {
      return validateCoRespTabData(verifyContent);
    },

    validateDocumentTabData: function(reason, caseId) {
      return validateDocumentTabData(reason, caseId);
    },

    validateMarriageCertTabData: function(verifyContent) {
      return validateMarriageCertTabData(verifyContent);
    },

    validateAOSTabData: function(reason,verifyContent){
      return validateAOSTabData(reason,verifyContent);
    },

    validateDecreeNisiTabData: function(reason,verifyContent) {
      return validateDecreeNisiTabData(reason,verifyContent);
    },

    validateConfidentialPetitionerTab: function(verifyContent) {
      return validateConfidentialPetitionerTab(verifyContent);
    },

    validateOutcomeOfDNTabData: function(verifyContent) {
      return validateOutcomeOfDNTabData(verifyContent);
    },

    validateDecreeAbsoluteTabData: function(verifyContent) {
      return validateDecreeAbsoluteTabData(verifyContent);
    },

    validatePaymentTabData: function(verifyContent) {
      return validatePaymentTabData(verifyContent);
    },

    validateLanguageTabData: function(reason, verifyContent) {
      return validateLanguageTabData(reason, verifyContent);
    },

    validateLinkedCaseTabData: function(verifyContent) {
      return validateLinkedCaseTabData(verifyContent);
    }
  });
};
