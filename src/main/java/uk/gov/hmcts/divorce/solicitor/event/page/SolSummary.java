package uk.gov.hmcts.divorce.solicitor.event.page;

import uk.gov.hmcts.divorce.ccd.CcdPageConfiguration;
import uk.gov.hmcts.divorce.ccd.PageBuilder;

public class SolSummary implements CcdPageConfiguration {

    @Override
    public void addTo(final PageBuilder pageBuilder) {

        pageBuilder
            .page("SolSummary")
            .label("LabelSolAppSummaryPara-1", "# Before you submit")
            .label("LabelSolAppSummaryPara-2", "## What happens next")
            .label(
                "LabelSolAppSummaryPara-3",
                "### Please continue to submit your application on the next screen. \r\nThe application "
                    + "will be checked. If it’s correct, you’ll be sent a notice of issue. Applicant 2 will "
                    + "also receive a copy of the application unless you have chosen to personally effect service.")
            .label(
                "LabelSolAppSummaryPara-4",
                "Contact the divorce centre if you don't hear anything back after 3 weeks.")
            .label(
                "LabelSolAppSummaryPara-5",
                "Phone: 0300 303 0642 (Monday to Friday, 8.30am to 5pm)\r\nEmail: contactdivorce@justice.gov.uk")
            .label("LabelSolAppSummaryPara-6", "## Help us improve this service")
            .label(
                "LabelSolAppSummaryPara-7",
                "This is a new service that is still being developed. If you haven't already done so, "
                    + "please provide feedback on what you think of it and how it can be improved.")
            .label("LabelSolAppSummaryPara-8", "## If you need help")
            .label(
                "LabelSolAppSummaryPara-9",
                "You can contact the divorce centre if you need help with your application.")
            .label(
                "LabelSolAppSummaryPara-10",
                "Phone: 0300 303 0642 (Monday to Friday, 8.30am to 5pm)\r\nEmail: contactdivorce@justice.gov.uk");
    }
}
