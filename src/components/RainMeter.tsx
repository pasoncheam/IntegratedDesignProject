import { Card } from "@/components/ui/card";

type RainMeterProps = {
  rainfall: number; // mm current
  last24h?: number; // optional aggregate
};

const RainMeter = ({ rainfall, last24h = 0 }: RainMeterProps) => {

  return (
    <Card className="p-6 h-full">
      <h3 className="text-xl font-bold mb-4">Rain Meter Reading</h3>

      <div className="bg-data-bg rounded-lg p-8 text-center">
        <div className="mb-6">
          <div className="text-5xl font-bold text-primary mb-2">
            {rainfall}
            <span className="text-2xl ml-1 text-muted-foreground">mm</span>
          </div>
          <p className="text-sm text-muted-foreground">Current Rainfall</p>
        </div>

        <div className="border-t border-border pt-4">
          <div className="text-2xl font-semibold text-foreground mb-1">
            {last24h} mm
          </div>
          <p className="text-sm text-muted-foreground">Last 24 Hours</p>
        </div>


      </div>
    </Card>
  );
};

export default RainMeter;
