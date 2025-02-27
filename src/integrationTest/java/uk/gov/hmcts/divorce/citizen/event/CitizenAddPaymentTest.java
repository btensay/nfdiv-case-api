package uk.gov.hmcts.divorce.citizen.event;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import uk.gov.hmcts.ccd.sdk.type.ListValue;
import uk.gov.hmcts.ccd.sdk.type.OrderSummary;
import uk.gov.hmcts.ccd.sdk.type.YesOrNo;
import uk.gov.hmcts.divorce.citizen.notification.ApplicationOutstandingActionNotification;
import uk.gov.hmcts.divorce.citizen.notification.ApplicationSubmittedNotification;
import uk.gov.hmcts.divorce.common.config.WebMvcConfig;
import uk.gov.hmcts.divorce.common.config.interceptors.RequestInterceptor;
import uk.gov.hmcts.divorce.common.model.CaseData;
import uk.gov.hmcts.divorce.common.model.Gender;
import uk.gov.hmcts.divorce.notification.NotificationService;
import uk.gov.hmcts.divorce.notification.exception.NotificationException;
import uk.gov.hmcts.divorce.payment.model.Payment;
import uk.gov.service.notify.NotificationClientException;

import java.time.LocalDateTime;

import static java.util.Collections.singletonList;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static uk.gov.hmcts.divorce.citizen.event.CitizenAddPayment.CITIZEN_ADD_PAYMENT;
import static uk.gov.hmcts.divorce.common.model.LanguagePreference.ENGLISH;
import static uk.gov.hmcts.divorce.notification.EmailTemplateName.APPLICATION_SUBMITTED;
import static uk.gov.hmcts.divorce.notification.EmailTemplateName.OUTSTANDING_ACTIONS;
import static uk.gov.hmcts.divorce.payment.model.PaymentStatus.CANCELLED;
import static uk.gov.hmcts.divorce.payment.model.PaymentStatus.DECLINED;
import static uk.gov.hmcts.divorce.payment.model.PaymentStatus.IN_PROGRESS;
import static uk.gov.hmcts.divorce.payment.model.PaymentStatus.SUCCESS;
import static uk.gov.hmcts.divorce.testutil.TestConstants.ABOUT_TO_SUBMIT_URL;
import static uk.gov.hmcts.divorce.testutil.TestConstants.AUTH_HEADER_VALUE;
import static uk.gov.hmcts.divorce.testutil.TestConstants.SERVICE_AUTHORIZATION;
import static uk.gov.hmcts.divorce.testutil.TestConstants.TEST_USER_EMAIL;
import static uk.gov.hmcts.divorce.testutil.TestDataHelper.callbackRequest;
import static uk.gov.hmcts.divorce.testutil.TestDataHelper.caseDataWithOrderSummary;
import static uk.gov.hmcts.divorce.testutil.TestDataHelper.getApplicant2;


@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
public class CitizenAddPaymentTest {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    @SuppressWarnings("PMD.UnusedPrivateField")
    private ApplicationSubmittedNotification notification;

    @Autowired
    @SuppressWarnings("PMD.UnusedPrivateField")
    private ApplicationOutstandingActionNotification outstandingActionNotification;

    @MockBean
    private NotificationService notificationService;

    @MockBean
    private RequestInterceptor requestInterceptor;

    @MockBean
    private WebMvcConfig webMvcConfig;

    @BeforeAll
    static void setUp() {
        OBJECT_MAPPER.registerModule(new JavaTimeModule());
    }

    @Test
    public void givenLastAddedPaymentIsInProgress() throws Exception {
        CaseData data = caseDataWithOrderSummary();
        data.setDateSubmitted(LocalDateTime.now());
        data.setSolSignStatementOfTruth(YesOrNo.YES);

        OrderSummary orderSummary = OrderSummary.builder().paymentTotal("55000").build();
        data.setApplicationFeeOrderSummary(orderSummary);

        Payment payment = Payment.builder()
            .paymentAmount(55000)
            .paymentStatus(IN_PROGRESS)
            .build();

        data.setPayments(singletonList(new ListValue<>("1", payment)));

        mockMvc.perform(post(ABOUT_TO_SUBMIT_URL)
            .contentType(APPLICATION_JSON)
            .header(SERVICE_AUTHORIZATION, AUTH_HEADER_VALUE)
            .content(OBJECT_MAPPER.writeValueAsString(callbackRequest(data, CITIZEN_ADD_PAYMENT)))
            .accept(APPLICATION_JSON))
            .andExpect(status().isOk());

        verifyNoInteractions(notificationService);
    }

    @Test
    public void givenLastAddedPaymentWasCanceled() throws Exception {
        CaseData data = caseDataWithOrderSummary();
        data.setDateSubmitted(LocalDateTime.now());
        data.setSolSignStatementOfTruth(YesOrNo.YES);

        OrderSummary orderSummary = OrderSummary.builder().paymentTotal("55000").build();
        data.setApplicationFeeOrderSummary(orderSummary);

        Payment payment = Payment.builder()
            .paymentAmount(55000)
            .paymentStatus(CANCELLED)
            .build();

        data.setPayments(singletonList(new ListValue<>("1", payment)));

        mockMvc.perform(post(ABOUT_TO_SUBMIT_URL)
            .contentType(APPLICATION_JSON)
            .header(SERVICE_AUTHORIZATION, AUTH_HEADER_VALUE)
            .content(OBJECT_MAPPER.writeValueAsString(callbackRequest(data, CITIZEN_ADD_PAYMENT)))
            .accept(APPLICATION_JSON))
            .andExpect(status().isOk());

        verifyNoInteractions(notificationService);
    }

