import type { selectAllBusinessKeyPeopleAndShareholders } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/queries/businesses";

// Define and export a type based on the success result of the Business Key People and Shareholders query.
export type BusinessKeyPeopleShareholders = NonNullable<
  Awaited<
    ReturnType<typeof selectAllBusinessKeyPeopleAndShareholders>
  >["businesses"]
>[0];
