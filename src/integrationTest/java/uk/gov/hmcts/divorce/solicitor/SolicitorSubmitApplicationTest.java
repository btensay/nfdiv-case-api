package uk.gov.hmcts.divorce.solicitor;

import com.fasterxml.jackson.databind.ObjectMapper;
import feign.FeignException;
import org.apache.commons.io.FilenameUtils;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import uk.gov.hmcts.divorce.common.config.WebMvcConfig;
import uk.gov.hmcts.divorce.common.model.CaseData;
import uk.gov.hmcts.divorce.notification.NotificationService;
import uk.gov.hmcts.divorce.testutil.CaseDataWireMock;
import uk.gov.hmcts.divorce.testutil.DocManagementStoreWireMock;
import uk.gov.hmcts.divorce.testutil.FeesWireMock;
import uk.gov.hmcts.divorce.testutil.IdamWireMock;
import uk.gov.hmcts.divorce.testutil.TestConstants;
import uk.gov.hmcts.reform.authorisation.generators.AuthTokenGenerator;

import java.io.IOException;

import static java.util.Collections.singletonList;
import static java.util.Objects.requireNonNull;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static uk.gov.hmcts.divorce.common.model.LanguagePreference.ENGLISH;
import static uk.gov.hmcts.divorce.common.model.State.Draft;
import static uk.gov.hmcts.divorce.document.model.DocumentType.DIVORCE_APPLICATION;
import static uk.gov.hmcts.divorce.notification.EmailTemplateName.SOL_APPLICANT_SOLICITOR_APPLICATION_SUBMITTED;
import static uk.gov.hmcts.divorce.solicitor.event.SolicitorSubmitApplication.SOLICITOR_SUBMIT;
import static uk.gov.hmcts.divorce.testutil.CaseDataWireMock.stubForCcdCaseRoles;
import static uk.gov.hmcts.divorce.testutil.CaseDataWireMock.stubForCcdCaseRolesUpdateFailure;
import static uk.gov.hmcts.divorce.testutil.DocManagementStoreWireMock.stubForDocumentManagement;
import static uk.gov.hmcts.divorce.testutil.FeesWireMock.stubForFeesLookup;
import static uk.gov.hmcts.divorce.testutil.FeesWireMock.stubForFeesNotFound;
import static uk.gov.hmcts.divorce.testutil.IdamWireMock.CASEWORKER_ROLE;
import static uk.gov.hmcts.divorce.testutil.IdamWireMock.SOLICITOR_ROLE;
import static uk.gov.hmcts.divorce.testutil.IdamWireMock.stubForIdamDetails;
import static uk.gov.hmcts.divorce.testutil.IdamWireMock.stubForIdamFailure;
import static uk.gov.hmcts.divorce.testutil.IdamWireMock.stubForIdamToken;
import static uk.gov.hmcts.divorce.testutil.TestConstants.ABOUT_TO_START_URL;
import static uk.gov.hmcts.divorce.testutil.TestConstants.ABOUT_TO_SUBMIT_URL;
import static uk.gov.hmcts.divorce.testutil.TestConstants.AUTHORIZATION;
import static uk.gov.hmcts.divorce.testutil.TestConstants.AUTH_HEADER_VALUE;
import static uk.gov.hmcts.divorce.testutil.TestConstants.CASEWORKER_AUTH_TOKEN;
import static uk.gov.hmcts.divorce.testutil.TestConstants.CASEWORKER_USER_ID;
import static uk.gov.hmcts.divorce.testutil.TestConstants.SERVICE_AUTHORIZATION;
import static uk.gov.hmcts.divorce.testutil.TestConstants.SOLICITOR_USER_ID;
import static uk.gov.hmcts.divorce.testutil.TestConstants.TEST_AUTHORIZATION_TOKEN;
import static uk.gov.hmcts.divorce.testutil.TestConstants.TEST_SERVICE_AUTH_TOKEN;
import static uk.gov.hmcts.divorce.testutil.TestConstants.TEST_SOLICITOR_EMAIL;
import static uk.gov.hmcts.divorce.testutil.TestDataHelper.callbackRequest;
import static uk.gov.hmcts.divorce.testutil.TestDataHelper.caseDataWithOrderSummary;
import static uk.gov.hmcts.divorce.testutil.TestDataHelper.caseDataWithStatementOfTruth;
import static uk.gov.hmcts.divorce.testutil.TestDataHelper.documentWithType;
import static uk.gov.hmcts.divorce.testutil.TestDataHelper.getFeeResponseAsJson;
import static uk.gov.hmcts.divorce.testutil.TestResourceUtil.expectedResponse;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ContextConfiguration(initializers = {
    FeesWireMock.PropertiesInitializer.class,
    IdamWireMock.PropertiesInitializer.class,
    DocManagementStoreWireMock.PropertiesInitializer.class,
    CaseDataWireMock.PropertiesInitializer.class})
public class SolicitorSubmitApplicationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private WebMvcConfig webMvcConfig;

    @MockBean
    private AuthTokenGenerator serviceTokenGenerator;

    @MockBean
    private NotificationService notificationService;

    @BeforeAll
    static void setUp() {
        IdamWireMock.start();
        CaseDataWireMock.start();
        FeesWireMock.start();
        DocManagementStoreWireMock.start();
    }

    @AfterAll
    static void tearDown() {
        IdamWireMock.stopAndReset();
        CaseDataWireMock.stopAndReset();
        FeesWireMock.stopAndReset();
        DocManagementStoreWireMock.stopAndReset();
    }

    @Test
    public void givenValidCaseDataWhenCallbackIsInvokedThenOrderSummaryAndSolicitorRolesAreSet()
        throws Exception {

        stubForFeesLookup(getFeeResponseAsJson());
        stubForIdamDetails(TEST_AUTHORIZATION_TOKEN, SOLICITOR_USER_ID, SOLICITOR_ROLE);
        stubForIdamDetails(CASEWORKER_AUTH_TOKEN, CASEWORKER_USER_ID, CASEWORKER_ROLE);
        stubForIdamToken(CASEWORKER_AUTH_TOKEN);

        when(serviceTokenGenerator.generate()).thenReturn(SERVICE_AUTHORIZATION);

        stubForCcdCaseRoles();

        mockMvc.perform(MockMvcRequestBuilders.post(ABOUT_TO_START_URL)
            .contentType(APPLICATION_JSON)
            .header(SERVICE_AUTHORIZATION, AUTH_HEADER_VALUE)
            .header(AUTHORIZATION, TEST_AUTHORIZATION_TOKEN)
            .content(objectMapper.writeValueAsString(callbackRequest(caseDataWithOrderSummary(), SOLICITOR_SUBMIT)))
            .accept(APPLICATION_JSON))
            .andExpect(
                status().isOk()
            )
            .andExpect(
                content().json(expectedCcdCallbackResponse())
            );

        verify(serviceTokenGenerator).generate();
        verifyNoMoreInteractions(serviceTokenGenerator);
    }

    @Test
    public void givenFeeEventIsNotAvailableWhenCallbackIsInvokedThenReturn404FeeEventNotFound()
        throws Exception {
        stubForFeesNotFound();

        mockMvc.perform(MockMvcRequestBuilders.post(ABOUT_TO_START_URL)
            .contentType(APPLICATION_JSON)
            .header(SERVICE_AUTHORIZATION, AUTH_HEADER_VALUE)
            .header(AUTHORIZATION, TEST_AUTHORIZATION_TOKEN)
            .content(objectMapper.writeValueAsString(callbackRequest(caseDataWithOrderSummary(), SOLICITOR_SUBMIT)))
            .accept(APPLICATION_JSON))
            .andExpect(
                status().isNotFound()
            )
            .andExpect(
                result -> assertThat(result.getResolvedException()).isExactlyInstanceOf(FeignException.NotFound.class)
            )
            .andExpect(
                result -> assertThat(requireNonNull(result.getResolvedException()).getMessage())
                    .contains("404 Fee event not found")
            );
    }

    @Test
    public void givenValidCaseDataWhenCallbackIsInvokedAndIdamUserRetrievalThrowsUnauthorizedThen401IsReturned()
        throws Exception {

        stubForFeesLookup(getFeeResponseAsJson());
        stubForIdamFailure();

        mockMvc.perform(MockMvcRequestBuilders.post(ABOUT_TO_START_URL)
            .contentType(APPLICATION_JSON)
            .header(SERVICE_AUTHORIZATION, AUTH_HEADER_VALUE)
            .header(AUTHORIZATION, TEST_AUTHORIZATION_TOKEN)
            .content(objectMapper.writeValueAsString(callbackRequest(caseDataWithOrderSummary(), SOLICITOR_SUBMIT)))
            .accept(APPLICATION_JSON))
            .andExpect(
                status().isUnauthorized()
            )
            .andExpect(
                result -> assertThat(result.getResolvedException()).isExactlyInstanceOf(FeignException.Unauthorized.class)
            )
            .andExpect(
                result -> assertThat(requireNonNull(result.getResolvedException()).getMessage())
                    .contains("Invalid idam credentials")
            );
    }

    @Test
    public void givenValidCaseDataWhenCallbackIsInvokedAndCcdCaseRolesUpdateThrowsForbiddenExceptionThen403IsReturned()
        throws Exception {

        stubForFeesLookup(getFeeResponseAsJson());
        stubForIdamDetails(TEST_AUTHORIZATION_TOKEN, SOLICITOR_USER_ID, SOLICITOR_ROLE);
        stubForIdamDetails(CASEWORKER_AUTH_TOKEN, CASEWORKER_USER_ID, CASEWORKER_ROLE);
        stubForIdamToken(CASEWORKER_AUTH_TOKEN);

        when(serviceTokenGenerator.generate()).thenReturn(SERVICE_AUTHORIZATION);

        stubForCcdCaseRolesUpdateFailure();

        mockMvc.perform(MockMvcRequestBuilders.post(ABOUT_TO_START_URL)
            .contentType(APPLICATION_JSON)
            .header(SERVICE_AUTHORIZATION, AUTH_HEADER_VALUE)
            .header(AUTHORIZATION, TEST_AUTHORIZATION_TOKEN)
            .content(objectMapper.writeValueAsString(callbackRequest(caseDataWithOrderSummary(), SOLICITOR_SUBMIT)))
            .accept(APPLICATION_JSON))
            .andExpect(
                status().isForbidden()
            )
            .andExpect(
                result -> assertThat(result.getResolvedException()).isExactlyInstanceOf(FeignException.Forbidden.class)
            );
    }

    @Test
    void givenValidCaseDataWhenAboutToSubmitCallbackIsInvokedThenStateIsChangedAndEmailIsSentToApplicant()
        throws Exception {

        mockMvc.perform(MockMvcRequestBuilders.post(ABOUT_TO_SUBMIT_URL)
            .contentType(APPLICATION_JSON)
            .header(SERVICE_AUTHORIZATION, AUTH_HEADER_VALUE)
            .header(AUTHORIZATION, TEST_AUTHORIZATION_TOKEN)
            .content(objectMapper.writeValueAsString(callbackRequest(
                caseDataWithStatementOfTruth(),
                SOLICITOR_SUBMIT,
                Draft.name())))
            .accept(APPLICATION_JSON))
            .andExpect(
                status().isOk()
            )
            .andExpect(
                content().json(expectedCcdAboutToSubmitCallbackResponse())
            );

        verify(notificationService)
            .sendEmail(
                eq(TEST_SOLICITOR_EMAIL),
                eq(SOL_APPLICANT_SOLICITOR_APPLICATION_SUBMITTED),
                anyMap(),
                eq(ENGLISH));

        verifyNoMoreInteractions(notificationService);
    }

    @Test
    void givenValidCaseDataAndValidPaymentWhenAboutToSubmitCallbackIsInvokedThenStateIsChangedAndEmailIsSentToApplicant()
        throws Exception {

        mockMvc.perform(MockMvcRequestBuilders.post(ABOUT_TO_SUBMIT_URL)
            .contentType(APPLICATION_JSON)
            .header(SERVICE_AUTHORIZATION, AUTH_HEADER_VALUE)
            .header(TestConstants.AUTHORIZATION, TEST_AUTHORIZATION_TOKEN)
            .content(objectMapper.writeValueAsString(callbackRequest(
                caseDataWithStatementOfTruth(),
                SOLICITOR_SUBMIT,
                Draft.name())))
            .accept(APPLICATION_JSON))
            .andExpect(
                status().isOk()
            )
            .andExpect(
                content().json(expectedCcdAboutToSubmitCallbackResponse())
            );

        verify(notificationService)
            .sendEmail(
                eq(TEST_SOLICITOR_EMAIL),
                eq(SOL_APPLICANT_SOLICITOR_APPLICATION_SUBMITTED),
                anyMap(),
                eq(ENGLISH));

        verifyNoMoreInteractions(notificationService);
    }

    @Test
    void givenValidCaseDataContainingDraftApplicationDocumentWhenAboutToSubmitCallbackIsInvokedThenDraftApplicationDocumentIsRemoved()
        throws Exception {

        final var caseData = caseDataWithStatementOfTruth();
        final var documentUuid = setupAuthorizationAndApplicationDocument(caseData);
        stubForDocumentManagement(documentUuid, OK);

        mockMvc.perform(MockMvcRequestBuilders.post(ABOUT_TO_SUBMIT_URL)
            .contentType(APPLICATION_JSON)
            .header(SERVICE_AUTHORIZATION, TEST_SERVICE_AUTH_TOKEN)
            .header(AUTHORIZATION, TEST_AUTHORIZATION_TOKEN)
            .content(objectMapper.writeValueAsString(callbackRequest(
                caseData,
                SOLICITOR_SUBMIT,
                Draft.name())))
            .accept(APPLICATION_JSON))
            .andExpect(
                status().isOk()
            )
            .andExpect(
                content().json(expectedCcdAboutToSubmitCallbackResponse())
            );

        verify(notificationService)
            .sendEmail(eq(TEST_SOLICITOR_EMAIL), eq(SOL_APPLICANT_SOLICITOR_APPLICATION_SUBMITTED), anyMap(), eq(ENGLISH));

        verify(serviceTokenGenerator).generate();

        verifyNoMoreInteractions(notificationService, serviceTokenGenerator);
    }

    @Test
    void givenCaseDataWithApplicationDocumentAndServiceNotWhitelistedInDocStoreWhenAboutToSubmitCallbackIsInvokedThen403IsReturned()
        throws Exception {

        final var caseData = caseDataWithStatementOfTruth();
        final var documentUuid = setupAuthorizationAndApplicationDocument(caseData);
        stubForDocumentManagement(documentUuid, FORBIDDEN);

        mockMvc.perform(MockMvcRequestBuilders.post(ABOUT_TO_SUBMIT_URL)
            .contentType(APPLICATION_JSON)
            .header(SERVICE_AUTHORIZATION, AUTH_HEADER_VALUE)
            .header(AUTHORIZATION, TEST_AUTHORIZATION_TOKEN)
            .content(objectMapper.writeValueAsString(callbackRequest(
                caseData,
                SOLICITOR_SUBMIT,
                Draft.name())))
            .accept(APPLICATION_JSON))
            .andExpect(
                status().isForbidden()
            );

        verify(serviceTokenGenerator).generate();
        verifyNoMoreInteractions(serviceTokenGenerator);
    }

    @Test
    void givenCaseDataWithApplicationDocumentAndServiceAuthValidationFailsInDocStoreWhenAboutToSubmitCallbackIsInvokedThen401IsReturned()
        throws Exception {

        final var caseData = caseDataWithStatementOfTruth();
        final var documentUuid = setupAuthorizationAndApplicationDocument(caseData);
        stubForDocumentManagement(documentUuid, UNAUTHORIZED);

        mockMvc.perform(MockMvcRequestBuilders.post(ABOUT_TO_SUBMIT_URL)
            .contentType(APPLICATION_JSON)
            .header(SERVICE_AUTHORIZATION, AUTH_HEADER_VALUE)
            .header(AUTHORIZATION, TEST_AUTHORIZATION_TOKEN)
            .content(objectMapper.writeValueAsString(callbackRequest(
                caseData,
                SOLICITOR_SUBMIT,
                Draft.name())))
            .accept(APPLICATION_JSON))
            .andExpect(
                status().isUnauthorized()
            );

        verify(serviceTokenGenerator).generate();

        verifyNoMoreInteractions(serviceTokenGenerator);
    }

    @Test
    void givenInValidCaseDataWhenAboutToSubmitCallbackIsInvokedThenStateIsNotChangedAndErrorIsReturned()
        throws Exception {

        mockMvc.perform(MockMvcRequestBuilders.post(ABOUT_TO_SUBMIT_URL)
            .contentType(APPLICATION_JSON)
            .header(SERVICE_AUTHORIZATION, AUTH_HEADER_VALUE)
            .header(AUTHORIZATION, TEST_AUTHORIZATION_TOKEN)
            .content(objectMapper.writeValueAsString(callbackRequest(
                caseDataWithOrderSummary(),
                SOLICITOR_SUBMIT,
                Draft.name())))
            .accept(APPLICATION_JSON))
            .andExpect(
                status().isOk()
            )
            .andExpect(
                content().json(expectedCcdAboutToSubmitCallbackErrorResponse())
            );

        verifyNoInteractions(notificationService);
    }

    private String setupAuthorizationAndApplicationDocument(CaseData caseData) {
        final var documentListValue = documentWithType(DIVORCE_APPLICATION);
        final var generatedDocuments = singletonList(documentListValue);

        caseData.setDocumentsGenerated(generatedDocuments);
        stubForIdamDetails(TEST_AUTHORIZATION_TOKEN, SOLICITOR_USER_ID, SOLICITOR_ROLE);
        when(serviceTokenGenerator.generate()).thenReturn(TEST_SERVICE_AUTH_TOKEN);

        return FilenameUtils.getName(documentListValue.getValue().getDocumentLink().getUrl());
    }

    private String expectedCcdCallbackResponse() throws IOException {
        return expectedResponse("classpath:wiremock/responses/issue-fees-response.json");
    }

    private String expectedCcdAboutToSubmitCallbackResponse() throws IOException {
        return expectedResponse("classpath:wiremock/responses/about-to-submit-statement-of-truth.json");
    }

    private String expectedCcdAboutToSubmitCallbackErrorResponse() throws IOException {
        return expectedResponse("classpath:wiremock/responses/about-to-submit-statement-of-truth-error.json");
    }
}
