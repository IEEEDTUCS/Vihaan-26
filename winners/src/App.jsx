import Background from "./components/Background";
import WinnersSection from "./components/Winners/winnerSection";

function App() {
  return (
    <div className="relative min-h-screen bg-[#0d0d0d] overflow-hidden">
      <Background />

      <div className="relative z-10">
        <WinnersSection />
      </div>
    </div>
  );
}

export default App;