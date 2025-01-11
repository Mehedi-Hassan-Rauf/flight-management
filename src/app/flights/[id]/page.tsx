'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import React from 'react'

type Flight = {
  _id: string
  flightNumber: string
  airline: string
  origin: string
  destination: string
  price: number
  date: string
  startTime: string
  endTime: string
  availableSeats: number
}

export default function FlightDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params)
  const [flight, setFlight] = useState<Flight | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchFlightDetails()
  }, [resolvedParams.id])

  const fetchFlightDetails = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth/login')
        return
      }

      const response = await fetch(`https://flight-back.vercel.app/api/v1/flight/${resolvedParams.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setFlight(data.data)
      } else {
        setError('Failed to fetch flight details')
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching flight details')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>
  }

  if (!flight) {
    return <div className="container mx-auto px-4 py-8">Flight not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Flight Details</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="border-t border-gray-300 py-4 flex justify-between w-full">
          <strong className="block text-gray-700 text-sm font-bold mb-2">Flight Number:</strong>
          {flight.flightNumber}
        </div>
        <div className="border-t border-gray-300 py-4 flex justify-between w-full">
          <strong className="block text-gray-700 text-sm font-bold mb-2">Airline:</strong>
          {flight.airline}
        </div>
        <div className="border-t border-gray-300 py-4 flex justify-between w-full">
          <strong className="block text-gray-700 text-sm font-bold mb-2">Origin:</strong>
          {flight.origin}
        </div>
        <div className="border-t border-gray-300 py-4 flex justify-between w-full">
          <strong className="block text-gray-700 text-sm font-bold mb-2">Destination:</strong>
          {flight.destination}
        </div>
        <div className="border-t border-gray-300 py-4 flex justify-between w-full">
          <strong className="block text-gray-700 text-sm font-bold mb-2">Price:</strong>
          ${flight.price}
        </div>
        <div className="border-t border-gray-300 py-4 flex justify-between w-full">
          <strong className="block text-gray-700 text-sm font-bold mb-2">Date:</strong>
          {new Date(flight.date).toLocaleDateString()}
        </div>
        <div className="border-t border-gray-300 py-4 flex justify-between w-full">
          <strong className="block text-gray-700 text-sm font-bold mb-2">Start Time:</strong>
          {new Date(flight.startTime).toLocaleTimeString()}
        </div>
        <div className="border-t border-gray-300 py-4 flex justify-between w-full">
          <strong className="block text-gray-700 text-sm font-bold mb-2">End Time:</strong>
          {new Date(flight.endTime).toLocaleTimeString()}
        </div>
        <div className="border-t border-gray-300 py-4 flex justify-between w-full">
          <strong className="block text-gray-700 text-sm font-bold mb-2">Available Seats:</strong>
          {flight.availableSeats}
        </div>
      </div>
      <button
        onClick={() => router.push('/flights')}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Back to Flights
      </button>
    </div>
  )
}

