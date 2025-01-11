'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Flight = {
  _id: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  price: number;
  date: string;
  startTime: string;
  endTime: string;
  availableSeats: number;
};

export default function Flights() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const router = useRouter();

  const fetchFlights = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      let url = 'https://flight-back.vercel.app/api/v1/flight';
      const params = new URLSearchParams();
      if (searchTerm) params.append('searchTerm', searchTerm);
      if (origin) params.append('origin', origin);
      if (destination) params.append('destination', destination);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      const data = await response.json();

      console.log('API Response:', data.data.data);

      if (response.ok && Array.isArray(data.data.data)) {
        setFlights(data.data.data);
      } else {
        setFlights([]);
        console.error('Failed to fetch flights:');
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching flights:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, [searchTerm, origin, destination]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Flight Management</h1>
      <div className="mb-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by flight number or airline"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="p-2 border rounded"
        />
      </div>
      <Link href="/flights/create" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
        Add New Flight
      </Link>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Flight Number</th>
              <th className="px-4 py-2">Airline</th>
              <th className="px-4 py-2">Origin</th>
              <th className="px-4 py-2">Destination</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Start Time</th>
              <th className="px-4 py-2">End Time</th>
              <th className="px-4 py-2">Available Seats</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={10} className="border px-4 py-2 text-center">
                  Loading...
                </td>
              </tr>
            ) : flights?.length > 0 ? (
              flights?.map((flight,index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{flight.flightNumber}</td>
                  <td className="border px-4 py-2">{flight.airline}</td>
                  <td className="border px-4 py-2">{flight.origin}</td>
                  <td className="border px-4 py-2">{flight.destination}</td>
                  <td className="border px-4 py-2">${flight.price}</td>
                  <td className="border px-4 py-2">{new Date(flight.date).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">{new Date(flight.startTime).toLocaleTimeString()}</td>
                  <td className="border px-4 py-2">{new Date(flight.endTime).toLocaleTimeString()}</td>
                  <td className="border px-4 py-2">{flight.availableSeats}</td>
                  <td className="border px-4 py-2">
                    <Link href={`/flights/${flight._id}`} className="text-blue-500 hover:underline mr-2">
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="border px-4 py-2 text-center">
                  No flights found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
