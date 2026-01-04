import { Button } from "@repo/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@repo/ui/components/empty";
import { FileQuestion } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type NotFoundAlertProps = {
  title?: string;
  description?: string;
  action?: () => void;
  backUrl?: string;
};

export const NotFoundAlert: React.FC<NotFoundAlertProps> = ({
  title = "Data Tidak Ditemukan",
  description = "Data yang Anda cari tidak dapat ditemukan atau telah dihapus.",
  action,
  backUrl,
}) => {
  const router = useRouter();

  return (
    <div className="p-8">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileQuestion className="text-muted-foreground" />
          </EmptyMedia>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            {action && <Button onClick={() => action()}>Coba Lagi</Button>}
            {backUrl ? (
              <Button variant="outline" asChild>
                <Link href={backUrl}>Kembali</Link>
              </Button>
            ) : (
              <Button variant="outline" onClick={() => router.back()}>
                Kembali
              </Button>
            )}
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
};
