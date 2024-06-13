import { useState } from 'react'
import logoSpotify from './assets/Spotify_icon.svg'
import SpotifyCard from './component/SpotifyCard'
import noneSong from './assets/noneSong.jpg'
import Error from './component/Error'


function App() {
  const [spotifyLink,setSpotifyLink] = useState("");
  const [error,setError] = useState(null);
  const defaultValue =  {
    'trackName':"Track name",
    'trackArtist':"Track Artist",
    'trackCover' :noneSong,
    "prediction":""
  };
  const [songInfo,setSongInfo] = useState(defaultValue);

  const handleSubmit =(e) =>{
    e.preventDefault();
    if(spotifyLink !=""){
      getSongData(spotifyLink);
    }
  }

  const getSongData = async (spotifyLink)=>{
    try{
      const res = await fetch('/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ spotifyLink }),
      });

      const data = await res.json();
      console.log(data);
      setSongInfo(data);
    }catch(err){
      setError("The link is invalid!");
      setInterval(()=>{setError(null)},3000);
    }
  }



 return(
  <div className='flex justify-center px-16 items-center min-h-screen bg-black/50 text-white gap-2'>
    <SpotifyCard songInfo={songInfo}/>
    <div className='w-2/3'>
      <div className=' flex justify-center items-center gap-2 '>
        <img className='max-w-12' src={logoSpotify} />
        <p className=' font-black text-3xl'>SpotyIA</p>
      </div>

      <p className=' font-julius text-center  text-xl'>Uncover the Rhythm</p>
      <p className=' text-center font-light text-sm my-4'>
        Discover the rhythms that shape the musical universe with our interactive genre prediction tool. Upload any song, and our machine learning algorithms will analyze its audio features to unveil its true genre, providing you with an immersive exploration of the intricate patterns and relationships that define the vast tapestry of music genres.
      </p>

      <div className='flex flex-col justify-center gap-8 items-center mt-8 mx-16'>
        <input
          className='p-3 w-full text-black ring-0 rounded-md border-0 outline-none'
          placeholder='Past a spotify track link eg. https://open.spotify.com/track/4KULAymBBJcPRpk1yO4dOG'
          type="text"
          value={spotifyLink}
          onChange={(e)=>setSpotifyLink(e.target.value)}
        />
        
        {error && <Error text={error}/>}
        
        <button
          className="rounded-lg border border-white py-3 px-6 text-center font-sans text-xs font-bold uppercase text-white transition-all hover:opacity-75"
          type="button"
          onClick={handleSubmit}
        >Predect</button>

        <p className=' font-bold'>Genre prediction : <span >{songInfo.prediction}</span></p>
      
      </div>
    </div>
  </div>
 )
}

export default App
