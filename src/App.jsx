import { useState, useEffect } from "react";
import clap from "./assets/Clap.mp3"
import closedHH from "./assets/Closed-HH.mp3"
import heater1 from "./assets/Heater-1.mp3"
import heater2 from "./assets/Heater-2.mp3"
import heater3 from "./assets/Heater-3.mp3"
import heater4 from "./assets/Heater-4.mp3"
import kickNHat from "./assets/Kick-n-Hat.mp3"
import kick from "./assets/Kick.mp3"
import openHH from "./assets/Open-HH.mp3"
import chord1 from "./assets/Chord-1.mp3"
import chord2 from "./assets/Chord-2.mp3"
import chord3 from "./assets/Chord-3.mp3"
import shaker from "./assets/Shaker.mp3"
import punchyKick from "./assets/Punchy-Kick.mp3"
import sideStick from "./assets/Side-Stick.mp3"
import snare from "./assets/Snare.mp3"

function App() {
  const [activeButton, setActiveButton] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [volume, setVolume] = useState(0.3);
  const [powerOn, setPowerOn] = useState(true);
  const [whichBank, setWhichBank] = useState(false);
  const buttons = [['Q', 'W', 'E'], ['A', 'S', 'D'], ['Z', 'X', 'C']]
  const soundsL = {
    Q: heater1,
    W: heater2,
    E: heater3,
    A: heater4,
    S: clap,
    D: openHH,
    Z: kickNHat,
    X: kick,
    C: closedHH
  };
  const soundsR = {
    Q: chord1,
    W: chord2,
    E: chord3,
    A: shaker,
    S: openHH,
    D: closedHH,
    Z: punchyKick,
    X: sideStick,
    C: snare
  }
  const displayTags = {
    [chord1]: 'Chord 1',
    [chord2]: 'Chord 2',
    [chord3]: 'Chord 3',
    [clap]: 'Clap',
    [closedHH]: 'Closed HH',
    [heater1]: 'Heater 1',
    [heater2]: 'Heater 2',
    [heater3]: 'Heater 3',
    [heater4]: 'Heater 4',
    [kick]: 'Kick',
    [kickNHat]: "Kick 'n Hat",
    [openHH]: 'Open HH',
    [punchyKick]: 'Punchy Kick',
    [shaker]: 'Shaker',
    [sideStick]: 'Side Stick',
    [snare]: 'Snare'
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [powerOn, whichBank, volume]);

  const handlePowerChange = () => {
    if (powerOn) {
      setDisplayText("")
    }
    setPowerOn(!powerOn);
  }

  const handleBankChange = () => {
    setWhichBank(!whichBank);
  }

  function handleKeyDown(e) {
    if (!powerOn) {
      return
    }
    buttonTrigger(e.key.toUpperCase());
  }

  const onMouseDown = (buttonID) => {
    buttonTrigger(buttonID);
  }

  function buttonTrigger(button) {
    setActiveButton(button);
    const bank = whichBank ? soundsR : soundsL;
    if (bank[button]) {
      setDisplayText(displayTags[bank[button]]);
      play(bank[button]);
    } else if (button === '-') {
      handleVolumeDecrement();
    } else if (button === '=' || button === '+') {
      handleVolumeIncrement();
    }
    setTimeout(() => {
      setActiveButton('')
    }, 120);
  }

  const handleRangeInputChange = (event) => {
    const value = event.target.value;
    handleVolumeChange(value);
  }

  const handleVolumeIncrement = () => {
    if (volume < 1) {
      handleVolumeChange(volume + 0.1);
    }
  }

  const handleVolumeDecrement = () => {
    if (volume > 0) {
      handleVolumeChange(volume - 0.1);
    }
  }

  function handleVolumeChange(value) {
    value = Math.round(value * 100) / 100;
    setVolume(value);
    setDisplayText('Volume: ' + value * 100);
  }

  function play(sound) {
    const audio = new Audio(sound);
    audio.volume = volume;
    audio.play();
  }

  return (
    <div id='page' onKeyDown={handleKeyDown}>
      <div id='drum-machine' className={powerOn ? '' : 'disabled'}>
        <div id='drum-console'>
          {buttons.map((buttonRow, rowIndex) => (
            <div className='row' key={rowIndex}>
              {buttonRow.map((buttonID) => (
                <button
                  id={buttonID}
                  key={buttonID}
                  className={`drum-pad ${
                    activeButton === buttonID ? 'active' : ''
                  } ${
                    powerOn ? '' : 'disabled'
                  }`}
                  onMouseDown={() => onMouseDown(buttonID)}
                  disabled={!powerOn}
                >
                  {buttonID}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div id='control-panel'>
          <p className='control-label'>Power</p>
          <input
            type='checkbox'
            id='switch-1'
            className="switch"
            checked={powerOn}
            onChange={handlePowerChange}
          />
          <label htmlFor='switch-1'>Toggle</label>
          <div id='display' className={powerOn ? '' : 'disabled'}>
            <p>{displayText}</p>
          </div>
          <input
            type='range'
            id='volume' 
            min='0'
            max='1'
            step='0.1'
            value={volume}
            onChange={handleRangeInputChange}
            disabled={!powerOn} />
          <p className='control-label'>Bank</p>
          <input
            type='checkbox'
            id='switch-2'
            className="switch"
            checked={whichBank}
            onChange={handleBankChange}
            disabled={!powerOn}
          />
          <label htmlFor='switch-2'>Toggle</label>
        </div>
      </div>
      <p className='instructions'>To adjust volume, use the '+' and '-' keys.</p>
    </div>
  );
} 
   

export default App;