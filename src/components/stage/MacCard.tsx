import { motion } from "framer-motion";

/**
 * Visualizes a MAC address: 6 hex octets, split into the manufacturer prefix
 * (OUI) and the unique device portion.
 */
export function MacCard({ mac }: { mac: string }) {
  const octets = mac.split(":");
  return (
    <div className="maccard">
      <div className="maccard-title">A MAC address</div>
      <div className="maccard-octets">
        {octets.map((o, i) => (
          <span key={i} className="maccard-octwrap">
            <motion.span
              className={"mac-oct " + (i < 3 ? "is-oui" : "is-dev")}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
            >
              {o}
            </motion.span>
            {i < octets.length - 1 && <span className="mac-colon">:</span>}
          </span>
        ))}
      </div>
      <div className="maccard-legend">
        <span className="mac-lg is-oui">First 3 octets — manufacturer (OUI)</span>
        <span className="mac-lg is-dev">Last 3 octets — unique device ID</span>
      </div>
      <p className="maccard-note">
        48 bits · burned into the network card at the factory · globally unique
      </p>
    </div>
  );
}
