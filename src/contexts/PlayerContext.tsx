import {createContext, useState, ReactNode} from 'react'


type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    togglePlay: () => void;
    playNext: () => void;
    playPrevious: () => void;
    setPlayingState: (state: boolean) => void;
    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void;
}

type PlayerContextProviderProps = {
  children: ReactNode
}


export const PlayerContext = createContext({} as PlayerContextData)

export function PlayerContextProvider ({children}: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([])
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
    const [isPlaying, setPlaying] = useState(false)
    
    const play = (episode: Episode) => {
      setEpisodeList([episode])
      setCurrentEpisodeIndex(0)
      setPlaying(true)
    }  
    
    const playList = (list: Episode[], index: number) => {
      setEpisodeList(list)
      setCurrentEpisodeIndex(index)
      setPlaying(true)
    }  
    
    const togglePlay = () => {
      setPlaying(!isPlaying)
    }
  
    const setPlayingState = (state: boolean) =>{
      setPlaying(state)
    }
    
    const playNext = () => {
      const nextEpisodeIndex = currentEpisodeIndex + 1
      
      if (nextEpisodeIndex < episodeList.length){
        setCurrentEpisodeIndex(nextEpisodeIndex)
      }
      
    }

    const playPrevious = () => {
      if (currentEpisodeIndex > 0){
        setCurrentEpisodeIndex(currentEpisodeIndex - 1)
      }
    }
  
    return (
      <PlayerContext.Provider value={{episodeList, currentEpisodeIndex, isPlaying, togglePlay, setPlayingState, play, playList, playNext, playPrevious}}>
       {children}
      </PlayerContext.Provider>
    );
  }