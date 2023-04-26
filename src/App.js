import React, { useEffect, useState } from "react";

import "./App.css";
import lyrics from "./lyrics";

const App = () => {
  const [speed, setSpeed] = useState(Number(localStorage.getItem("speed")) || 70);
  const [isClosed, setIsClosed] = useState(false);
  const [nowPlaying, setNowPlaying] = useState(-1);
  const [toRED, setToRED] = useState(JSON.parse(localStorage.getItem("toRED")) || false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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

  useEffect(() => {
    document.documentElement.style.setProperty("--v", windowWidth > 600 ? "6px" : "1vmin");
  }, [windowWidth]);

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
                className="lyc"
                onClick={() => {
                  setNowPlaying(index);
                  Speak(index);
                }}
              >
                <div className={nowPlaying === index ? "lcc lyc1 lcplay" : "lcc lyc1"}>{lyric.chinese}</div>
                <div className={nowPlaying === index ? "lcc lyc2 lcplay" : "lcc lyc2"}>{lyric.IPA}</div>
                <div className={nowPlaying === index ? "lcc lyc3 lcplay" : "lcc lyc3"}>{lyric.korean}</div>
              </div>
            );
          })
        }

        <div className="aud">
          <audio controls className="audio">
            <source src="audio.mp3" type="audio/mpeg" />
          </audio>
        </div>
      </div>
    </div>
  );
};

export default App;
