import { motion } from "framer-motion";

interface NameCardProps {
  /** A domain name such as "www.google.com". */
  name: string;
}

/** Classify a label by its position from the right: TLD, domain, or host. */
function partClass(indexFromRight: number): string {
  if (indexFromRight === 0) return "is-tld";
  if (indexFromRight === 1) return "is-domain";
  return "is-host";
}

/**
 * Breaks a domain name into its dotted hierarchy and colour-codes each label:
 * the top-level domain (.com), the registered domain (google), and the host
 * (www). Read right-to-left, it goes from the broadest group to one machine —
 * the structure that lets DNS scale.
 */
export function NameCard({ name }: NameCardProps) {
  const labels = name.split(".");
  const last = labels.length - 1;

  return (
    <div className="namecard">
      <div className="namecard-title">A domain name</div>
      <div className="namecard-parts">
        {labels.map((label, i) => (
          <span key={i} className="namecard-partwrap">
            <motion.span
              className={"name-part " + partClass(last - i)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
            >
              {label}
            </motion.span>
            {i < last && <span className="name-dot">.</span>}
          </span>
        ))}
      </div>
      <div className="namecard-legend">
        <span className="name-lg is-host">host — a machine</span>
        <span className="name-lg is-domain">domain — the organization</span>
        <span className="name-lg is-tld">TLD — the broad group</span>
      </div>
      <p className="namecard-note">
        Read right → left, it narrows from a whole group (<strong>.com</strong>) to one
        organization (<strong>google</strong>) to a single machine (<strong>www</strong>).
      </p>
    </div>
  );
}
