import { useContext, useRef, useEffect, useState } from "react";
import { usePlayer } from "../../contexts/PlayerContext";
import styles from "./styles.module.scss";
import Image from "next/image";
import Slider from "rc-slider";

import "rc-slider/assets/index.css";
import { SSL_OP_MICROSOFT_SESS_ID_BUG } from "node:constants";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

export default function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0)
  
  function setupProgressListener () {
    audioRef.current.currentTime = 0

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime))
    })
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount
    setProgress(amount)
  }

  function handleEpisodeEnd () {
    if(hasNext) {
      playNext()
    } else {
      clearPlayerState()
    }
  }

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    toggleLoop,
    togglePlay,
    toggleShuffle,
    setPlayingState,
    playNext,
    playPrevious,
    hasPrevious,
    hasNext,
    clearPlayerState
  } = usePlayer();

  const episode = episodeList[currentEpisodeIndex];

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="tocando agora" />
        <strong>Tocando agora {episode?.title}</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit={"cover"}
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ""}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: "#84d361" }}
                railStyle={{ backgroundColor: "#9f75ff" }}
                handleStyle={{ borderColor: "#84d361", borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            autoPlay
            ref={audioRef}
            loop={isLooping}
            onEnded={handleEpisodeEnd}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
          />
        )}

        <div className={styles.buttons}>
          <button 
          type="button"
          disabled={!episode || episodeList.length === 1}
          onClick={toggleShuffle}
          className={isShuffling ? styles.isActive : ''}
          >
            <img src="/shuffle.svg" alt="tocar aleatório" />
          </button>
          <button type="button" disabled={!episode || !hasPrevious}>
            <img
              src="/play-previous.svg"
              onClick={playPrevious}
              alt="tocar anterior"
            />
          </button>
          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <img src="/pause.svg" alt="tocar próximo" />
            ) : (
              <img src="/play.svg" alt="tocar próximo" />
            )}
          </button>
          <button type="button" disabled={!episode || !hasNext}>
            <img src="/play-next.svg" onClick={playNext} alt="tocar anterior" />
          </button>
          <button
            type="button"
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ""}
          >
            <img src="/repeat.svg" alt="repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}
