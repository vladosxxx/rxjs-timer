import React, {useState, useEffect} from 'react'
import './App.css';
import TimerComponent from './components/TimerComponent'

function App() {
    const [seconds, setSeconds] = useState(0)
    const [minutes, setMinutes] = useState(0)
    const [hours, setHours] = useState(0)

    useEffect(() => {

    })
  return (
    <div className="App">

      <TimerComponent/>
    </div>
  );
}

export default App;
