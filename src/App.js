import './App.css';
import Footer from './Components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown, faPlay, faPause, faRefresh } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState, useRef } from 'react';


function App() {

  const DEF_BREAK_TIME = 300
  const DEF_SESSION_TIME = 3
  const [breakTime, setBreakTime] = useState(DEF_BREAK_TIME)
  const [sessionTime, setSessionTime] = useState(DEF_SESSION_TIME)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [seconds, setSeconds] = useState(sessionTime)
  const [currentMode, setCurrentMode] = useState("Session")
  const timerId = useRef()
  const audioRef = useRef()
  // let animationTimer

  useEffect(() => {
    if (seconds < 0) {
      clearInterval(timerId.current)
      setIsTimerActive(false)
      changeMode()
    }
  }, [seconds])

  useEffect(() => {
    if (currentMode === "Session" && !isTimerActive) {
      setSeconds(sessionTime)
    } else if (currentMode === "Break" && !isTimerActive) {
      setSeconds(breakTime)
    }
  }, [breakTime, sessionTime, currentMode, isTimerActive])

  function startTimer(newIsTimerActive) {
    console.log(newIsTimerActive === true);
    if (newIsTimerActive === true || !isTimerActive) {
      setIsTimerActive(true)
      timerId.current = setInterval(() => {
        setSeconds(prevValue => prevValue - 1)
      }, 1000);
    }
  }

  function parseTime(sec) {
    const remainingSeconds = sec % 60
    const remainingMinutes = Math.trunc(sec / 60)
    return `${remainingMinutes > 9 ? remainingMinutes : "0" + remainingMinutes}:${remainingSeconds > 9 ? remainingSeconds : "0" + remainingSeconds}`
  }

  function pauseTimer() {
    clearInterval(timerId.current)
    setIsTimerActive(false)
  }

  function resetTimer() {
    pauseTimer()
    setBreakTime(DEF_BREAK_TIME)
    setSessionTime(DEF_SESSION_TIME)
    if (seconds) {
      setSeconds(currentMode === "Session" ? DEF_SESSION_TIME : DEF_BREAK_TIME)
    }
    audioRef.current.pause()
    audioRef.current.currentTime = 0
  }

  function changeMode() {
    console.log("ALARM! ALAAAAHAAARM!");
    audioRef.current.volume = 0.5
    audioRef.current.play()
    if (currentMode === "Session") {
      setCurrentMode("Break")
      setSeconds(breakTime)
      setIsTimerActive(true)
      startTimer(true)
    } else {
      setCurrentMode("Session")
      setSeconds(sessionTime)
      setIsTimerActive(true)
      startTimer(true)
    }
    // animate()
  }

  // function animate() {
  //   setX("timer-div blinkThreeTimes")
  //   animationTimer = setInterval(() => {
  //     setX("timer-div")
  //   }, 3000);
  //   console.log("animationTimer: " + animationTimer + "| timer: " + timerId.current);
  // }

  // const [x, setX] = useState("timer-div")
  return (
    <div className="App">
      <main>
        <h1 className='title'>Pomodoro Timer</h1>
        <div className="tomato">
          <div className="options-div">
            <div className='session-div'>
              <p id='session-label' className='text'>Session Length</p>
              <span>
                <button id="session-decrement" className='clickable white' onClick={() => setSessionTime(prevTime => prevTime > 60 ? prevTime - 60 : 60)} name="session"><FontAwesomeIcon icon={faArrowDown} size="xl" /></button>
                <p className='time'>{parseTime(sessionTime)}</p>
                <button id="session-increment" className='clickable white' onClick={() => setSessionTime(prevTime => prevTime < 5400 ? prevTime + 60 : 5400)} name="session"><FontAwesomeIcon icon={faArrowUp} size="xl" /></button>
              </span>
            </div>
            <div className='break-div'>
              <p id="break-label" className='text'>Break Length</p>
              <span>
                <button id="break-decrement" className='clickable white' onClick={() => setBreakTime(prevTime => prevTime > 60 ? prevTime - 60 : 60)} name="break"><FontAwesomeIcon icon={faArrowDown} size="xl" /></button>
                <p className='time'>{parseTime(breakTime)}</p>
                <button id="break-increment" className='clickable white' onClick={() => setBreakTime(prevTime => prevTime < 5400 ? prevTime + 60 : 5400)} name="break"><FontAwesomeIcon icon={faArrowUp} size="xl" /></button>
              </span>
            </div>
          </div>
          <div className="timer-div">
            <p id="timer-label" className='text'>{`Currently: ${currentMode}`}</p>
            <p id="time-left" className="time">{parseTime(seconds)}</p>
            <span>
              {!isTimerActive ? <FontAwesomeIcon id="start_stop" className="clickable option" icon={faPlay} onClick={startTimer} size="xl" />
                : <FontAwesomeIcon id="start_stop" className="clickable option" icon={faPause} onClick={pauseTimer} size="xl" />}
              <FontAwesomeIcon id="reset" className="clickable option" icon={faRefresh} onClick={resetTimer} size="xl" />
            </span>
            <audio id="beep" ref={audioRef} src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
