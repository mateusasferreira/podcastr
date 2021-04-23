import Header from "../components/Header";
import Player from "../components/Player";

import "../styles/global.scss";
import styles from "../styles/app.module.scss";
import { PlayerContext } from "../contexts/PlayerContext";
import { useState } from "react";

function MyApp({ Component, pageProps }) {
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setPlaying] = useState(false)
  
  const play = (episode) => {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setPlaying(true)
  }  
  
  const togglePlay = () => {
    setPlaying(!isPlaying)
  }

  const setPlayingState = (state: boolean) => {
    setPlaying(state)
  }

  return (
    <PlayerContext.Provider value={{episodeList, currentEpisodeIndex, isPlaying, togglePlay, setPlayingState, play}}>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContext.Provider>
  );
}

export default MyApp;
