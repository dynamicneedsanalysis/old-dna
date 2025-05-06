import { EditNavBar } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/edit-nav";

export default function EditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-dvh max-h-dvh">
      <EditNavBar />
      {children}
    </div>
  );
}
