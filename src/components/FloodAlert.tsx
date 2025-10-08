import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";

const FloodAlert = () => {
  // Mock data - in production this would come from your tower API
  const [floodLevel, setFloodLevel] = useState<number>(2.5);
  const dangerThreshold = 4.0;
  const isDanger = floodLevel >= dangerThreshold;
  
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-6">Flood Alert</h2>
      
      <Card className={`p-8 text-center transition-all duration-500 ${
        isDanger 
          ? "bg-destructive/10 border-destructive" 
          : "bg-success/10 border-success"
      }`}>
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-4 ${
              isDanger ? "bg-destructive/20" : "bg-success/20"
            }`}>
              <span className={`text-5xl font-bold ${
                isDanger ? "text-destructive" : "text-success"
              }`}>
                {floodLevel.toFixed(1)}m
              </span>
            </div>
          </div>
          
          <p className="text-lg text-muted-foreground mb-2">
            Current Water Level
          </p>
          
          <div className={`inline-block px-6 py-3 rounded-full font-semibold text-lg ${
            isDanger 
              ? "bg-destructive text-destructive-foreground" 
              : "bg-success text-success-foreground"
          }`}>
            {isDanger ? "⚠️ DANGER - Flood Warning" : "✓ SAFE - Normal Conditions"}
          </div>
          
          <p className="mt-4 text-sm text-muted-foreground">
            Threshold: {dangerThreshold}m • Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </Card>
    </section>
  );
};

export default FloodAlert;
