import './App.css';
import { useState, useEffect } from 'react'
import { interval, fromEvent } from 'rxjs'
import { map, debounceTime, buffer, filter } from 'rxjs/operators'

function App() {
    const [allSeconds, setAllSeconds] = useState(0)
    const [seconds, setSeconds] = useState()
    const [minutes, setMinutes] = useState()
    const [hours, setHours] = useState()
    const [isWait, setWait] = useState(false)
    const [isStart, setStart] = useState(false)

    const startStop = () => {
        if(isWait === true){
            setStart(!isStart)
            setWait(false)
        }
        else
        {
            setStart(!isStart)
            setAllSeconds(0)
        }
    }
    const reset = () => {
        setAllSeconds(0)
        setStart(false)
        setWait(false)
        setTimeout(() => setStart(true), 500)
    }
    const wait = () => {
        setStart(false)
    }

    useEffect(() => {
        if(isStart === true)
        {
            const stream$ = interval(1000).pipe(map(i => allSeconds + i))
            const subscription = stream$
                .subscribe(i =>
                    setAllSeconds(i)
                );
            return () => subscription.unsubscribe();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isStart] )

    useEffect(() => {
        const mouse$ = fromEvent(document.querySelector('.wait'), 'click')
        const buff$ = mouse$.pipe(
            debounceTime(300),
        )
        const click$ = mouse$.pipe(
            buffer(buff$),
            map(list => {
            return list.length;
            }),
            filter(x => x === 2),
        )
        click$.subscribe(() => {
            wait()
            setWait(true)
        }
        )
        return () => {
            buff$.unsubscribe()
        }
    }, [])

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
