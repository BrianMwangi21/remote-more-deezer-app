"use client"

import Image from 'next/image';
import { DeezerAlbum, DeezerArtist, DeezerTrack } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ArtistPage({ params }: { params: { artistId: string } }) {
  const [artist, setResultsArtist] = useState<DeezerArtist>();
  const [topTracks, setResultsTopTracks] = useState<DeezerTrack[]>([]);
  const [albums, setResultsAlbums] = useState<DeezerAlbum[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | any>(null);

  useEffect(() => {
    const makeArtistRequest = async (query: string) => {
      setLoading(true);
      try {
        const responseArtist = await axios.get(`https://cors-anywhere.herokuapp.com/https://api.deezer.com/artist/${query}`);
        const responseTopTracks = await axios.get(`https://cors-anywhere.herokuapp.com/https://api.deezer.com/artist/${query}/top`);
        const responseAlbums = await axios.get(`https://cors-anywhere.herokuapp.com/https://api.deezer.com/artist/${query}/albums`);
        setResultsArtist(responseArtist.data);
        setResultsTopTracks(responseTopTracks.data.data);
        setResultsAlbums(responseAlbums.data.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }
    makeArtistRequest(params.artistId)
  }, [params.artistId])

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  return (
    <main className="bg-white flex min-h-screen flex-col items-center gap-6 p-4">

      <p className="w-full text-4xl font-bold flex justify-center text-center place-items-center text-[#5057ea]">
        Reezer by Kabiru
      </p>

      {loading && (
        <div role="flex flex-row">
          <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
        </div>
      )}

      {error && (
        <p className="w-full text-xl font-normal flex justify-center text-center place-items-center text-red-500">
          Something went wrong. Please try again
        </p>
      )}

      {artist && topTracks && albums && !loading && (
        <div className="container-fluid w-full flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative w-full md:w-8/12 h-96">
              <Image
                fill
                src={artist.picture_big}
                className="object-cover w-full h-24"
                alt="Picture of the artist"
              />
              <div className="absolute top-0 z-10 w-full h-full bg-black opacity-50 flex flex-col gap-2 justify-center place-items-center">
                <p className="text-white text-6xl font-bold">{artist.name}</p>
                <p className="text-white text-md font-semibold">{artist.nb_fan.toLocaleString()} fans worldwide!</p>
              </div>
            </div>
            <div className="relative w-full flex flex-col p-4 justify-start md:w-4/12 h-fit md:h-96">
              <p className="text-black text-2xl font-bold">Top Tracks</p>
              {topTracks && (
                <div className="flex flex-col divide-y">
                  {topTracks.map((track, index) => {
                    return (
                      <div key={index} className="p-2 flex flex-row gap-2 justify-between md:transform md:transition md:duration-150 md:hover:cursor-pointer md:hover:scale-105 md:hover:bg-gray-100">
                        <p className="text-black text-md">{index + 1}</p>
                        <p className="text-black text-md flex-1 font-bold">{track.title}</p>
                        <p className="text-black text-md">{formatDuration(track.duration)}</p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-black text-2xl font-bold">Albums</p>

            {albums && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 md:grid-cols-4 w-full">
                {albums.map((album, index) => {
                  return (
                    <a key={index} className="relative flex flex-col gap-2 justify-start rounded-md border-[0.1px] border-gray-200 md:hover:cursor-pointer md:hover:scale-105 md:transform md:duration-150">
                      <div className="w-full h-72 overflow-hidden">
                        <Image
                          fill
                          src={album.cover_big}
                          alt={album.title}
                          className="object-cover rounded-t-md"
                        />
                      </div>

                      <div className="flex flex-col p-4 text-black z-10 bg-white absolute w-full bottom-0">
                        <p className="text-lg font-bold truncate">{album.title}</p>
                        <p className="text-lg font-bold">{album.release_date.split("-")[0]}</p>
                      </div>
                    </a>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

    </main>
  )
}