    @Test
    public void givenValidCaseDataWhenCallbackIsInvokedThenSendEmail() throws Exception {
        CaseData data = caseDataWithOrderSummary();
        data.setDateSubmitted(LocalDateTime.now());
        data.setSolSignStatementOfTruth(YesOrNo.YES);

        OrderSummary orderSummary = OrderSummary.builder().paymentTotal("55000").build();
        data.setApplicationFeeOrderSummary(orderSummary);

        Payment payment = Payment.builder()
            .paymentAmount(55000)
            .paymentStatus(SUCCESS)
            .build();

        data.setPayments(singletonList(new ListValue<>("1", payment)));

        mockMvc.perform(post(ABOUT_TO_SUBMIT_URL)
            .contentType(APPLICATION_JSON)
            .header(SERVICE_AUTHORIZATION, AUTH_HEADER_VALUE)
            .content(OBJECT_MAPPER.writeValueAsString(callbackRequest(data, CITIZEN_ADD_PAYMENT)))
            .accept(APPLICATION_JSON))
            .andExpect(status().isOk());

        verify(notificationService)
            .sendEmail(eq(TEST_USER_EMAIL), eq(APPLICATION_SUBMITTED), anyMap(), eq(ENGLISH));

        verifyNoMoreInteractions(notificationService);
    }

    @Test
    public void givenValidCaseDataWhenCallbackIsInvokedThenSendTwoEmail() throws Exception {
        CaseData data = caseDataWithOrderSummary();
        data.setDateSubmitted(LocalDateTime.now());
        data.setApplicant2(getApplicant2(Gender.MALE));
        data.setApplicant1WantsToHavePapersServedAnotherWay(YesOrNo.YES);


        OrderSummary orderSummary = OrderSummary.builder().paymentTotal("55000").build();
        data.setApplicationFeeOrderSummary(orderSummary);

        Payment payment = Payment.builder()
            .paymentAmount(55000)
            .paymentStatus(SUCCESS)
            .build();

        data.setPayments(singletonList(new ListValue<>("1", payment)));

        mockMvc.perform(post(ABOUT_TO_SUBMIT_URL)
            .contentType(APPLICATION_JSON)
            .header(SERVICE_AUTHORIZATION, AUTH_HEADER_VALUE)
            .content(OBJECT_MAPPER.writeValueAsString(callbackRequest(data, CITIZEN_ADD_PAYMENT)))
            .accept(APPLICATION_JSON))
            .andExpect(status().isOk());

        verify(notificationService)
            .sendEmail(eq(TEST_USER_EMAIL), eq(APPLICATION_SUBMITTED), anyMap(), eq(ENGLISH));

        verify(notificationService)
            .sendEmail(eq(TEST_USER_EMAIL), eq(OUTSTANDING_ACTIONS), anyMap(), eq(ENGLISH));

        verifyNoMoreInteractions(notificationService);
    }

    @Test
    public void givenDeclinedPaymentDontSendNotification() throws Exception {
        CaseData data = caseDataWithOrderSummary();
        data.setDateSubmitted(LocalDateTime.now());

        OrderSummary orderSummary = OrderSummary.builder().paymentTotal("55000").build();
        data.setApplicationFeeOrderSummary(orderSummary);

        Payment payment = Payment.builder()
            .paymentAmount(55000)
            .paymentStatus(DECLINED)
            .build();

        data.setPayments(singletonList(new ListValue<>("1", payment)));

        mockMvc.perform(post(ABOUT_TO_SUBMIT_URL)
            .contentType(APPLICATION_JSON)
            .header(SERVICE_AUTHORIZATION, AUTH_HEADER_VALUE)
            .content(OBJECT_MAPPER.writeValueAsString(callbackRequest(data, CITIZEN_ADD_PAYMENT)))
            .accept(APPLICATION_JSON))
            .andExpect(status().isOk());

        verifyNoInteractions(notificationService);
    }

    @Test
    public void givenSendEmailThrowsExceptionWhenCallbackIsInvokedThenReturnBadRequest() throws Exception {
        CaseData data = caseDataWithOrderSummary();
        data.setDateSubmitted(LocalDateTime.now());

        data.setSolSignStatementOfTruth(YesOrNo.YES);

        OrderSummary orderSummary = OrderSummary.builder().paymentTotal("55000").build();
        data.setApplicationFeeOrderSummary(orderSummary);

        Payment payment = Payment.builder()
            .paymentAmount(55000)
            .paymentStatus(SUCCESS)
            .build();

        data.setPayments(singletonList(new ListValue<>("1", payment)));

        doThrow(new NotificationException(new NotificationClientException("All template params not passed")))
            .when(notificationService).sendEmail(
            eq(TEST_USER_EMAIL),
            eq(APPLICATION_SUBMITTED),
            anyMap(),
            eq(ENGLISH));

        mockMvc.perform(post(ABOUT_TO_SUBMIT_URL)
            .contentType(APPLICATION_JSON)
            .header(SERVICE_AUTHORIZATION, AUTH_HEADER_VALUE)
            .content(OBJECT_MAPPER.writeValueAsString(callbackRequest(data, CITIZEN_ADD_PAYMENT)))
            .accept(APPLICATION_JSON))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("All template params not passed"));
    }
}
