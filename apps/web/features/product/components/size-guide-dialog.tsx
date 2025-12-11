import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@repo/ui/components/drawer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { useEffect, useState } from "react";

interface SizeGuideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SizeGuideDialog = ({ open, onOpenChange }: SizeGuideDialogProps) => {
  const isMobile = useIsMobile();
  const measurements = [
    { size: "XS", chest: "88-92", length: "65", shoulder: "42", sleeve: "60" },
    { size: "S", chest: "92-96", length: "67", shoulder: "44", sleeve: "62" },
    { size: "M", chest: "96-100", length: "69", shoulder: "46", sleeve: "64" },
    { size: "L", chest: "100-104", length: "71", shoulder: "48", sleeve: "66" },
    {
      size: "XL",
      chest: "104-108",
      length: "73",
      shoulder: "50",
      sleeve: "68",
    },
    {
      size: "XXL",
      chest: "108-112",
      length: "75",
      shoulder: "52",
      sleeve: "70",
    },
  ];

  const guideContent = (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Ukuran</TableHead>
            <TableHead className="font-semibold">Dada</TableHead>
            <TableHead className="font-semibold">Panjang</TableHead>
            <TableHead className="font-semibold">Bahu</TableHead>
            <TableHead className="font-semibold">Lengan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {measurements.map((item) => (
            <TableRow key={item.size}>
              <TableCell className="font-medium">{item.size}</TableCell>
              <TableCell>{item.chest}</TableCell>
              <TableCell>{item.length}</TableCell>
              <TableCell>{item.shoulder}</TableCell>
              <TableCell>{item.sleeve}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="space-y-4 text-sm">
        <div>
          <h4 className="font-semibold mb-2">Cara Mengukur</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Dada:</span> Ukur
              melingkar di bagian dada paling penuh, pastikan pita meteran tetap
              sejajar.
            </li>
            <li>
              <span className="font-medium text-foreground">Panjang:</span> Ukur
              dari titik pundak tertinggi sampai ke ujung bawah pakaian.
            </li>
            <li>
              <span className="font-medium text-foreground">Bahu:</span> Ukur
              dari ujung bahu satu ke ujung bahu lainnya melewati punggung.
            </li>
            <li>
              <span className="font-medium text-foreground">Lengan:</span> Ukur
              dari sambungan bahu hingga ujung manset.
            </li>
          </ul>
        </div>

        <div className="bg-secondary/50 p-4 rounded-lg">
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Catatan:</span> Hoodie
            ini berpotongan oversized. Jika ingin tampilan lebih pas, pilih satu
            ukuran lebih kecil.
          </p>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="w-full rounded-t-3xl px-6 pb-6 gap-0">
          <DrawerHeader>
            <DrawerTitle className="text-2xl font-bold">
              Panduan Ukuran
            </DrawerTitle>
            <p className="text-sm text-muted-foreground">
              Semua pengukuran dalam sentimeter (cm)
            </p>
          </DrawerHeader>
          <div className="overflow-y-auto px-1">{guideContent}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Panduan Ukuran</DialogTitle>
          <DialogDescription>
            Semua pengukuran dalam sentimeter (cm)
          </DialogDescription>
        </DialogHeader>
        {guideContent}
      </DialogContent>
    </Dialog>
  );
};

export default SizeGuideDialog;

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
};
