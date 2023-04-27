import React, { useEffect, useRef, useState } from "react";

import "./App.css";
import lyrics from "./lyrics";

const App = () => {
  const [speed, setSpeed] = useState(Number(localStorage.getItem("speed")) || 70);
  const [size, setSize] = useState(Number(localStorage.getItem("size")) || 10);
  const [isClosed, setIsClosed] = useState(false);
  const [nowPlaying, setNowPlaying] = useState(-1);
  const [toRED, setToRED] = useState(JSON.parse(localStorage.getItem("toRED")) || false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  const getCurrentTime = () => {
    const currentTimer = Math.floor(audioRef.current.currentTime);
    setCurrentTime(currentTimer);
  };

  useEffect(() => {
    console.log(currentTime);
  }, [currentTime]);

  useEffect(() => {
    setInterval(getCurrentTime, 100);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem("speed", speed);
  }, [speed]);

  const setDisplaySize = () => {
    document.documentElement.style.setProperty("--v", windowWidth > 600 ? `${size / 10 * 6}px` : "1vmin");
    localStorage.setItem("size", size);
  };
  setDisplaySize();
  useEffect(setDisplaySize, [size, windowWidth]);

  useEffect(() => {
    if(toRED) {
      document.documentElement.style.setProperty("--red", "255, 0, 0");
      document.documentElement.style.setProperty("--white", "255, 255, 0");
    }
    else{
      document.documentElement.style.setProperty("--red", "0, 0, 0");
      document.documentElement.style.setProperty("--white", "255, 255, 255");
    }
    localStorage.setItem("toRED", toRED);
  }, [toRED]);

  const synth = window.speechSynthesis;
  const Speak = (index) => {
    synth.cancel();
    if(!("speechSynthesis" in window)) {
      alert("이 브라우저는 음성 합성을 지원하지 않습니다.");
      setNowPlaying(-1);
      return;
    }
    if(index === -1) return;
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = lyrics[index].chinese;
    if(!lyrics[index].chinese) {
      setNowPlaying(-1);
      return;
    }
    utterance.lang = "zh-CN";
    utterance.rate = speed / 100;
    const supportZH = synth.getVoices().some(voice => /^zh-CN/.test(voice.lang));
    if(!supportZH) {
      alert("이 브라우저는 중국어 음성 합성을 지원하지 않습니다.");
      setNowPlaying(-1);
      return;
    }
    synth.speak(utterance);
    utterance.onend = () => {
      setNowPlaying(-1);
    };
  };

  const getClassName = (index, number) => {
    const op1 = `lcc lyc${number} lcplay`;
    const op0 = `lcc lyc${number}`;

    const thisTime = Number(lyrics[index].endTime.split(":")[0] * 60) + Number(lyrics[index].endTime.split(":")[1]);
    let prevTime = Number(lyrics[index - 1]?.endTime.split(":")[0] * 60) + Number(lyrics[index - 1]?.endTime.split(":")[1]);
    if(!prevTime) prevTime = 0;

    if(prevTime < currentTime && currentTime <= thisTime) return op1;
    if(nowPlaying === index) return op1;
    else return op0;
  };

  const getDivClassName = (index) => {
    const thisTime = Number(lyrics[index].endTime.split(":")[0] * 60) + Number(lyrics[index].endTime.split(":")[1]);
    let prevTime = Number(lyrics[index - 1]?.endTime.split(":")[0] * 60) + Number(lyrics[index - 1]?.endTime.split(":")[1]);
    if(!prevTime) prevTime = 0;

    if(prevTime < currentTime && currentTime <= thisTime) return "lyc lcnow";
    else return "lyc";
  };

  return (
    <div className="App">
      <div className="top" style={{
        transform: isClosed ? "translateY(-100%)" : "translateY(0%)",
      }}>
        <div className="title" onClick={() => setToRED(!toRED)}>小幸运 (Xiǎo xìngyùn)</div>
        <div className="speedCheck">
          <div>속도 조절</div>
          <input 
            type="range" 
            min="1" max="100" 
            value={speed} 
            className="slider" 
            onChange={(e) => setSpeed(e.target.value)}
          />
          <div>{speed}%</div>
        </div>
        {/* <div className="speedCheck">
          <div>크기 조절</div>
          <input 
            type="range" 
            min="10" max="30" 
            value={size} 
            className="slider" 
            onChange={(e) => setSize(e.target.value)}
          />
          <div>{(size/10).toFixed(1)}배</div>
        </div> */}
        <div className="close" onClick={() => {
          setIsClosed(!isClosed);
        }}></div>
      </div>
      <div 
        className="down" 
        style={{
          transform: isClosed ? "translateY(0%)" : "translateY(-100%)",
        }}
        onClick={() => {
          setIsClosed(!isClosed);
        }}
      ></div>
      
      <div className="lycdiv" style={{
        transform: isClosed ? "translateY(calc(var(--v) * 0))" : "translateY(calc(var(--v) * 20))",
      }}>
        {
          lyrics.map((lyric, index) => {
            return (
              <div 
                key={index} 
                className={getDivClassName(index)}
              >
                <div 
                  className="playbutton" 
                  onClick={() => {
                    let prevTime = Number(lyrics[index - 1]?.endTime.split(":")[0] * 60) + Number(lyrics[index - 1]?.endTime.split(":")[1]);
                    if(!prevTime) prevTime = 0;
                    audioRef.current.currentTime = prevTime + 1;
                    audioRef.current.play();
                  }}></div>
                <div 
                  className={getClassName(index, 1)} 
                  onClick={() => {
                    setNowPlaying(index);
                    Speak(index);
                  }}>{lyric.chinese}</div>
                <div 
                  className={getClassName(index, 2)} 
                  onClick={() => {
                    setNowPlaying(index);
                    Speak(index);
                  }}>{lyric.IPA}</div>
                <div 
                  className={getClassName(index, 3)} 
                  onClick={() => {
                    setNowPlaying(index);
                    Speak(index);
                  }}>{lyric.korean}</div>
              </div>
            );
          })
        }
      </div>
      <a className="github" href="https://github.com/jeamin-0927/XiaoXingyun">깃허브임 이거보는 개발자 PR할 수 있으면 부탂!!</a>

      <div className="aud">
        <audio controls className="audio" ref={audioRef}>
          <source src="audio.mp3" type="audio/mpeg" />
        </audio>
      </div>
    </div>
  );
};

export default App;
