import {
  useState,
  type ComponentProps,
  type Dispatch,
  type SetStateAction,
} from "react";
import { readStreamableValue } from "ai/rsc";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { generateLetter } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/(letters)/actions";
import type { LetterType } from "@/constants/index";

// Takes: Status from a UseAssistant helper, an onClick handler,
//        A setInput handler, and a submitMessage handler.
export function RegenerateLetterDrawerDialog({
  isLoading,
  setIsLoading,
  type,
  clientId,
  setContent,
}: {
  type: LetterType;
  clientId: number;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setContent: Dispatch<SetStateAction<string>>;
}) {
  const [open, setOpen] = useState(false);

  // Get the current mobile status.
  const isMobile = useIsMobile();

  const handleCloseDialog = () => setOpen(false);

  // Display for mobile status.
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button disabled={isLoading}>Regenerate Letter</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Enhance Your Prompt</DrawerTitle>
            <DrawerDescription>
              Refine your AI-generated content by adding a specific prompt.
            </DrawerDescription>
          </DrawerHeader>
          <RegenerateLetterForm
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            clientId={clientId}
            setContent={setContent}
            type={type}
            className="px-4"
            closeDialog={handleCloseDialog}
          />
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  // Display for desktop status.
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={isLoading}>Regenerate Letter</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Enhance Your Prompt</DialogTitle>
          <DialogDescription>
            Refine your AI-generated content by adding a specific prompt.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <RegenerateLetterForm
            setContent={setContent}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            clientId={clientId}
            type={type}
            closeDialog={handleCloseDialog}
          />
          <DialogClose asChild>
            <Button type="button" variant="outline" className="w-full">
              Cancel
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface RegenerateLetterFormProps extends ComponentProps<"div"> {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setContent: Dispatch<SetStateAction<string>>;
  type: LetterType;
  clientId: number;
  closeDialog: () => void;
}

// Takes: A className, status, a closeDialog handler, an onClick handler,
//        A setInput handler, and a submitMessage handler.
function RegenerateLetterForm({
  isLoading,
  setIsLoading,
  type,
  clientId,
  className,
  closeDialog,
  setContent,
}: RegenerateLetterFormProps) {
  const [input, setInput] = useState("");
  return (
    <div className={cn("grid items-start gap-4", className)}>
      <Textarea
        placeholder="Type your prompt here."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button
        type="submit"
        disabled={isLoading}
        onClick={async () => {
          // Close dialogue and clear content.
          closeDialog();
          try {
            setIsLoading(true);
            setContent("");

            // Create a letter using input, clientId, and type.
            const { letter } = await generateLetter({
              modifierPrompt: input,
              clientId,
              type,
            });

            // Dynamically update the letter content as it is generated.
            for await (const delta of readStreamableValue(letter)) {
              setContent((currentGeneration) => `${currentGeneration}${delta}`);
            }
          } catch (err) {
            if (err instanceof Error) {
              console.log(err.message);
            }
          } finally {
            setIsLoading(false);
          }
        }}
      >
        Regenerate
      </Button>
    </div>
  );
}
