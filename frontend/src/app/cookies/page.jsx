import PolicyTemplate from "@/components/PolicyTemplate";

export default function CookiePolicy() {
  return (
    <PolicyTemplate 
      title="Cookie Policy" 
      lastUpdated="March 26, 2026"
      content={
         <div className="space-y-6">
          <h2 className="text-2xl text-white font-bold">1. Cookie Usage</h2>
          <p>Local storage constraints map JWT keys necessary for the authentication modules securing your role endpoints (`admin`, `supplier`, `customer`).</p>
          <p>Cache persistence is mandatory. Rejecting tokens will cause standard operations requiring verified endpoints per Vastra culture modules to fail.</p>
        </div>
      }
    />
  );
}
