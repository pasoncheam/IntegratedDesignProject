import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type FloodAlertProps = {
  waterLevel: number; // meters
  timestamp?: number; // epoch ms or millis()
};

const FloodAlert = ({ waterLevel, timestamp }: FloodAlertProps) => {
  // const dangerThreshold = 4.0; // Keeping logic if needed for other things, but unused for styling now

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-3xl font-bold">Water Level Reading</h2>
        <Dialog>
          <DialogTrigger asChild>
            <button className="inline-flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2">
              <Info className="h-5 w-5 text-muted-foreground" />
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Water Level Information</DialogTitle>
              <DialogDescription>
                Details about how water level is measured and interpreted.
              </DialogDescription>
            </DialogHeader>
            <div className="text-sm text-muted-foreground">
              {/* Placeholder content */}
              <p>Water level readings are taken from the sensor installed at the monitoring station. This metric indicates the current height of the water surface relative to a fixed datum.</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-8 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-4 bg-primary/20">
              <span className="text-5xl font-bold text-primary">
                {waterLevel.toFixed(1)}m
              </span>
            </div>
          </div>

          <p className="text-lg text-muted-foreground mb-2">
            Current Water Level
          </p>

          {/*<p className="mt-4 text-sm text-muted-foreground">
            Threshold: {dangerThreshold}m • Last updated: {timestamp ? new Date(timestamp >= 1_000_000_000_000 ? timestamp : timestamp).toLocaleString() : "—"}
          </p>*/}
        </div>
      </Card>
    </section>
  );
};

export default FloodAlert;
