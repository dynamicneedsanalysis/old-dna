"use client";

import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { UpdateSettlingRequirements } from "@/db/schema/index";
import { updateSettlingRequirements } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/settling-requirements/actions";

// Takes: The Update Settling Requirements and a Client Id.
export function SettlingRequirementsForm({
  settlingRequirements,
  clientId,
}: {
  settlingRequirements: UpdateSettlingRequirements;
  clientId: number;
}) {
  const [policyNum, setPolicyNum] = useState(
    settlingRequirements.policyNumber ?? ""
  );

  // On policy number change, update the Settling Requirements.
  // Use debounced to set a min delay of 500ms (or the browser page re-renders).
  const debouncedHandlePolicyNumberChange = useDebouncedCallback(
    async (val: string) => {
      await updateSettlingRequirements({ policyNumber: val }, clientId);
    },
    500
  );

  // Calls to updateSettlingRequirements:
  // Update a value in the Settling Requirements database and revalidate the `settling-requirements` path.
  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <div className="flex-1">
          <Label htmlFor="policy" className="text-lg font-medium">
            Policy #:
          </Label>
          <Input
            id="policy"
            value={policyNum}
            onChange={(e) => {
              setPolicyNum(e.target.value);
              debouncedHandlePolicyNumberChange(e.target.value);
            }}
            className="max-w-[200px]"
          />
        </div>
      </div>
      <div className="grid gap-x-12 gap-y-4 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={!!settlingRequirements.needsAnalysis}
              onCheckedChange={async (val) => {
                await updateSettlingRequirements(
                  { needsAnalysis: Boolean(val.valueOf()) },
                  clientId
                );
              }}
              id="needsAnalysis"
            />
            <Label htmlFor="needsAnalysis" className="text-base">
              Needs Analysis
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={!!settlingRequirements.policyDeliveryReceipt}
              onCheckedChange={async (val) => {
                await updateSettlingRequirements(
                  { policyDeliveryReceipt: Boolean(val.valueOf()) },
                  clientId
                );
              }}
              id="policyDelivery"
            />
            <Label htmlFor="policyDelivery" className="text-base">
              Policy Delivery Receipt
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={!!settlingRequirements.voidCheque}
              onCheckedChange={async (val) => {
                await updateSettlingRequirements(
                  { voidCheque: Boolean(val.valueOf()) },
                  clientId
                );
              }}
              id="voidCheque"
            />
            <Label htmlFor="voidCheque" className="text-base">
              Void Cheque
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={!!settlingRequirements.illustration}
              onCheckedChange={async (val) => {
                await updateSettlingRequirements(
                  { illustration: Boolean(val.valueOf()) },
                  clientId
                );
              }}
              id="illustration"
            />
            <Label htmlFor="illustration" className="text-base">
              Illustration
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={!!settlingRequirements.amendment}
              onCheckedChange={async (val) => {
                await updateSettlingRequirements(
                  { amendment: Boolean(val.valueOf()) },
                  clientId
                );
              }}
              id="amendment"
            />
            <Label htmlFor="amendment" className="text-base">
              Amendment
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={!!settlingRequirements.identificationNumber}
              onCheckedChange={async (val) => {
                await updateSettlingRequirements(
                  { identificationNumber: Boolean(val.valueOf()) },
                  clientId
                );
              }}
              id="identification"
            />
            <Label htmlFor="identification" className="text-base">
              Identification #
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={!!settlingRequirements.productPage}
              onCheckedChange={async (val) => {
                await updateSettlingRequirements(
                  { productPage: Boolean(val.valueOf()) },
                  clientId
                );
              }}
              id="productPage"
            />
            <Label htmlFor="productPage" className="text-base">
              Product Page
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={!!settlingRequirements.returnOfOriginalPolicy}
              onCheckedChange={async (val) => {
                await updateSettlingRequirements(
                  { returnOfOriginalPolicy: Boolean(val.valueOf()) },
                  clientId
                );
              }}
              id="returnOriginal"
            />
            <Label htmlFor="returnOriginal" className="text-base">
              Return of Original Policy
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={!!settlingRequirements.returnOfAlternatePolicy}
              onCheckedChange={async (val) => {
                await updateSettlingRequirements(
                  { returnOfAlternatePolicy: Boolean(val.valueOf()) },
                  clientId
                );
              }}
              id="returnAlternate"
            />
            <Label htmlFor="returnAlternate" className="text-base">
              Return of Alternate Policy
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={!!settlingRequirements.declarationOfInsurability}
              onCheckedChange={async (val) => {
                await updateSettlingRequirements(
                  { declarationOfInsurability: Boolean(val.valueOf()) },
                  clientId
                );
              }}
              id="declaration"
            />
            <Label htmlFor="declaration" className="text-base">
              Declaration of Continued Insurability
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={!!settlingRequirements.questionnaire}
              onCheckedChange={async (val) => {
                await updateSettlingRequirements(
                  { questionnaire: Boolean(val.valueOf()) },
                  clientId
                );
              }}
              id="questionnaire"
            />
            <Label htmlFor="questionnaire" className="text-base">
              Questionnaire:
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={!!settlingRequirements.otherRequirements}
              onCheckedChange={async (val) => {
                await updateSettlingRequirements(
                  { otherRequirements: Boolean(val.valueOf()) },
                  clientId
                );
              }}
              id="other"
            />
            <Label htmlFor="other" className="text-base">
              Other:
            </Label>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={!!settlingRequirements.chequeAmount}
              onCheckedChange={async (val) => {
                await updateSettlingRequirements(
                  { chequeAmount: Boolean(val.valueOf()) },
                  clientId
                );
              }}
              id="chequeAmount"
            />
            <Label htmlFor="chequeAmount" className="text-base">
              Cheque Amount $
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={!!settlingRequirements.pacAuthorization}
              onCheckedChange={async (val) => {
                await updateSettlingRequirements(
                  { pacAuthorization: Boolean(val.valueOf()) },
                  clientId
                );
              }}
              id="pacAuth"
            />
            <Label htmlFor="pacAuth" className="text-base">
              PAC Authorization
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={!!settlingRequirements.signedIllustration}
              onCheckedChange={async (val) => {
                await updateSettlingRequirements(
                  { signedIllustration: Boolean(val.valueOf()) },
                  clientId
                );
              }}
              id="signedIllustration"
            />
            <Label htmlFor="signedIllustration" className="text-base">
              Signed Illustration
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={!!settlingRequirements.replacementForm}
              onCheckedChange={async (val) => {
                await updateSettlingRequirements(
                  { replacementForm: Boolean(val.valueOf()) },
                  clientId
                );
              }}
              id="replacementForm"
            />
            <Label htmlFor="replacementForm" className="text-base">
              Replacement Form
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={!!settlingRequirements.surrenderRequest}
              onCheckedChange={async (val) => {
                await updateSettlingRequirements(
                  { surrenderRequest: Boolean(val.valueOf()) },
                  clientId
                );
              }}
              id="surrenderRequest"
            />
            <Label htmlFor="surrenderRequest" className="text-base">
              Surrender Request
            </Label>
          </div>
        </div>
      </div>
      <Separator className="my-6" />
      <div className="grid gap-x-12 gap-y-4 md:grid-cols-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={!!settlingRequirements.inForceNoRequirements}
            onCheckedChange={async (val) => {
              await updateSettlingRequirements(
                { inForceNoRequirements: Boolean(val.valueOf()) },
                clientId
              );
            }}
            id="inForce"
          />
          <Label htmlFor="inForce" className="text-base">
            In Force - No Requirements Needed
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            checked={!!settlingRequirements.notTaken}
            onCheckedChange={async (val) => {
              await updateSettlingRequirements(
                { notTaken: Boolean(val.valueOf()) },
                clientId
              );
            }}
            id="notTaken"
          />
          <Label htmlFor="notTaken" className="text-base">
            Not Taken
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            checked={!!settlingRequirements.endorsement}
            onCheckedChange={async (val) => {
              await updateSettlingRequirements(
                { endorsement: Boolean(val.valueOf()) },
                clientId
              );
            }}
            id="endorsement"
          />
          <Label htmlFor="endorsement" className="text-base">
            Endorsement
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            checked={!!settlingRequirements.returnForReissue}
            onCheckedChange={async (val) => {
              await updateSettlingRequirements(
                { returnForReissue: Boolean(val.valueOf()) },
                clientId
              );
            }}
            id="returnReissue"
          />
          <Label htmlFor="returnReissue" className="text-base">
            Return for Reissue
          </Label>
        </div>
      </div>
    </div>
  );
}
