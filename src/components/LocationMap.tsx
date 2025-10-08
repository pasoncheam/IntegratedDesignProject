import { Card } from "@/components/ui/card";

const LocationMap = () => {
  // Kuala Lumpur coordinates (58200 Kuala Lumpur)
  const latitude = 3.0915096;
  const longitude = 101.6726635;
  
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-6">Location of Deployment</h2>
      
      <Card className="overflow-hidden">
        <div className="w-full h-[500px] bg-muted relative">
          <iframe
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.123456789!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc4a4809f974db%3A0x39c524f21001982b!2s58200%20Kuala%20Lumpur%2C%20Federal%20Territory%20of%20Kuala%20Lumpur!5e0!3m2!1sen!2smy!4v1234567890`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="AURA Monitoring Station - Kuala Lumpur Location"
          />
        </div>
      </Card>
    </section>
  );
};

export default LocationMap;
