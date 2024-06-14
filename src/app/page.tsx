'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const IndexPage = () => {
  const [roomName, setRoomName] = useState('');
  const router = useRouter();

  const handleCreateRoom = async () => {
    const response = await fetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: roomName }),
    });

    const roomId = await response.json();
    router.push(`/rooms/${roomId}`);
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="max-w-md p-4 bg-white rounded shadow-md">
        <h1 className="text-3xl font-bold mb-4">Crear sala</h1>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="w-full p-2 pl-10 text-sm text-gray-700"
          placeholder="Nombre de la sala"
        />
        <button
          onClick={handleCreateRoom}
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
        >
          Crear sala
        </button>
      </div>
    </div>
  );
};

export default IndexPage;
