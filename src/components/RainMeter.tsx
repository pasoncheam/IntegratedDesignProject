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

type RainMeterProps = {
  rainfall: number; // mm current
  last24h?: number; // optional aggregate
};

const RainMeter = ({ rainfall, last24h = 0 }: RainMeterProps) => {

  return (
    <Card className="p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Rain Meter Reading</h3>
        <Dialog>
          <DialogTrigger asChild>
            <button className="inline-flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2">
              <Info className="h-4 w-4 text-muted-foreground" />
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rainfall Information</DialogTitle>
              <DialogDescription>
                Details about how rainfall is measured.
              </DialogDescription>
            </DialogHeader>
            <div className="text-sm text-muted-foreground space-y-2">
              <div>
                <p className="font-semibold">Hourly Rainfall (mm):</p>
                <ul className="list-disc pl-4">
                  <li>Light: 1-10</li>
                  <li>Moderate: 11-30</li>
                  <li>Heavy: 31-60</li>
                  <li>Very Heavy: &gt;60</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold">Daily Rainfall (mm):</p>
                <ul className="list-disc pl-4">
                  <li>Slight: &lt;50</li>
                  <li>Moderate: 50-99</li>
                  <li>Heavy: 100-149</li>
                  <li>Intense: &ge;150</li>
                </ul>
              </div>
              <div className="pt-2 text-xs border-t">
                <p className="font-semibold mb-1">Sources:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li><a href="https://publicinfobanjir.water.gov.my/hujan/data-hujan/?state=WLH&lang=en" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">PublicInfoBanjir Rainfall</a></li>
                  <li><a href="https://www.met.gov.my/data/research/researchpapers/2024/TN01_2024.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">MET Malaysia (TN01 2024)</a></li>
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-data-bg rounded-lg p-8 text-center">
        <div className="mb-6">
          <div className="text-5xl font-bold text-primary mb-2">
            {rainfall.toFixed(2)}
            <span className="text-2xl ml-1 text-muted-foreground">mm</span>
          </div>
          <p className="text-sm text-muted-foreground">Current Rainfall</p>
        </div>

        <div className="border-t border-border pt-4">
          <div className="text-2xl font-semibold text-foreground mb-1">
            {last24h.toFixed(2)} mm
          </div>
          <p className="text-sm text-muted-foreground">Last 24 Hours</p>
        </div>


      </div>
    </Card>
  );
};

export default RainMeter;
