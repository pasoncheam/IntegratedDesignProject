import { Card } from "@/components/ui/card";

const LocationMap = () => {
  // Klang River coordinates (approximate)
  const latitude = 3.0738;
  const longitude = 101.5183;
  
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-6">Location</h2>
      
      <Card className="overflow-hidden">
        <div className="w-full h-[500px] bg-muted relative">
          <iframe
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15935.5!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwMDQnMjUuNyJOIDEwMcKwMzEnMDUuOSJF!5e0!3m2!1sen!2smy!4v1234567890`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="AURA Tower Location"
          />
        </div>
      </Card>
    </section>
  );
};

export default LocationMap;
