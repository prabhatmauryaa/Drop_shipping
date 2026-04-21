import PolicyTemplate from "@/components/PolicyTemplate";

export default function ShippingPolicy() {
  return (
    <PolicyTemplate 
      title="Shipping Information" 
      lastUpdated="March 26, 2026"
      content={
         <div className="space-y-6">
          <h2 className="text-2xl text-white font-bold">Logistics & Handling (Module 8)</h2>
          <p>We work exclusively with high-tier local delivery networks implementing fast-track route fulfillment automatically when Fast Delivery parameters are hit.</p>
          <p>Orders typically dispatch within 1-2 business days, and the automated forwarded systems relay tracking codes identically across our Vastra culture hub.</p>
          <h2 className="text-2xl text-white font-bold mt-8">Pre-Dispatch Editing (Module 9)</h2>
          <p>Users may alter delivery destinations via their Customer portal pending Order log status retaining `Forwarded` or `Pending`.</p>
        </div>
      }
    />
  );
}
