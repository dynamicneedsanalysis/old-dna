import { Heading } from "@/components/ui/heading";
import { RequestDemoForm } from "@/app/(marketing)/contact-us/request-demo-form";

export default function ContactUsPage() {
  return (
    <div className="p-6">
      <div className="mt-8 flex flex-col justify-center gap-20 md:flex-row">
        <div className="mt-4 w-[400px] text-center xl:text-left">
          <Heading variant="h1">
            See how DNA can help you and your organization.
          </Heading>
          <p>
            Reach out to hear about the DNA workflow so you can take your
            corporation to the next level through an improved client and advisor
            experience.
          </p>
        </div>
        <RequestDemoForm />
      </div>
    </div>
  );
}
