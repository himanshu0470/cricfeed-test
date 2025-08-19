import Image from "next/image";
import defaultPlayerImage from '../../../assets/default-player.avif'
import defaultPlayerjersy from '../../../assets/default-jersy.png'

export default function PlayerImage({ width, playerImage, playername, jerseyImage, className = '' }: any) {

  function isValidLink(string: string | URL) {
    try {
      new URL(string);

      return true;
    } catch (e) {
      return false;
    }
  }
  return (
    <div className="relative" style={{ width: "30px", height: "32px", borderRadius: "5px", background: '#f3f4f6' }}>
      {isValidLink(playerImage) && (
        <Image
          src={playerImage === null ? defaultPlayerImage : playerImage}
          alt="Player"
          width={30}
          height={30}
          className="absolute inset-0 rounded object-cover "
        />
      )}
      {isValidLink(jerseyImage) && <div className="absolute inset-0 pt-4">
        <Image
          src={jerseyImage ? jerseyImage : defaultPlayerjersy}
          alt="Jersey"
          width={30}
          height={30}
          className="rounded object-cover pt-1.5 z-10"
        />
      </div>}
    </div>
  );
}