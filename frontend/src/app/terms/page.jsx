import PolicyTemplate from "@/components/PolicyTemplate";

export default function TermsOfService() {
  return (
    <PolicyTemplate 
      title="Terms of Service" 
      lastUpdated="March 26, 2026"
      content={
         <div className="space-y-6">
          <h2 className="text-2xl text-white font-bold">1. Service Definition</h2>
          <p>Vastra culture is an ecommerce dropshipping software bridging individual sellers and inventory holding suppliers through automated order logistics, unified syncing, and quality control.</p>
          <h2 className="text-2xl text-white font-bold mt-8">2. Pricing Liabilities</h2>
          <p>Users participating in Enterprise or Pro roles agree to auto-billing charges per the Tier selected. Razorpay guarantees transparent invoicing schemas.</p>
          <h2 className="text-2xl text-white font-bold mt-8">3. Conduct Standards</h2>
          <p>Suppliers found creating dummy inventories will fail stock checks resulting in automated account suspensions.</p>
        </div>
      }
    />
  );
}
