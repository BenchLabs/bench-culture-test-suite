import './App.css';
import TestRunner from './TestRunner';

function App() {
  return (
    <div className="App">
      <header className="header">
        <h1>Bench TPD Culture Test Suite</h1>
        <div className="controls">
          <ul>
            <li><strong>A:</strong> Pass</li>
            <li><strong>S:</strong> Unsure</li>
            <li><strong>D:</strong> Fail</li>
          </ul>
          <ul>
            <li><strong>RIGHT:</strong>&nbsp;Not Applicable</li>
            <li><strong>DOWN:</strong>&nbsp;&nbsp;Move Down</li>
            <li><strong>UP:</strong>&nbsp;&nbsp;&nbsp;&nbsp;Move Up</li>
          </ul>
          <ul>
            <li><strong>ESC:</strong> Restart</li>
          </ul>
        </div>
      </header>
      <TestRunner />
    </div>
  );
}

export default App;
