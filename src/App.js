import './App.css';
import { useState, useEffect } from 'react'
import {fromEvent, timer} from "rxjs";
import {buffer, throttleTime, filter, map,take} from "rxjs/operators";

const stream$ = timer(0,1000)
stream$.pipe(
    map(i => i),
    take(9),
    filter(v => v < 10 ),
)

function App() {
    const [allSeconds, setAllSeconds] = useState(0)
    const [seconds, setSeconds] = useState()
    const [minutes, setMinutes] = useState()
    const [hours, setHours] = useState()
    const [isWait, setWait] = useState(false)
    const [isStart, setStart] = useState(false)


    const startStop = () => {
        if(isWait === true){
            stream$.unsubscribe()
            setStart(!isStart)
            setWait(false)
        }
        else
        {
            stream$.subscribe(res => setSeconds(res))
            setStart(!isStart)
            setAllSeconds(0)
        }
        if(isStart === true){
            stream$.clean()
        }
    }
    const reset = () => {
        setAllSeconds(0)
        setStart(false)
        setWait(false)
    }


    useEffect(() => {
        const clicks$ = fromEvent(document.querySelector('.wait'), 'click');
        clicks$
            .pipe(
                buffer(clicks$.pipe(throttleTime(300))),
                filter(clickArray => clickArray.length > 1)
            )
            .subscribe(() => alert('Double Click!'));
    }, [] )


    useEffect(() => {
        setHours(('0' + Math.floor(allSeconds / 60 / 60)).slice(-2))
        setMinutes(('0' + Math.floor(allSeconds / 60)).slice(-2))
        setSeconds(('0' + allSeconds % 60).slice(-2))
    }, [allSeconds])

  return (
    <div className="App">
        <h1>{hours}:{minutes}:{seconds}</h1>

        <button className="start-stop" onClick={startStop}>start/stop</button>
        <button className="reset" onClick={reset}>reset</button>
        <button className="wait">wait</button>
    </div>
  );
}

export default App;
