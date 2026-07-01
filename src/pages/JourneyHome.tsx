import { Link } from "react-router-dom";

export function JourneyHome() {
  return (
    <div className="journey-home">
      <div className="home-stage">
        <h1 className="home-title">Build the internet from one computer up.</h1>
        <Link className="btn btn--primary home-start" to="/chapter/what-is-a-computer">
          Start
        </Link>
      </div>
    </div>
  );
}
