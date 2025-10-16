import { Card } from "@/components/ui/card";
import rubbishPlaceholder from "../pages/rubbishPlaceholder.jpg";

const RecentPhoto = () => {
  return (
    <Card className="p-6 h-full">
      <h3 className="text-xl font-bold mb-4">Recent Photo</h3>
      
      <div className="bg-muted rounded-lg aspect-[4/3] flex items-center justify-center overflow-hidden">
        <img 
          src={ rubbishPlaceholder } 
          alt="Recent photo from monitoring tower"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="mt-4 text-sm text-muted-foreground">
        <p>Captured: {new Date().toLocaleString()}</p>
      </div>
    </Card>
  );
};

export default RecentPhoto;
