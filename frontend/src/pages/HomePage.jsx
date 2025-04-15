import { useState } from "react";
import GurusSection from "../components/sections/GurusSection";
import ExpertsSection from "../components/sections/ExpertsSection";

function HomePage() {
  const [experts, setExperts] = useState([]);

  return (
    <div>
      <GurusSection setExperts={setExperts} />
      <ExpertsSection experts={experts} />
    </div>
  );
}

export default HomePage;
