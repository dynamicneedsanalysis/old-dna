import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Img,
} from "@react-email/components";

interface UserInvitationEmailProps {
  role: string;
  owner: string;
  orgName: string;
  invitationId: number;
}

export default function UserInvitationEmail({
  role = "User",
  invitationId = 123,
  orgName = "Dynamic Needs Analysis",
  owner = "John Doe",
}: UserInvitationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>You were invited to {orgName}</Preview>
      <Body style={main}>
        <Section style={imageSection}>
          <Img
            src="https://dynamicneedsanalysis.kinde.com/logo?p_org_code=&cache=b5481124a51a4ab5a612c86284e4bd58"
            alt="DNA's Logo"
            style={logo}
          />
        </Section>
        <Container style={container}>
          <Section style={coverSection}>
            <Section style={upperSection}>
              <Text style={mainText}>
                You&apos;ve been invited to join {orgName} on Dynanmic Needs
                Analysis
              </Text>
              <Text style={validityText}>
                <span
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  {owner}
                </span>{" "}
                would like you to join the{" "}
                <span
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  {orgName}
                </span>{" "}
                organization on Dyanmic Needs Analysis with the{" "}
                <span
                  style={{
                    textTransform: "capitalize",
                    fontWeight: "bold",
                  }}
                >
                  {role}
                </span>{" "}
                role.
              </Text>

              {/* <Text style={validityText}>What you&apos;ll get access to:</Text>
              <ul style={featureList}>
                <li>Powerful Habit Tracking Features</li>
                <li>Wellness challenges and activities</li>
                <li>Personalized AI wellness advisor</li>
                <li>Health tracking tools</li>
              </ul> */}
              <Section>
                <Section
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <a
                    href={`${process.env.KINDE_SITE_URL ?? `https://${process.env.VERCEL_BRANCH_URL}`}/dashboard/accept-invitation/${invitationId}`}
                    style={button}
                  >
                    Accept Invitation
                  </a>
                </Section>
              </Section>
            </Section>
          </Section>
          <Text style={footerText}>
            This message was produced and distributed by Dynanmic Needs
            Analysis. © {new Date().getFullYear()}, Dynanmic Needs Analysis,
            Inc.. All rights reserved. Dynanmic Needs Analysis is a registered
            trademark of{" "}
            <a
              href={`${process.env.KINDE_SITE_URL ?? `https://${process.env.VERCEL_BRANCH_URL}`}`}
              target="_blank"
              style={link}
            >
              Dynanmic Needs Analysis
            </a>
            , Inc. View our{" "}
            <a
              href={`${process.env.KINDE_SITE_URL ?? `https://${process.env.VERCEL_BRANCH_URL}`}`}
              target="_blank"
              style={link}
            >
              privacy policy
            </a>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#fff",
  color: "#2b3a5f",
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const link = {
  color: "#2754C5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Open Sans', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "16px",
  textDecoration: "underline",
};

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Open Sans', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "16px",
  margin: "24px 0",
};

const imageSection = {
  backgroundColor: "#0f2336",
  padding: "20px 20px",
};

const logo = { margin: "0 auto" };

const coverSection = { backgroundColor: "#fff" };

const upperSection = { padding: "25px 35px" };

const footerText = {
  ...text,
  fontSize: "12px",
  padding: "0 20px",
};

const validityText = {
  ...text,
  margin: "26px 0px",
  textAlign: "left" as const,
};

const mainText = {
  ...text,
  fontWeight: "600",
  fontSize: "30px",
  lineHeight: "1.2",
  marginBottom: "14px",
};

const button = {
  fontFamily: "sans-serif",
  backgroundColor: "#2b3a5f",
  borderRadius: "3px",
  fontWeight: "600",
  color: "#fff",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "11px 23px",
  width: "380px",
};

// const featureList = {
//   color: "#000",
//   marginBottom: "40px",
//   gap: 8,
//   fontSize: "16px",
//   fontFamily:
//     "-apple-system, BlinkMacSystemFont, 'Open Sans', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
// };
