import { notFound } from "next/navigation";
import Image from "next/image";
import { getUser } from "@/lib/kinde";
import { calculateTotalNetWorthForCurrentYear } from "@/lib/asset/utils";
import { calculateBudgetRecommendation } from "@/lib/budget/utils";
import { calculateLifeExpectancyYear } from "@/lib/client/utils";
import { selectSingleClient } from "@/db/queries/clients";
import { Heading } from "@/components/ui/heading";
import { BeneficiariesTable } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components//beneficiaries-table";
import { BusinessTable } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components//business-table";
import { DebtsTable } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components//debts-table";
import { IncomeReplacementTable } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components//income-replacement-table";
import { KeyPersonTable } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components//key-person-table";
import { KeyPeopleTable } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components//key-people-table";
import { ShareholderTable } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components/shareholder-table";
import { ShareholdersTable } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components/shareholders-table";
import { TotalInsurableNeedsTable } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components//total-insurable-needs-table";
import { AssetsTable } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components//assets-table";
import { BeneficiaryDistributionTable } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components//beneficiary-distribution-table";
import { AssetValueDistributionChart } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components//asset-value-distribution-chart";
import { DesiredBeneficiaryAllocationChart } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components//desired-beneficiary-allocation-chart";
import { RealBeneficiaryDistributionChart } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components//real-beneficiary-distribution-chart";
import { RealBeneficiaryDistributionLifeExpectancy } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components//real-beneficiary-distribution-chart-eol";
import { DiversificationChart } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components//diversification-chart";
import { NetWorthChart } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components//net-worth-chart";
import { EBITDAContributionChart } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components//ebitda-contribution-chart";
import { DebtsChart } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components//debts-chart";
import { ShareValueChart } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components//share-value-chart";
import { TaxBurdenChart } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components//tax-burden-chart";
import { BudgetCard } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components//budget-card";
import { Goals } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components//goals";
import { Liquidity } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components//liquidity";
import { PrintPDFButton } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components/print-button";

