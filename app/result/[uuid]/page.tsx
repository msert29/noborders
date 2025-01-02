import { AIResult, AIResultProps } from '@/components/AIResult';
import { Suspense } from 'react';

export default async function Page({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  // Fetch the data with uuid in the future!
  const { uuid } = await params;
  console.log(uuid);
  const result: AIResultProps = {
    analysis:
      '\nI have reviewed the provided documentation carefully and here is my step-by-step analysis:\n\n1. Passport Information:\n- Diplomatic passport from Kyrgyz Republic\n- Holder: Uson Janybaevich Asanov\n- Issue Date: 09/08/2019\n- Expiry Date: 09/12/2020\n- The passport is a diplomatic type (PD)\n\n2. Bank Statement Review:\n- Account holder: John Smith\n- Located in US (Brownsville, TX)\n- Significant balance: $591,800.00\n- Recent large transactions: $500,000 transfer in, $80,000 transfer out\n- Regular monthly payments showing established financial patterns\n\n3. Cover Letter:\n- Appears to be a template with unfilled fields\n- Missing crucial information including:\n  * Actual applicant details\n  * Purpose of visit\n  * Period of stay\n  * Company information\n  * Financial responsibility declarations\n\n4. Cross-Document Analysis:\n- Severe mismatch between passport holder name and bank account holder\n- Geographic inconsistency: US-based bank account vs. Kyrgyz passport\n- No clear connection established between financial resources and applicant\n- Cover letter template is incomplete, providing no supporting information\n',
    issues:
      '\n1. CRITICAL: The passport has expired (expired on 09/12/2020)\n2. MAJOR: Name mismatch between passport (Uson Janybaevich Asanov) and bank statements (John Smith)\n3. MAJOR: No explanation for relationship between bank account holder and visa applicant\n4. MAJOR: Cover letter is a blank template with no actual information filled in\n5. CONCERN: Large recent financial transactions ($500,000 in, $80,000 out) without explanation\n6. CONCERN: Geographic discrepancy between US-based financial documentation and Kyrgyz passport\n7. MISSING: Purpose of visit not specified\n8. MISSING: Duration of intended stay not provided\n9. MISSING: Travel dates not specified\n10. MISSING: Accommodation details during UK stay not provided\n',
    decision:
      '\nDENIED\n\nJustification: The application contains multiple critical issues that make it impossible to approve. The expired passport alone is grounds for denial. Additionally, there are severe discrepancies in the documentation, particularly regarding financial evidence, and crucial missing information about the intended visit. The relationship between the bank account holder and the passport holder is not established, and the cover letter provides no supporting information for the application.\n',
    suggestion:
      "\n1. Passport Related:\n- Obtain a new valid passport before reapplying\n- Ensure the new passport has sufficient validity for the intended stay plus extra time\n\n2. Financial Documentation:\n- Provide bank statements in the applicant's name (Uson Janybaevich Asanov)\n- If using third-party financial support (John Smith):\n  * Provide a formal sponsorship letter\n  * Include documentation proving the relationship between sponsor and applicant\n  * Explain large recent transactions in the account\n\n3. Cover Letter:\n- Complete all fields in the cover letter template\n- Clearly state:\n  * Purpose of visit\n  * Intended length of stay\n  * Detailed travel plans\n  * Accommodation arrangements\n  * Financial arrangements\n\n4. Additional Required Documentation:\n- Provide evidence of ties to home country\n- Include detailed travel itinerary\n- Submit accommodation bookings or arrangements\n- Include evidence of relationship with sponsor (if applicable)\n- Provide explanation for the purpose and context of the visit\n\n5. Consider providing:\n- Employment verification from current employer\n- Property ownership documents from home country\n- Family ties documentation\n- Previous travel history (if any)\n",
    completeness:
      "I'll analyze the provided documents and identify what's missing from a complete UK visit visa application.\n\nCurrently Provided Documents:\n1. Bank Statements\n2. Cover Letter (template only, not filled)\n3. Passport (expired diplomatic passport)\n\nKey Missing Documents:\n\nEssential Documents:\n1. Visa Application Form - The actual completed visa application form is missing\n2. Current Valid Passport - The provided passport is expired (expired 09.12.2020)\n3. Employment Letter - Proof of current employment status\n4. Travel Itinerary - Planned dates and schedule for the UK visit\n5. Accommodation Proof - Where the applicant plans to stay in the UK\n6. Flight Bookings - At least provisional bookings\n7. Travel Insurance - For the duration of stay\n8. Photographs - Recent passport-sized photographs\n\nSupporting Documents (depending on visit purpose):\n1. Invitation Letter - If visiting someone or attending business meetings\n2. Host Documents - If staying with someone in the UK\n3. Travel History - Previous passport(s) showing travel history\n4. Recent Payslips - To support financial evidence\n5. Tax Returns - Additional financial proof\n6. Property Documents - Proof of ties to home country\n\nCritical Concerns:\n1. The passport provided is expired and is a diplomatic passport\n2. The cover letter is just a template and not completed\n3. The bank statements show a US address, which needs explanation given the Kyrgyz passport\n4. There's no clear purpose of visit established in the provided documents\n\nRecommendation:\nThe application appears to be significantly incomplete. The applicant needs to provide current versions of all essential documents listed above, with particular attention to obtaining a valid passport and completing a proper cover letter explaining the purpose of visit.",
  };

  return (
    <Suspense>
      <AIResult result={result} />
    </Suspense>
  );
}
