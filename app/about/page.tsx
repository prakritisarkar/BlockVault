export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-24">
      <div className="max-w-5xl mx-auto space-y-12">
        <h1 className="text-4xl md:text-6xl font-bold">
          About BlockVault
        </h1>

        <p className="text-gray-400 text-lg leading-relaxed">
          BlockVault is a trustless, on-chain credit scoring system designed
          to eliminate over-collateralization in DeFi. Instead of relying on
          centralized credit bureaus, BlockVault uses AI-driven analysis and
          cryptographic storage proofs to verify a user’s financial history.
        </p>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">The Core Problem</h2>
          <p className="text-gray-400 leading-relaxed">
            Smart contracts have no memory. They can only see the current state
            of the blockchain. They cannot verify whether a user survived
            previous market crashes, repaid loans responsibly, or maintained
            healthy collateral ratios.
          </p>
          <p className="text-gray-400 leading-relaxed">
            As a result, DeFi protocols require excessive collateral,
            immobilizing billions in capital and preventing efficient lending.
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Our Approach</h2>
          <p className="text-gray-400 leading-relaxed">
            BlockVault combines:
          </p>
          <ul className="text-gray-400 space-y-2 list-disc pl-6">
            <li>AI-powered behavioral analysis</li>
            <li>Rust-based cryptographic proof generation</li>
            <li>On-chain verification via smart contracts</li>
          </ul>
          <p className="text-gray-400 leading-relaxed">
            The result is a verifiable, trustless reputation system that enables
            under-collateralized lending while preserving decentralization.
          </p>
        </div>
      </div>
    </div>
  );
}