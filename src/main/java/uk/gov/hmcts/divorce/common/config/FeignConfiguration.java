package uk.gov.hmcts.divorce.common.config;

import feign.Logger;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfiguration {

    /**
     * Enable detailed logging for feign clients by updating application.yaml with:
     *
     * logging:
     *   level:
     *     uk.gov.hmcts.reform.payments.client.PaymentsApi: DEBUG
     */
    @Bean
    Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }

}
