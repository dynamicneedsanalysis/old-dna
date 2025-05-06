"use client";

import { useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { useDebouncedCallback } from "use-debounce";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UpdateNewBusiness } from "@/db/schema/index";
import { updateNewBusiness } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/new-business/actions";

// Takes: The update new Business object and the Client Id.
export function NewBusinessForm({
  newBusiness,
  clientId,
}: {
  newBusiness: UpdateNewBusiness;
  clientId: number;
}) {
  const [applicationNumber, setApplicationNumber] = useState(
    newBusiness.applicationNumber ?? ""
  );

  // On application number change, update the New Business with the new value.
  // Use debounced to set a min delay of 500ms (or the browser page re-renders).
  const debouncedUpdateApplicationNumber = useDebouncedCallback(
    async (val: string) => {
      await updateNewBusiness({ applicationNumber: val }, clientId);
    },
    500
  );

  const [isPremiumCheque, setIsPremiumCheque] = useState(
    !!newBusiness.premiumChequeAmount
  );
  const [premiumCheque, setPremiumCheque] = useState(
    newBusiness.premiumChequeAmount
      ? parseFloat(newBusiness.premiumChequeAmount)
      : 0
  );

  // On adding a premium cheque, update the New Business with the new value.
  // Use debounced to set a min delay of 500ms (or the browser page re-renders).
  const debouncedUpdatePremiumCheque = useDebouncedCallback(
    async (val: number) => {
      await updateNewBusiness(
        { premiumChequeAmount: val.toString() },
        clientId
      );
    },
    500
  );

  const [isCompletedQuestionnaire, setIsCompletedQuestionnaire] = useState(
    !!newBusiness.completedQuestionnaires
  );

  const [completedQuestionnaires, setCompletedQuestionnaire] = useState(
    newBusiness.completedQuestionnaires ?? ""
  );

  // On update to the completed questionnaires value, update the New Business with the new value.
  // Use debounced to set a min delay of 500ms (or the browser page re-renders).
  const debouncedUpdateCompletedQuestionnaires = useDebouncedCallback(
    async (val: string) => {
      await updateNewBusiness({ completedQuestionnaires: val }, clientId);
    },
    500
  );

  const [isLinkedFile, setIsLinkedFile] = useState(!!newBusiness.linkedFile);
  const [linkedFile, setLinkedFile] = useState(newBusiness.linkedFile ?? "");

  // On update to the linked file value, update the New Business with the new value.
  // Use debounced to set a min delay of 500ms (or the browser page re-renders).
  const debouncedUpdateLinkedFile = useDebouncedCallback(
    async (val: string) => {
      await updateNewBusiness({ linkedFile: val }, clientId);
    },
    500
  );
  const [isOther, setIsOther] = useState(!!newBusiness.otherRequirements);
  const [other, setOther] = useState(newBusiness.otherRequirements ?? "");

  // On update to the other requirements value, update the New Business with the new value.
  // Use debounced to set a min delay of 500ms (or the browser page re-renders).
  const debouncedUpdateOther = useDebouncedCallback(async (val: string) => {
    await updateNewBusiness({ otherRequirements: val }, clientId);
  }, 500);
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="applicationNumber">Application #:</Label>
          <Input
            value={applicationNumber}
            onChange={async (e) => {
              setApplicationNumber(e.target.value);
              await debouncedUpdateApplicationNumber(e.target.value);
            }}
            id="applicationNumber"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Label>Plan Type:</Label>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="Term"
              checked={!!newBusiness.Term}
              onCheckedChange={async (val) => {
                await updateNewBusiness(
                  { Term: Boolean(val.valueOf()) },
                  clientId
                );
              }}
            />
            <Label htmlFor="Term">Term</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="UL"
              checked={!!newBusiness.UL}
              onCheckedChange={async (val) => {
                await updateNewBusiness(
                  { UL: Boolean(val.valueOf()) },
                  clientId
                );
              }}
            />
            <Label htmlFor="UL">UL</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="WholeLife"
              checked={!!newBusiness.WholeLife}
              onCheckedChange={async (val) => {
                await updateNewBusiness(
                  { WholeLife: Boolean(val.valueOf()) },
                  clientId
                );
              }}
            />
            <Label htmlFor="WholeLife">Whole Life</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="DI"
              checked={!!newBusiness.DI}
              onCheckedChange={async (val) => {
                await updateNewBusiness(
                  { DI: Boolean(val.valueOf()) },
                  clientId
                );
              }}
            />
            <Label htmlFor="DI">DI</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="CI"
              checked={!!newBusiness.CI}
              onCheckedChange={async (val) => {
                await updateNewBusiness(
                  { CI: Boolean(val.valueOf()) },
                  clientId
                );
              }}
            />
            <Label htmlFor="CI">CI</Label>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="illustration"
            checked={!!newBusiness.illustrationAttached}
            onCheckedChange={async (val) => {
              await updateNewBusiness(
                { illustrationAttached: Boolean(val.valueOf()) },
                clientId
              );
            }}
          />
          <Label htmlFor="illustration">
            Illustration (MANDATORY and all Universal Life illustrations MUST be
            signed)
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="premiumCheque"
            checked={isPremiumCheque}
            onCheckedChange={(val) =>
              setIsPremiumCheque(Boolean(val.valueOf()))
            }
          />
          <Label htmlFor="premiumCheque">Premium Cheque attached:</Label>
          <CurrencyInput
            disabled={!isPremiumCheque}
            defaultValue={premiumCheque}
            intlConfig={{ locale: "en-CA", currency: "CAD" }}
            prefix="$"
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
            decimalsLimit={2}
            onValueChange={async (_, __, values) => {
              setPremiumCheque(values?.float ?? 0);
              await debouncedUpdatePremiumCheque(values?.float ?? 0);
            }}
          />
          <span className="text-sm">
            (Cheque date MUST match the application signed date)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="voidCheque"
            checked={!!newBusiness.prePrintedVoidCheque}
            onCheckedChange={async (val) => {
              await updateNewBusiness(
                { prePrintedVoidCheque: Boolean(val.valueOf()) },
                clientId
              );
            }}
          />
          <Label htmlFor="voidCheque">Pre-Printed Void Cheque</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="preAuthDebit"
            checked={!!newBusiness.preAuthorizedDebitForm}
            onCheckedChange={async (val) => {
              await updateNewBusiness(
                { preAuthorizedDebitForm: Boolean(val.valueOf()) },
                clientId
              );
            }}
          />
          <Label htmlFor="preAuthDebit">Pre-Authorized Debit Form</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="replacementForm"
            checked={!!newBusiness.replacementForm}
            onCheckedChange={async (val) => {
              await updateNewBusiness(
                { replacementForm: Boolean(val.valueOf()) },
                clientId
              );
            }}
          />
          <Label htmlFor="replacementForm">
            Replacement Form (MANDATORY only if client has an intention of
            replacing existing coverage with this application)
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="productPage"
            checked={!!newBusiness.productPage}
            onCheckedChange={async (val) => {
              await updateNewBusiness(
                { productPage: Boolean(val.valueOf()) },
                clientId
              );
            }}
          />
          <Label htmlFor="productPage">Product Page</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="financials"
            checked={!!newBusiness.financials}
            onCheckedChange={async (val) => {
              await updateNewBusiness(
                { financials: Boolean(val.valueOf()) },
                clientId
              );
            }}
          />
          <Label htmlFor="financials">
            Financials (MANDATORY for DI applications)
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="questionnaires"
            checked={isCompletedQuestionnaire}
            onCheckedChange={(val) =>
              setIsCompletedQuestionnaire(Boolean(val.valueOf()))
            }
          />
          <Label htmlFor="questionnaires">Completed Questionnaires:</Label>
          <Input
            disabled={!isCompletedQuestionnaire}
            value={completedQuestionnaires}
            onChange={async (e) => {
              setCompletedQuestionnaire(e.target.value);
              await debouncedUpdateCompletedQuestionnaires(e.target.value);
            }}
            className="flex-1"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="linkedFile"
            checked={isLinkedFile}
            onCheckedChange={(val) => setIsLinkedFile(Boolean(val.valueOf()))}
          />
          <Label htmlFor="linkedFile">Linked File:</Label>
          <Input
            disabled={!isLinkedFile}
            value={linkedFile}
            onChange={async (e) => {
              setLinkedFile(e.target.value);
              await debouncedUpdateLinkedFile(e.target.value);
            }}
            className="flex-1"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="advisorDisclosure"
            checked={!!newBusiness.clientSignedAdvisorDisclosure}
            onCheckedChange={async (val) => {
              await updateNewBusiness(
                { clientSignedAdvisorDisclosure: Boolean(val.valueOf()) },
                clientId
              );
            }}
          />
          <Label htmlFor="advisorDisclosure">
            Copy of Client Signed Advisor Disclosure (to be attached if on Close
            Supervision)
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="fna"
            checked={!!newBusiness.clientSignedFNA}
            onCheckedChange={async (val) => {
              await updateNewBusiness(
                { clientSignedFNA: Boolean(val.valueOf()) },
                clientId
              );
            }}
          />
          <Label htmlFor="fna">
            Copy of Client Signed Financial Needs Analysis (FNA) (to be attached
            if on Close Supervision)
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="other"
            checked={isOther}
            onCheckedChange={(val) => setIsOther(Boolean(val.valueOf()))}
          />
          <Label htmlFor="other">Other:</Label>
          <Input
            value={other}
            onChange={async (e) => {
              setOther(e.target.value);
              await debouncedUpdateOther(e.target.value);
            }}
            disabled={!isOther}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
