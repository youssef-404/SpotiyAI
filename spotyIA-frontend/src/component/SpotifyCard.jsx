import songPLayer from "../assets/songPlayer.svg"


export default function SpotifyCard({songInfo}){

    return(
        <div className="relative flex min-w-1/3 flex-col justify-center overflow-hidden p-6 rounded-xl shadow-lg shadow-white/30">
            <div className="z-10 flex flex-col gap-4 justify-center items-center">
                <div className="border border-white/20">
                    <img src={songInfo.trackCover} alt="track cover" />
                </div>
                <div className=" self-start">
                    <p className="text-base">{songInfo.trackName}</p>
                    <p className="text-xs">{songInfo.trackArtist}</p>
                </div>
                <div>
                    <img src={songPLayer} alt="song Player" />
                </div>
            </div>
      </div>

    )
}