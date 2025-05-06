import {
  Html,
  Body,
  Head,
  Heading,
  Hr,
  Container,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

type ContactFormEmailProps = {
  workEmail: string;
  firstName: string;
  lastName: string;
  companyName: string;
  comment?: string;
};

// Takes: Work email, first and last name, and company name strings.
//        Also takes an optional comment string.
export function RequestDemoEmail({
  firstName,
  lastName,
  workEmail,
  companyName,
  comment,
}: ContactFormEmailProps) {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>
          Demo Request from {firstName} {lastName}
        </Preview>
        <Body className="mx-auto my-auto font-sans">
          <Container className="mx-auto max-w-5xl">
            <Section className="p-5 leading-6">
              <Heading className="mb-8 text-2xl font-bold">
                Demo Request from {firstName} {lastName}
              </Heading>
              <Text className="text-base">
                First Name: <span className="font-medium">{firstName}</span>
              </Text>
              <Text className="text-base">
                Last Name: <span className="font-medium">{lastName}</span>
              </Text>
              <Text className="text-base">
                Company Name: <span className="font-medium">{companyName}</span>
              </Text>
              <Text className="text-base">
                Work Email: <span className="font-medium">{workEmail}</span>
              </Text>
              <Hr className="my-5 border border-gray-400" />
              <Text className="text-base">Additional Comment (optional):</Text>
              <Text className="text-base">
                <span className="font-medium">{comment}</span>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
