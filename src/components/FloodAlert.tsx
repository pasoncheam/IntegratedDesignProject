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

// show the big water level number and warning
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
            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>Station:</strong> Sg. Klang At Jambatan Petaling</p>
              <p className="text-xs text-muted-foreground/80">(Lat: 3.080844, Long: 101.663764)</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="p-2 rounded bg-emerald-100 dark:bg-emerald-900/30">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">Normal</span>
                  <div className="text-lg">14.00 m</div>
                </div>
                <div className="p-2 rounded bg-yellow-100 dark:bg-yellow-900/30">
                  <span className="font-semibold text-yellow-700 dark:text-yellow-400">Alert</span>
                  <div className="text-lg">16.81 m</div>
                </div>
                <div className="p-2 rounded bg-orange-100 dark:bg-orange-900/30">
                  <span className="font-semibold text-orange-700 dark:text-orange-400">Warning</span>
                  <div className="text-lg">17.81 m</div>
                </div>
                <div className="p-2 rounded bg-red-100 dark:bg-red-900/30">
                  <span className="font-semibold text-red-700 dark:text-red-400">Danger</span>
                  <div className="text-lg">18.81 m</div>
                </div>
              </div>
              <div className="pt-2 text-xs border-t">
                <p className="font-semibold mb-1">Sources:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li><a href="https://publicinfobanjir.water.gov.my/wl-graph/?stationid=26519&lang=en" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">PublicInfoBanjir Station 26519</a></li>
                  <li><a href="https://mywater.gov.my/Portal/Modules/Telemetri/Index.aspx?Q=DGQF08iEj5A=" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">MyWater Telemetry</a></li>
                </ul>
              </div>
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
