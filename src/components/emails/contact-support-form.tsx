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
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
};

// Takes: Work email, first and last name, and company name strings.
//        Also takes an optional comment string.
export function ContactSupportEmail({
  userId,
  firstName,
  lastName,
  email,
  message,
}: ContactFormEmailProps) {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>
          Contact Support Submission By {firstName} {lastName}
        </Preview>
        <Body className="mx-auto my-auto font-sans">
          <Container className="mx-auto max-w-5xl">
            <Section className="p-5 leading-6">
              <Heading className="mb-8 text-2xl font-bold">
                Contact Support Submission By {firstName} {lastName}
              </Heading>
              <Text className="text-base">
                Kinde ID: <span className="font-medium">{userId}</span>
              </Text>
              <Text className="text-base">
                Name:{" "}
                <span className="font-medium">
                  {firstName} {lastName}
                </span>
              </Text>
              <Text className="text-base">
                Email: <span className="font-medium">{email}</span>
              </Text>
              <Hr className="my-5 border border-gray-400" />
              <Text className="text-base">Message:</Text>
              <Text className="text-base">
                <span className="font-medium">{message}</span>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
