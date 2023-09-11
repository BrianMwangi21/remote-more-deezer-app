"use client"

import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { useState } from "react";
import Image from 'next/image';
import { DeezerSearch } from "@/types";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [results, setResults] = useState<DeezerSearch[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | any>(null);

  const makeRequest = async (query: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://cors-anywhere.herokuapp.com/https://api.deezer.com/search?q=${query}`);
      setResults(response.data.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }

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
      <p className="w-full text-xl font-normal flex justify-center text-center place-items-center text-[#5057ea]">
        Get the latest info on different tracks, songs and albums
      </p>

      <div>
        <div className="relative mt-2 rounded-md shadow-sm w-full md:w-96">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            name="search"
            id="search"
            value={searchQuery}
            className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Jay-Z, Central Cee..."
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                makeRequest(searchQuery)
                setSearchQuery("")
              }
            }}
          />
        </div>
      </div>

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

      {results && !loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 md:grid-cols-4 w-full">
          {results.map((result, index) => {
            return (
              <a key={index} className="relative flex flex-col gap-2 justify-start rounded-md border-[0.1px] border-gray-200 md:hover:cursor-pointer md:hover:scale-105 md:transform md:duration-150" href={`/artist/${result.artist.id}`}>
                <div className="w-full h-80 overflow-hidden">
                  <Image
                    fill
                    src={result.album.cover_big}
                    alt={result.title}
                    className="object-cover rounded-t-md"
                  />
                </div>

                <div className="flex flex-col p-4 text-black z-10 bg-white absolute w-full bottom-0">
                  <p className="text-sm">{formatDuration(result.duration)}</p>
                  <p className="text-lg font-bold truncate">{result.title}</p>
                  <p className="text-sm">By: <strong>{result.artist.name}</strong></p>
                  <p className="text-sm min-h-[40px] truncate">Album: <strong>{result.album.title}</strong></p>
                </div>
              </a>
            )
          })}
        </div>
      )}

    </main>
  )
}
