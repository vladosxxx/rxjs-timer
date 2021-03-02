import './App.css';
import {useState, useEffect} from 'react'
import { interval } from 'rxjs'
import { map } from 'rxjs/operators'
// import { $ } from "react-rxjs-elements";

function App() {
    const [seconds, setSeconds] = useState(300)
    const [isSecondsShow, setSecondsShow] = useState()
    const [minutes, setMinutes] = useState()
    const [hours, setHours] = useState()

    const [isStart, setStart] = useState(false)

    const startStop = () => {
        setStart(!isStart)
        setSeconds(300)
    }
    const reset = () => {
        setStart(true)
    }
    const wait = () => {
        setStart(!isStart)
    }
    useEffect(() => {
        setHours(Math.floor(seconds / 60 / 60))
        setMinutes(Math.floor(seconds / 60))
        setSecondsShow(seconds % 60)
        if(isStart === true)
        {

            const stream$ = interval(1000).pipe(map(i => seconds - i))
            const subscription = stream$
                .subscribe(i =>
                    setSeconds(i)

                );

            return () => subscription.unsubscribe();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isStart] )


  return (
    <div className="App">
        <span>hr{hours}</span>
        <span>min{minutes}</span>
        <span>sec{isSecondsShow}</span>
        <button onClick={startStop}>start/stop</button>
        <button onClick={reset}>reset</button>
        <button onClick={wait}>reset</button>
    </div>
  );
}

export default App;
