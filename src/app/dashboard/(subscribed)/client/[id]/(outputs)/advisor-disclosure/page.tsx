import { notFound } from "next/navigation";
import { getAccessToken, getUser, getUserProperties } from "@/lib/kinde";
import { PrintPDFButton } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components/print-button";
import {
  INSURERS,
  CANADIAN_PROVINCES,
  type ProvinceInitials,
} from "@/constants/index";

export default async function AdvisorDisclosurePage() {
  // Get the current User and their Access Token.
  const user = await getUser();
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return notFound();
  }

  // User the User's ID and Access Token to get their Properties.
  const userProperties = await getUserProperties(user.id, accessToken);
  if (userProperties.status !== "success") {
    return notFound();
  }
  return (
    <div className="relative px-4 py-20 print:p-0">
      <div className="absolute top-4 left-4">
        <PrintPDFButton />
      </div>
      <article className="prose mx-auto max-w-4xl leading-relaxed">
        <h1 className="text-center uppercase">Advisor Disclosure</h1>
        <h2>Licensing</h2>
        <p>
          {`I, ${user.given_name} ${user.family_name}, am licensed as a life insurance broker in the
          province of ${userProperties.properties.licensedProvinces
            .map(
              (provinceValue) =>
                CANADIAN_PROVINCES[provinceValue as ProvinceInitials]
            )
            .reduce(
              (acc, province, index, array) =>
                index === array.length - 1
                  ? acc + (acc ? " and " : "") + province
                  : acc + (acc ? ", " : "") + province,
              ""
            )}. I operate under
          ${userProperties.properties.agencyName}.`}
        </p>

        <h2>Companies I Am Contracted With</h2>
        <ul>
          {userProperties.properties.insurers.map((insurerCompCode) => {
            const insurer = INSURERS.find(
              (insurer) => insurer.CompCode === insurerCompCode
            );

            return insurer ? (
              <li key={insurerCompCode}>{insurer.Name}</li>
            ) : null;
          })}
        </ul>

        <h2>Relationship with Companies</h2>
        <p>
          No insurance company holds an ownership interest in my business, nor
          do I hold an interest in any insurance company.
        </p>

        <h2>Compensation</h2>
        <p>
          If you choose to purchase a financial product through me, I will be
          paid a sales commission from the company that provides the product. I
          may also receive:
        </p>
        <ul>
          <li>Renewal (or service) commission if you continue your plans</li>
          <li>Additional compensation such as bonuses</li>
          <li>Non-monetary benefits like travel incentives</li>
        </ul>
        <p>
          For certain products like Manulife One mortgages, I may receive a
          referral fee instead of commission. I will inform you when this
          happens.
        </p>
        <div className="break-before-page">
          <h2 className="">Conflict of Interest</h2>
          <p>
            I take the potential of a conflict of interest seriously. I will
            notify you if there is a conflict of interest of which I become
            aware in regards to my recommendations to you. My overall
            recommendations will be based on my analysis of your financial
            security needs.
          </p>
        </div>

        <h2>Privacy Statement</h2>
        <ol>
          <li>
            <strong>Accountability</strong>
            <p>
              My company is responsible for the personal information I receive
              from my clients and I will abide by the principles of PIPEDA in
              safeguarding that information in hard copy and computer documents.
              My employees also understand and abide by these rules.
            </p>
          </li>
          <li>
            <strong>Collection Purposes</strong>
            <p>
              Any personal, corporate, financial, and related information is
              collected and kept solely for providing advice and ensuring
              products or services are provided quickly and correctly. I may
              share your personal information with insurers through intermediary
              brokerage firms.
            </p>
          </li>
          <li>
            <strong>Consent</strong>
            <p>
              By becoming my client and signing this form, you agree to allow me
              to collect, retain, and share your information with relevant
              companies and software vendors for the purpose of providing
              financial services.
            </p>
          </li>
        </ol>
        <h2>More Information</h2>
        <p>
          Please contact me should you require additional information about my
          qualifications or the nature of my business.
        </p>
      </article>
    </div>
  );
}
