import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import {
  selectSingleClient,
  insertDocument,
  insertIllustration,
} from "@/db/queries/index";
import { insertIllustrationsSchema } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/illustrations/lib/types";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  documentUploader: f({
    pdf: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 10,
    },
  })
    .input(insertIllustrationsSchema.pick({ clientId: true }))
    // Set permissions and file types for this FileRoute
    .middleware(async ({ input }) => {
      // This code runs on your server before upload
      const { getUser } = getKindeServerSession();

      const user = await getUser();

      // If you throw, the User will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Check if Client belongs to the advisor.
      const { clientId } = input;

      const { client, error } = await selectSingleClient({
        id: clientId,
        kindeId: user.id,
      });

      // On error or missing Client, throw error to stop upload.
      if (error) throw new UploadThingError(error.message);

      if (!client) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { kindeId: user.id, clientId: client.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for kindeId:", metadata.kindeId);

      // On upload complete, insert the document into the database.
      const { id, error } = await insertDocument({
        clientId: metadata.clientId,
        kindeId: metadata.kindeId,
        fileKey: file.key,
        fileName: file.name,
        fileSize: file.size,
        fileUrl: file.url,
      });

      // If there is an error after upload, a different error will be thrown.
      if (error) throw new UploadThingError(error.message);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return {
        id,
        kindeId: metadata.kindeId,
        clientId: metadata.clientId,
        fileName: file.name,
        fileSize: file.size,
        fileUrl: file.url,
      };
    }),
  illustrationUploader: f({
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .input(
      insertIllustrationsSchema.pick({
        clientId: true,
        carrier: true,
        policyName: true,
      })
    )
    // Set permissions and file types for this FileRoute
    .middleware(async ({ input }) => {
      // This code runs on your server before upload
      const { getUser } = getKindeServerSession();

      const user = await getUser();

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Check if Client belongs to the advisor.
      const { clientId, carrier, policyName } = input;

      const { client, error } = await selectSingleClient({
        id: clientId,
        kindeId: user.id,
      });

      // On error or missing Client, throw error to stop upload.
      if (error) throw new UploadThingError(error.message);

      if (!client) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { kindeId: user.id, clientId: client.id, carrier, policyName };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for kindeId:", metadata.kindeId);

      // On upload complete, insert the illustration into the database.
      const { id, error } = await insertIllustration({
        clientId: metadata.clientId,
        kindeId: metadata.kindeId,
        carrier: metadata.carrier,
        policyName: metadata.policyName,
        fileKey: file.key,
        fileName: file.name,
        fileSize: file.size,
        fileUrl: file.url,
      });

      // If there is an error after upload, a different error will be thrown.
      if (error) throw new UploadThingError(error.message);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return {
        id,
        kindeId: metadata.kindeId,
        clientId: metadata.clientId,
        carrier: metadata.carrier,
        policyName: metadata.policyName,
        fileName: file.name,
        fileSize: file.size,
        fileUrl: file.url,
      };
    }),
} satisfies FileRouter;

// Export the result of the FileRouter as a type.
export type OurFileRouter = typeof ourFileRouter;
