import { motion } from "framer-motion";

interface HttpHeader {
  k: string;
  v: string;
}

interface HttpCardProps {
  kind: "request" | "response";
  /** The start line, e.g. "GET / HTTP/2" or "200 OK". */
  start: string;
  headers: HttpHeader[];
  /** Optional body, e.g. the HTML document. */
  body?: string;
  note?: string;
}

/**
 * An HTTP message — request or response — as plain, readable text: a start line,
 * a few headers, and an optional body. This is the language the web speaks once
 * the secure, reliable channel is open.
 */
export function HttpCard({ kind, start, headers, body, note }: HttpCardProps) {
  return (
    <div className="httpcard">
      <div className={"httpcard-title " + (kind === "request" ? "is-req" : "is-res")}>
        {kind === "request" ? "HTTP request →" : "← HTTP response"}
      </div>
      <motion.div
        className={"http-start " + (kind === "request" ? "is-req" : "is-res")}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {start}
      </motion.div>
      <div className="http-headers">
        {headers.map((h, i) => (
          <motion.div
            key={h.k}
            className="http-header"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 + i * 0.07 }}
          >
            <span className="hh-key mono">{h.k}:</span>
            <span className="hh-val mono">{h.v}</span>
          </motion.div>
        ))}
      </div>
      {body && (
        <motion.pre
          className="http-body mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {body}
        </motion.pre>
      )}
      {note && <p className="httpcard-note">{note}</p>}
    </div>
  );
}
