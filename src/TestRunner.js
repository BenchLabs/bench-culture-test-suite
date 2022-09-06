import { useEffect, useState } from 'react';
import rawPrinciples from './principles';

const augmentPrinciples = (raw) => {
  return raw.reduce((aug, principle) => {
    const {name, axioms} = principle;
    aug.push({
      name,
      axioms: axioms.map(str => ({ str, testResult: undefined })),
    })
    return aug;
  }, []);
}


function TestRunner() {
  const [principles, setPrinciples] = useState(augmentPrinciples(rawPrinciples));
  const [activePrinciple, setActivePrinciple] = useState(0);
  const [activeAxiom, setActiveAxiom] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const downHandler = (event) => {
      switch(event.key) {
        case 'a': 
          recordResult('passed');
          break;
        case 's': 
          recordResult('unsure');
          break;
        case 'd': 
          recordResult('failed');
          break;
        case 'ArrowRight': 
          recordResult('N/A');
          break;
        case 'ArrowUp': 
          event.preventDefault()
          navigateUp();
          break;
        case 'ArrowDown': 
          event.preventDefault()
          if (getActiveResult()) navigateDown();
          break;
        case 'Escape':
          setPrinciples(augmentPrinciples(rawPrinciples));
          setActivePrinciple(0);
          setActiveAxiom(0);
          setDone(false);
          break;
      }
    }
    window.addEventListener('keydown', downHandler);
    return () => window.removeEventListener("keydown", downHandler);
  });

  const getActiveResult = () => principles[activePrinciple].axioms[activeAxiom].testResult;

  const recordResult = (result) => {
    const updatedPrinciples = principles.map(({name, axioms}, i) => (
      {
        name,
        axioms: axioms.map((axiom, j) => {
          const {str, testResult} = axiom;
          if (i === activePrinciple && j === activeAxiom) {
            return { str, testResult: result };
          }
          return axiom;
        }),
      }
    ));
    setPrinciples(updatedPrinciples);
    navigateDown();
  }

  const navigateUp = () => {
    if (activeAxiom > 0) {
      setActiveAxiom(activeAxiom - 1);
    } else {
      if (activePrinciple === 0) return;
      setActivePrinciple(activePrinciple - 1);
      setActiveAxiom(principles[activePrinciple - 1].axioms.length - 1); 
    }
  }

  const navigateDown = () => {
    const totalPrinciples = principles.length;
    const axiomsInActivePrinciple = principles[activePrinciple].axioms.length;
    const currentResult = principles[activePrinciple][activeAxiom];

    if (activeAxiom < axiomsInActivePrinciple - 1) {
      setActiveAxiom(activeAxiom + 1);
    } 
    else if (activeAxiom >= axiomsInActivePrinciple - 1 && activePrinciple >= totalPrinciples - 1) {
      setDone(true);
      setActiveAxiom(activeAxiom + 1);
    }
    else {
      setActivePrinciple(activePrinciple+1);
      setActiveAxiom(0);
    }
  }

  const tallyByType = (type) => {
    const resultsArray = principles.map(({axioms}) => axioms).flat();
    return resultsArray.reduce((total, {testResult}) => {
      if (testResult === type) return total + 1;
      return total;
    }, 0);
  }

  const calculateConsistencyScore = () => {
    const resultsArray = principles.map(({axioms}) => axioms).flat().filter(({testResult}) => testResult !== 'N/A');
    return resultsArray.reduce((total, {testResult}) => {
      if (testResult === 'passed') return total + 2;
      if (testResult === 'unsure') return total + 1;
      return total;
    }, 0);
  }

  const calculateMaxConsistencyScore = () => {
    const resultsArray = principles.map(({axioms}) => axioms).flat().filter(({testResult}) => testResult !== 'N/A');
    return resultsArray.length * 2;
  }

  const getGrade = () => {
    const percent = calculateConsistencyScore() / calculateMaxConsistencyScore() * 100;
    if (percent >= 95) return 'A+';
    if (percent >= 87) return 'A';
    if (percent >= 80) return 'A-';
    if (percent >= 77) return 'B+';
    if (percent >= 74) return 'B';
    if (percent >= 70) return 'B-';
    if (percent >= 67) return 'C+';
    if (percent >= 64) return 'C';
    if (percent >= 60) return 'C-';
    if (percent >= 57) return 'D+';
    if (percent >= 54) return 'D';
    if (percent >= 50) return 'D-';
    return 'F';
  }

  return (
    <div className="test-runner">
      {
        principles.map(({name, axioms}, i) => (
          <div key={name} className={`principle ${activePrinciple === i ? 'active' : ''} ${done ? 'done' : ''}`}>
            <h2>{name}</h2>
            <ol>
              {
                axioms.map(({ str, testResult }, j) => {
                  const isActive = activePrinciple === i && activeAxiom === j;
                  return (
                    <li 
                      className={`axiom ${isActive ? 'active' : ''} ${done ? 'done' : ''}`}
                      key={str}
                    > 
                      {str}
                      { isActive ? 
                        <span>: <span class="blinking-cursor">&nbsp;</span></span> :
                        testResult && <span className={testResult === 'N/A' ? 'na' : testResult}> {testResult.toUpperCase()}</span>
                      }
                    </li>
                  ); 
                  })
              }
            </ol>
          </div>
        ))
      }
      {
        done && (
          <div>
            <span className="failed">{tallyByType('failed')} failed</span>,&nbsp;
            <span className="unsure">{tallyByType('unsure')} unsure</span>,&nbsp;
            <span className="passed">{tallyByType('passed')} passed</span>,&nbsp;
            <span className="na">{tallyByType('N/A')} not applicable</span><br/>
            <span className="consistency-score">Consistency score: {calculateConsistencyScore()}/{calculateMaxConsistencyScore()} — Grade: {getGrade()}</span>
          </div>
        )
        
      }
    </div>
  );
}

export default TestRunner;