// Takes: A Client Id
export async function Pdf({ clientId }: { clientId: number }) {
  // Get User and use it and the Client Id to select a single Client.
  const user = await getUser();
  const { client, error: clientError } = await selectSingleClient({
    id: clientId,
    kindeId: user.id,
  });

  if (clientError) {
    throw clientError;
  }

  if (!client) {
    notFound();
  }

  // Calculate the life expectancy year and the net worth for the current year.
  const lifeExpectancyYear = calculateLifeExpectancyYear(
    client.age,
    client.lifeExpectancy
  );
  const netWorth = calculateTotalNetWorthForCurrentYear(client.assets);

  // Use Client annual income and net worth to calculate Budget recommendation values.
  const { minBudget, maxBudget, maxBudgetPercentage, isFromMaxIncome } =
    calculateBudgetRecommendation(parseFloat(client.annualIncome), netWorth);
  return (
    <div className="w-full p-4 print:h-[calc(100dvh-72px)] print:p-0">
      <PrintPDFButton />
      <section className="relative flex min-h-[calc(100dvh-72px)] w-full break-after-page flex-col items-center justify-center">
        <div className="mb-10 flex items-center gap-4">
          <Image
            src="/logo.svg"
            alt="Dynamic Needs Analysis"
            width={40}
            height={40}
          />
          <div className="text-4xl font-bold tracking-tighter">DNA</div>
        </div>
        <div className="mb-10 text-6xl font-bold">
          {client.name} Family Planning
        </div>
        <div className="text-5xl font-medium">CONFIDENTIAL</div>
        <div className="absolute right-4 bottom-4 text-2xl font-medium">
          {new Date().toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </section>
      <section className="break-after-page p-6">
        <Heading variant="h1" id="income-replacement">
          Income Replacement
        </Heading>
        <div className="mt-10">
          <div>
            <Heading variant="h2">Client Overview</Heading>
            <div className="mx-auto max-w-4xl">
              <IncomeReplacementTable client={client} />
            </div>
          </div>
        </div>
      </section>
      <section className="mb-10 break-after-page space-y-4 p-6">
        <Heading variant="h1" id="beneficiaries">
          Beneficiaries
        </Heading>
        <div className="space-y-14">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 print:grid-cols-1">
            {client.beneficiaries.length > 0 ? (
              <div>
                <Heading variant="h2">Overview</Heading>
                <div className="mx-auto max-w-4xl">
                  <BeneficiariesTable beneficiaries={client.beneficiaries} />
                </div>
              </div>
            ) : (
              <p>No beneficiaries added.</p>
            )}
            {client.beneficiaries.length > 0 && (
              <div>
                <Heading variant="h2">Desired Beneficiary Allocation</Heading>
                <DesiredBeneficiaryAllocationChart
                  beneficiaries={client.beneficiaries}
                />
              </div>
            )}
          </div>
          <div className="grid break-before-page grid-cols-1 gap-4 md:grid-cols-2 print:grid-cols-1">
            {client.assets.length > 0 && (
              <>
                <div>
                  <Heading variant="h2">
                    Real Beneficiary Distribution (Today)
                  </Heading>
                  <RealBeneficiaryDistributionChart
                    assets={client.assets}
                    beneficiaries={client.beneficiaries}
                  />
                </div>
                <div>
                  <Heading variant="h2">
                    Real Beneficiary Distribution (Life Expectancy)
                  </Heading>
                  <RealBeneficiaryDistributionLifeExpectancy
                    lifeExpectancyYear={lifeExpectancyYear}
                    assets={client.assets}
                    beneficiaries={client.beneficiaries}
                  />
                </div>
              </>
            )}
          </div>
          <div className="break-before-page">
            <div>
              <Heading variant="h2">Asset Value Distribution</Heading>
              <AssetValueDistributionChart
                assets={client.assets}
                beneficiaries={client.beneficiaries}
              />
            </div>
          </div>
        </div>
      </section>
      <section className="break-after-page space-y-6 p-6 pb-20">
        <Heading variant="h1" id="businesses">
          Businesses
        </Heading>

        {client.businesses.length > 0 ? (
          <div>
            <Heading variant="h2">Overview</Heading>
            <div className="mx-auto max-w-4xl">
              <BusinessTable businesses={client.businesses} />
            </div>
          </div>
        ) : (
          <p>No businesses added.</p>
        )}

        {client.businesses.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 print:grid-cols-1">
            <section>
              <Heading variant="h2">Shareholders</Heading>
              <div className="mx-auto max-w-4xl">
                <ShareholdersTable businesses={client.businesses} />
              </div>
            </section>
            <section>
              <Heading variant="h2">Key People</Heading>
              <div className="mx-auto max-w-4xl">
                <KeyPeopleTable businesses={client.businesses} />
              </div>
            </section>
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 print:break-before-page print:grid-cols-1">
          {client.businesses.length > 0 && (
            <div>
              <Heading variant="h2">Share Value Per Year</Heading>
              <ShareValueChart businesses={client.businesses} />
            </div>
          )}
          {client.businesses.length > 0 && (
            <div>
              <Heading variant="h2">EBITDA Contribution Per Year</Heading>
              <EBITDAContributionChart businesses={client.businesses} />
            </div>
          )}
        </div>
      </section>
      <div className="break-after-page space-y-6 p-6">
        <Heading variant="h1" id="assets">
          Assets
        </Heading>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 print:grid-cols-1">
          {client.assets.length > 0 || client.businesses.length > 0 ? (
            <div>
              <Heading variant="h2">Overview</Heading>
              <div className="mx-auto max-w-4xl">
                <AssetsTable
                  assets={client.assets}
                  businesses={client.businesses}
                />
              </div>
            </div>
          ) : (
            <p>No assets or businesses added.</p>
          )}
          {client.assets.length > 0 && client.beneficiaries.length > 0 && (
            <section>
              <Heading variant="h2">Asset Beneficiaries</Heading>
              <div className="mx-auto max-w-4xl">
                <BeneficiaryDistributionTable
                  assets={client.assets}
                  beneficiaries={client.beneficiaries}
                  taxFreezeYear={client.taxFreezeAtYear}
                  lifeExpectancy={client.lifeExpectancy}
                  lifeExpectancyYear={lifeExpectancyYear}
                />
              </div>
            </section>
          )}
        </div>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 print:break-before-page print:grid-cols-1">
          {client.assets.length > 0 && (
            <div>
              <Heading variant="h2">Net Worth Per Year</Heading>
              <NetWorthChart
                taxFreezeAtYear={client.taxFreezeAtYear}
                lifeExpectancyYear={lifeExpectancyYear}
                assets={client.assets}
                lifeExpectancy={client.lifeExpectancy}
              />
            </div>
          )}
          {(client.assets.length > 0 || client.businesses.length > 0) && (
            <div>
              <Heading variant="h2">Asset Diversification</Heading>
              <DiversificationChart
                assets={client.assets}
                businesses={client.businesses}
              />
            </div>
          )}
        </section>
      </div>
      <section className="break-after-page p-6">
        <Heading variant="h1" id="debts">
          Debts
        </Heading>
        {client.debts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 print:grid-cols-1">
            <div>
              <Heading variant="h2">Overview</Heading>
              <div className="mx-auto max-w-4xl">
                <DebtsTable debts={client.debts} />
              </div>
            </div>
            <div>
              <Heading variant="h2">Debt Value Per Year</Heading>
              <DebtsChart
                debts={client.debts}
                lifeExpectancyYear={lifeExpectancyYear}
              />
            </div>
          </div>
        ) : (
          <p>No debts added.</p>
        )}
      </section>
      <section className="space-y-8 p-6 pb-20 print:break-after-page">
        <Heading variant="h1" id="goals">
          Goals & Philanthropy
        </Heading>
        <div>
          {client.goals.length > 0 ? (
            <Goals goals={client.goals} />
          ) : (
            <p>No goals added.</p>
          )}
        </div>
        <Liquidity
          goals={client.goals}
          assets={client.assets}
          liquidityToGoalsPercent={parseFloat(
            client.liquidityAllocatedTowardsGoals
          )}
          lifeExpectancy={client.lifeExpectancy}
        />
      </section>
      <section className="break-after-page p-6 pb-20">
        {(client.businesses.length > 0 || client.assets.length > 0) && (
          <section className="relative">
            <Heading variant="h2" id="tax-burden">
              Estate Tax Liability in {client.taxFreezeAtYear}
            </Heading>
            <TaxBurdenChart
              assets={client.assets}
              businesses={client.businesses}
              province={client.province}
              taxFreezeAtYear={client.taxFreezeAtYear}
              lifeExpectancyYear={lifeExpectancyYear}
              lifeExpectancy={client.lifeExpectancy}
            />
          </section>
        )}
      </section>
      <div className="space-y-6 p-6 pb-20">
        <section className="space-y-4">
          <Heading variant="h1" id="total-insurable-needs">
            Total Insurable Needs
          </Heading>
          <div className="mx-auto max-w-4xl">
            <TotalInsurableNeedsTable
              client={client}
              businesses={client.businesses}
            />
          </div>
        </section>
        {client.businesses.length > 0 && client.businesses[0].keyPeople && (
          <section>
            <Heading variant="h2">Key Person</Heading>
            <div className="mx-auto max-w-4xl">
              <KeyPersonTable
                businesses={client.businesses}
                lifeExpectancy={client.lifeExpectancy}
              />
            </div>
          </section>
        )}
        {client.businesses.length > 0 && client.businesses[0].shareholders && (
          <section>
            <Heading variant="h2">Buy - Sell Shareholders Agreement</Heading>
            <div className="mx-auto max-w-4xl">
              <ShareholderTable
                businesses={client.businesses}
                lifeExpectancy={client.lifeExpectancy}
              />
            </div>
          </section>
        )}
      </div>
      {client.budgets && (
        <section className="break-after-page p-6">
          <Heading variant="h1" id="budget">
            Budget Recommendation
          </Heading>
          <div className="mt-10">
            <BudgetCard
              id={client.budgets.id}
              minimumBudget={minBudget}
              incomeBudget={parseFloat(client.budgets.income)}
              maximumBudget={maxBudget}
              maxBudgetPercentage={maxBudgetPercentage}
              isFromMaxIncome={isFromMaxIncome}
            />
          </div>
        </section>
      )}
    </div>
  );
}
