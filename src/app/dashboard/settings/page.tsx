import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SupportForm } from "@/app/dashboard/settings/components/support-form";
import { AdvisorProfile } from "./components/advisor-profile";
import { getAccessToken, getUser, getUserProperties } from "@/lib/kinde";
import { notFound, redirect } from "next/navigation";
import { DeleteAccountButton } from "./components/delete-account-button";
import { EditAdvisorProfileForm } from "./components/edit-advisor-profile-form";
import { checkSubscription } from "@/lib/stripe/utils";
import StripeButton from "@/components/stripe-button";
import RequestForm from "./components/request-form";

export default async function General({
  searchParams,
}: {
  searchParams: Promise<{ edit: boolean }>;
}) {
  const search = await searchParams;
  const edit = search?.edit ?? false;
  const user = await getUser();

  if (!user) {
    redirect("/api/auth/login");
  }

  // Get access token to get the User properties and return 404 if not found.
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return notFound();
  }

  // Get User properties and if they cannot be found, return 404.
  const userProperties = await getUserProperties(user.id, accessToken);
  if (userProperties.status !== "success") {
    return notFound();
  }

  const isSubscribed = await checkSubscription();
  return (
    <div className="grid gap-6">
      {!edit ? (
        <AdvisorProfile
          firstName={user?.given_name || ""}
          lastName={user?.family_name || ""}
          certifications={userProperties.properties.certifications}
          agencyName={userProperties.properties.agencyName}
          streetAddress={userProperties.properties.streetAddress}
          city={userProperties.properties.city}
          provinceOrState={userProperties.properties.provinceOrState}
          postcode={userProperties.properties.postcode}
          licensedProvinces={userProperties.properties.licensedProvinces}
          insurers={userProperties.properties.insurers}
        />
      ) : (
        <EditAdvisorProfileForm
          initialValues={{
            firstName: user.given_name || "",
            lastName: user.family_name || "",
            certifications: userProperties.properties.certifications,
            agencyName: userProperties.properties.agencyName,
            streetAddress: userProperties.properties.streetAddress,
            city: userProperties.properties.city,
            provinceOrState: userProperties.properties.provinceOrState,
            postcode: userProperties.properties.postcode,
            licensedProvinces: userProperties.properties.licensedProvinces,
            insurers: userProperties.properties.insurers,
          }}
        />
      )}
      <Card id="billing" x-chunk="dashboard-04-chunk-1">
        <CardHeader>
          <CardTitle>Plan & Billing</CardTitle>
          <CardDescription>
            {isSubscribed
              ? "You are currently on a pro plan."
              : "Please subscribe to get access to all features."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StripeButton isSubscribed={isSubscribed} />
        </CardContent>
      </Card>
      <Card id="data">
        <CardHeader>
          <CardTitle>Data & Privacy</CardTitle>
        </CardHeader>
        <CardContent>
          <RequestForm />
        </CardContent>
      </Card>
      <Card id="support">
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
          <CardDescription>
            If you want to change your email address or make a request regarding
            your data, please contact us.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SupportForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <DeleteAccountButton />
        </CardContent>
      </Card>
    </div>
  );
}
