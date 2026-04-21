import PolicyTemplate from "@/components/PolicyTemplate";

export default function ReturnsPolicy() {
  return (
    <PolicyTemplate 
      title="Return Policy" 
      lastUpdated="March 26, 2026"
      content={
         <div className="space-y-6">
          <h2 className="text-2xl text-white font-bold">Cancellation Period (Module 11)</h2>
          <p>If you're unhappy with your item, you can initiate a return directly from the Customer Dashboard via the unified Return system.</p>
          <p>Items can only be rejected/refunded if they meet our Return criteria: within 7 days of the "Delivered" timestamp.</p>
          <h2 className="text-2xl text-white font-bold mt-8">Supplier Returns</h2>
          <p>Vastra culture automatically refunds your original payment option (driven by Razorpay refunds setup). Items marked as returned will deduct corresponding funds from the Supplier dashboard during the periodic payout phase.</p>
        </div>
      }
    />
  );
}
