import { motion } from "framer-motion";

interface CertCardProps {
  /** Who the certificate is issued to, e.g. "google.com". */
  subject: string;
  /** The Certificate Authority that signed it, e.g. "GTS CA 1C3". */
  issuer: string;
  validTo?: string;
  /** Whether the signature checks out. */
  status?: "valid" | "invalid";
  note?: string;
}

/**
 * A TLS certificate card: the server's digital ID. It binds a name to a public
 * key and is signed by a Certificate Authority the browser already trusts —
 * which is how the browser knows it's really talking to google.com.
 */
export function CertCard({ subject, issuer, validTo, status = "valid", note }: CertCardProps) {
  const ok = status === "valid";
  const fields = [
    { key: "Issued to", value: subject, cls: "c-subject" },
    { key: "Issued by", value: issuer, cls: "c-issuer" },
    { key: "Valid until", value: validTo ?? "—", cls: "c-valid" },
  ];

  return (
    <div className="certcard">
      <div className="certcard-title">TLS certificate</div>
      <div className="certcard-fields">
        {fields.map((f, i) => (
          <motion.div
            key={f.key}
            className={"cert-field " + f.cls}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <span className="cf-key">{f.key}</span>
            <span className="cf-val mono">{f.value}</span>
          </motion.div>
        ))}
      </div>
      <motion.div
        className={"cert-badge" + (ok ? " is-ok" : " is-bad")}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.36, type: "spring", stiffness: 300, damping: 20 }}
      >
        {ok ? "✓ Signature verified by a trusted CA" : "✗ Signature does not match — untrusted"}
      </motion.div>
      {note && <p className="certcard-note">{note}</p>}
    </div>
  );
}
