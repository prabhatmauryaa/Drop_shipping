import PolicyTemplate from "@/components/PolicyTemplate";

export default function PrivacyPolicy() {
  return (
    <PolicyTemplate 
      title="Privacy Policy" 
      lastUpdated="March 26, 2026"
      content={
        <div className="space-y-6">
          <h2 className="text-2xl text-white font-bold">1. Data Collection</h2>
          <p>We collect essential information like your name, email, billing address, and transaction logs. Secure authentication via JWT guarantees that all Vastra culture usage is confidential. We do not sell your personal data to non-participating third-body ecosystems.</p>
          
          <h2 className="text-2xl text-white font-bold mt-8">2. Third-Party Integrations</h2>
          <p>By executing secure payments via Razorpay (Module 10), Vastra culture integrates API calls requiring data sharing matching the payment execution standard PCI DSS norms.</p>
          
          <h2 className="text-2xl text-white font-bold mt-8">3. Communication</h2>
          <p>Vastra culture Automated Notification handler (Module 14) will occasionally use your email format to SMS/Email delivery logs and tracking URLs. Opt-outs can be managed inside `/dashboard/settings`.</p>
        </div>
      }
    />
  );
}
