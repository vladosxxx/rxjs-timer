import './App.css';
import { useState, useEffect } from 'react'
import {fromEvent, merge, interval, NEVER} from "rxjs";
import {buffer, debounceTime, filter, mapTo, startWith, tap, switchMap, scan} from "rxjs/operators";


function App() {
    const [allSeconds, setAllseconds] = useState(0)
    const [seconds, setSeconds] = useState()
    const [minutes, setMinutes] = useState()
    const [hours, setHours] = useState()

    useEffect(() => {
        const clickPause$ = fromEvent(document.querySelector('#wait'), 'click');
        const from2Clicks = (id, obj) => clickPause$
            .pipe(
                buffer(clickPause$.pipe(debounceTime(300))),
                filter(clickArray => clickArray.length > 1),
                mapTo(obj)
            )
        const clickStart$ = fromEvent(document.querySelector('#start'), 'click');
        const fromStart= (id, obj) => clickStart$
            .pipe(
                mapTo(obj)
            )
        const clickReset$ = fromEvent(document.querySelector('#reset'), 'click');
        const fromReset = (id, obj) => clickReset$
            .pipe(
                mapTo(obj)
            )
        const setValue = (val) => setAllseconds(val)
        const events$ =
            merge(
                fromStart('start', { count: true }),
                from2Clicks('wait', { count: false }),
                fromReset('reset', { count: true, value: 0 }),
            );

        const stopWatch$ = events$.pipe(
            startWith({ count: false, speed: 1000, value: 0, increase: 1 }),
            scan((state, curr) => ({ ...state, ...curr }), {}),
            tap((state) => state.value),
            switchMap((state) => state.count
                ? interval(state.speed)
                    .pipe(
                        tap(_ => state.value += state.increase),
                        tap(_ => setValue(state.value))
                    )
                : NEVER)
    );
        stopWatch$.subscribe()
    }, [])

    useEffect(() => {
        setHours(('0' + Math.floor(allSeconds / 60 / 60)).slice(-2))
        setMinutes(('0' + Math.floor(allSeconds / 60)).slice(-2))
        setSeconds(('0' + allSeconds % 60).slice(-2))
    }, [allSeconds])

  return (
    <div className="App">
        <h1>{hours}:{minutes}:{seconds}</h1>

        <button className="start-stop" id="start" >Start</button>
        <button className="wait" id="wait">Wait</button>
        <button className="reset" id="reset">Reset</button>
    </div>
  );
}

export default App;
