import { useState, useEffect } from 'eact';
import { useRouter } from 'next/router';
import { useSocket } from '../hooks/useSocket';

const RoomPage = () => {
  const router = useRouter();
  const { roomId } = router.query;
  const [userName, setUserName] = useState('');
  const [users, setUsers] = useState([]);
  const [votingOpen, setVotingOpen] = useState(false);
  const [votes, setVotes] = useState({});
  const socket = useSocket();

  useEffect(() => {
    socket.emit('joinRoom', roomId);
  }, [roomId, socket]);

  useEffect(() => {
    socket.on('users', (users: any) => {
      setUsers(users);
    });

    socket.on('votingOpen', () => {
      setVotingOpen(true);
    });

    socket.on('vote', (vote: any) => {
      setVotes((prevVotes: any) => ({...prevVotes, [vote.userId]: vote.value }));
    });

    socket.on('votingClosed', () => {
      setVotingOpen(false);
    });
  }, [socket]);

  const handleSetName = (name: any) => {
    setUserName(name);
    socket.emit('setName', name);
  };

  const handleOpenVoting = () => {
    socket.emit('openVoting');
  };

  const handleVote = (value: any) => {
    socket.emit('vote', value);
  };

  const handleShowResults = () => {
    socket.emit('showResults');
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="max-w-md p-4 bg-white rounded shadow-md">
        <h1 className="text-3xl font-bold mb-4">Sala {roomId}</h1>
        {userName? (
          <div>
            <p>Bienvenido, {userName}!</p>
            <ul>
              {users.map((user: any) => (
                <li key={user.id}>{user.name}</li>
              ))}
            </ul>
            {votingOpen? (
              <div>
                <p>Votación abierta</p>
                <ul>
                  {Object.keys(votes).map((userId) => (
                    <li key={userId}>{users.find((user: any) => user.id === userId).name} votó {votes[userId]}</li>
                  ))}
                </ul>
                <button
                  onClick={handleShowResults}
                  className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                >
                  Mostrar resultados
                </button>
              </div>
            ) : (
              <div>
                <p>Votación cerrada</p>
                <button
                  onClick={handleOpenVoting}
                  className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                >
                  Abrir votación
                </button>
                <ul>
                  {[1, 3, 5, 8, 13].map((value) => (
                    <li key={value}>
                      <button
                        onClick={() => handleVote(value)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                      >
                        {value}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-2 pl-10 text-sm text-gray-700"
            placeholder="Ingresa tu nombre"
          />
        )}
      </div>
    </div>
  );
};

export default RoomPage;
