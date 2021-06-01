package uk.gov.hmcts.divorce.payment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import uk.gov.hmcts.ccd.sdk.type.Fee;
import uk.gov.hmcts.ccd.sdk.type.ListValue;
import uk.gov.hmcts.ccd.sdk.type.OrderSummary;
import uk.gov.hmcts.divorce.common.model.CaseData;
import uk.gov.hmcts.divorce.common.model.DivorceOrDissolution;
import uk.gov.hmcts.divorce.payment.model.FeeResponse;
import uk.gov.hmcts.divorce.payment.model.Payment;
import uk.gov.hmcts.divorce.payment.model.PaymentStatus;
import uk.gov.hmcts.reform.payments.client.PaymentsClient;
import uk.gov.hmcts.reform.payments.client.models.FeeDto;
import uk.gov.hmcts.reform.payments.client.models.PaymentDto;
import uk.gov.hmcts.reform.payments.client.request.CardPaymentRequest;

import java.math.BigDecimal;

import static java.util.Collections.singletonList;
import static uk.gov.hmcts.ccd.sdk.type.Fee.getValueInPence;

@Service
public class PaymentService {

    private static final String DEFAULT_CHANNEL = "default";
    private static final String ISSUE_EVENT = "issue";
    private static final String FAMILY = "family";
    private static final String FAMILY_COURT = "family court";
    private static final String DIVORCE = "divorce";

    @Autowired
    private FeesClient feesClient;

    @Autowired
    private PaymentsClient paymentsClient;

    @Value("${uk.gov.notify.email.templateVars.signInDivorceUrl}")
    private String divorceUrl;

    @Value("${uk.gov.notify.email.templateVars.signInDissolutionUrl}")
    private String dissolutionUrl;

    public OrderSummary getOrderSummary() {
        final var feeResponse = feesClient.getApplicationIssueFee(
            DEFAULT_CHANNEL,
            ISSUE_EVENT,
            FAMILY,
            FAMILY_COURT,
            DIVORCE,
            null
        );

        return OrderSummary
            .builder()
            .fees(singletonList(getFee(feeResponse)))
            .paymentTotal(getValueInPence(feeResponse.getAmount()))
            .build();
    }

    private ListValue<Fee> getFee(final FeeResponse feeResponse) {
        return new ListValue<>(
            null,
            Fee
                .builder()
                .amount(getValueInPence(feeResponse.getAmount()))
                .code(feeResponse.getFeeCode())
                .description(feeResponse.getDescription())
                .version(String.valueOf(feeResponse.getVersion()))
                .build()
        );
    }

    public Payment startCardPayment(CaseData data, Long caseId, String idamToken) {
        OrderSummary order = data.getApplicationFeeOrderSummary();
        FeeDto[] fees = order.getFees()
            .stream()
            .map(this::toFeeDto)
            .toArray(FeeDto[]::new);

        CardPaymentRequest cardPaymentRequest = CardPaymentRequest.builder()
            .amount(new BigDecimal(order.getPaymentTotal()))
            .ccdCaseNumber(String.valueOf(caseId))
            .description("Something")
            .service(DIVORCE.toUpperCase())
            .currency("GBP")
            .fees(fees)
            .siteId("AA04") // this will be removed in favour of case type ID
            .build();

        String returnUrl = getReturnUrl(data.getDivorceOrDissolution()).concat("payment-complete");
        PaymentDto paymentDto = paymentsClient.createCardPayment(
            idamToken,
            cardPaymentRequest,
            returnUrl,
            returnUrl
        );

        return Payment.builder()
            .paymentStatus(PaymentStatus.valueOf(paymentDto.getStatus()))
            .paymentAmount(paymentDto.getAmount().intValue())
            .paymentChannel(paymentDto.getChannel())
            .paymentSiteId(paymentDto.getSiteId())
            .paymentDate(paymentDto.getDateCreated().toLocalDate())
            .paymentReference(paymentDto.getPaymentReference())
            .paymentFeeId("") // todo store list of fees on payment or reference to OrderSummary
            .build();
    }

    private String getReturnUrl(DivorceOrDissolution divorceOrDissolution) {
        return divorceOrDissolution.isDivorce() ? divorceUrl : dissolutionUrl;
    }

    private FeeDto toFeeDto(ListValue<Fee> feeListValue) {
        Fee fee = feeListValue.getValue();

        return FeeDto.builder()
            .calculatedAmount(BigDecimal.valueOf(Integer.parseInt(fee.getAmount())))
            .code(fee.getCode())
            .version(fee.getVersion())
            .build();
    }
}
