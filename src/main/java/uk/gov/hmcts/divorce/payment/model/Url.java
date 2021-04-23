package uk.gov.hmcts.divorce.payment.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class Url {

    @JsonProperty("method")
    private String method;

    @JsonProperty("href")
    private String href;

}
