import './App.css';

export default function App() {
  return (
    <main className="app">
      <header className="app__header">
        <h1 className="app__title">Sorting Algorithm Visualizer</h1>
        <p className="app__subtitle">
          An interactive tool for exploring and understanding classic sorting algorithms.
        </p>
      </header>

      <section className="app__stage">
        {/* Placeholder for BarChart */}
        <div className="placeholder-box">Bar Chart Area</div>
      </section>

      <section className="app__controls">
        {/* Placeholder for ControlBar */}
        <div className="placeholder-box">Control Bar Area</div>
      </section>

      <aside className="app__panels">
        {/* Placeholders for StatsPanel and ComplexityCard */}
        <div className="placeholder-box">Stats Panel Area</div>
        <div className="placeholder-box">Complexity Card Area</div>
      </aside>
    </main>
  );
}
