import { motion } from "framer-motion";

interface IpCardProps {
  ip: string;
  /** Prefix length (e.g. 24). Determines how many leading octets are the network part. */
  prefix: number;
}

/**
 * Visualizes an IPv4 address as four octets split into a *network* part and a
 * *host* part. Unlike a flat MAC address, an IP address names which network a
 * device lives on — like a postal address naming the street and the house.
 */
export function IpCard({ ip, prefix }: IpCardProps) {
  const octets = ip.split(".");
  const networkOctets = Math.round(prefix / 8);

  return (
    <div className="ipcard">
      <div className="ipcard-title">An IP address</div>
      <div className="ipcard-octets">
        {octets.map((o, i) => (
          <span key={i} className="ipcard-octwrap">
            <motion.span
              className={"ip-oct " + (i < networkOctets ? "is-net" : "is-host")}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
            >
              {o}
            </motion.span>
            {i < octets.length - 1 && <span className="ip-dot">.</span>}
          </span>
        ))}
        <span className="ip-prefix mono">/{prefix}</span>
      </div>
      <div className="ipcard-legend">
        <span className="ip-lg is-net">Network part — which network</span>
        <span className="ip-lg is-host">Host part — which computer on it</span>
      </div>
      <p className="ipcard-note">
        Like a postal address: the <strong>network</strong> is the street, the{" "}
        <strong>host</strong> is the house number. The <strong>/{prefix}</strong> says where the
        split falls.
      </p>
    </div>
  );
}
