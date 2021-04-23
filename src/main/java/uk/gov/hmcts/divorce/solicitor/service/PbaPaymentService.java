package uk.gov.hmcts.divorce.solicitor.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uk.gov.hmcts.ccd.sdk.type.DynamicList;
import uk.gov.hmcts.ccd.sdk.type.Fee;
import uk.gov.hmcts.ccd.sdk.type.OrderSummary;
import uk.gov.hmcts.divorce.common.model.CaseData;
import uk.gov.hmcts.divorce.payment.PaymentClient;
import uk.gov.hmcts.divorce.payment.model.CreditAccountPaymentRequest;
import uk.gov.hmcts.reform.authorisation.generators.AuthTokenGenerator;

@Service
@Slf4j
public class PbaPaymentService {

    @Autowired
    private PaymentClient paymentClient;

    @Autowired
    private AuthTokenGenerator authTokenGenerator;

    public void processPbaPayment(CaseData caseData, String idamAuthToken) {
        DynamicList pbaNumbers = caseData.getPbaNumbers();

        String selectedPbaAccountNumber = pbaNumbers.getValue().getCode().toString();

        CreditAccountPaymentRequest creditAccountPaymentRequest = new CreditAccountPaymentRequest();

        paymentClient.creditAccountPayment(
            idamAuthToken,
            authTokenGenerator.generate(),
            creditAccountPaymentRequest
        );
    }

    private CreditAccountPaymentRequest creditAccountPaymentRequest(CaseData caseData, String caseId, String pbaNumber) {
        CreditAccountPaymentRequest creditAccountPaymentRequest = new CreditAccountPaymentRequest();
        OrderSummary orderSummary = caseData.getSolApplicationFeeOrderSummary();

        creditAccountPaymentRequest.setService("DIVORCE");
        creditAccountPaymentRequest.setCurrency("GBP");
        creditAccountPaymentRequest.setSiteId(caseData.getSelectedDivorceCentreSiteId());
        creditAccountPaymentRequest.setAccountNumber(pbaNumber);
        //creditAccountPaymentRequest.setOrganisationName();
        creditAccountPaymentRequest.setAmount(orderSummary.getPaymentTotal());
        creditAccountPaymentRequest.setCcdCaseNumber(caseId);

        // We are always interested in the first fee. There may be a change in the future
        Fee fee = orderSummary.getFees().get(0).getValue();
        creditAccountPaymentRequest.setDescription(fee.getDescription());

        return creditAccountPaymentRequest;
    }
}
