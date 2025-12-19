import { Card } from "@/components/ui/card";

type FloodAlertProps = {
  waterLevel: number; // meters
  timestamp?: number; // epoch ms or millis()
};

const FloodAlert = ({ waterLevel, timestamp }: FloodAlertProps) => {
  // const dangerThreshold = 4.0; // Keeping logic if needed for other things, but unused for styling now

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-6">Water Level Reading</h2>

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
