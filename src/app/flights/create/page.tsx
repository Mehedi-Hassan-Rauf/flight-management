'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

type FormData = {
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

export default function CreateFlight() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth/login')
        return
      }

      const response = await fetch('https://flight-back.vercel.app/api/v1/flight/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        router.push('/flights')
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to create flight')
      }
    } catch (err) {
      setError('An error occurred while creating the flight')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Flight</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg">
        <div className="mb-4">
          <label htmlFor="flightNumber" className="block mb-2">Flight Number</label>
          <input
            id="flightNumber"
            {...register('flightNumber', { required: 'Flight number is required' })}
            className="w-full p-2 border rounded"
          />
          {errors.flightNumber && <p className="text-red-500">{errors.flightNumber.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="airline" className="block mb-2">Airline</label>
          <input
            id="airline"
            {...register('airline', { required: 'Airline is required' })}
            className="w-full p-2 border rounded"
          />
          {errors.airline && <p className="text-red-500">{errors.airline.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="origin" className="block mb-2">Origin</label>
          <input
            id="origin"
            {...register('origin', { required: 'Origin is required' })}
            className="w-full p-2 border rounded"
          />
          {errors.origin && <p className="text-red-500">{errors.origin.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="destination" className="block mb-2">Destination</label>
          <input
            id="destination"
            {...register('destination', { required: 'Destination is required' })}
            className="w-full p-2 border rounded"
          />
          {errors.destination && <p className="text-red-500">{errors.destination.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block mb-2">Price</label>
          <input
            id="price"
            type="number"
            {...register('price', { required: 'Price is required', min: 0 })}
            className="w-full p-2 border rounded"
          />
          {errors.price && <p className="text-red-500">{errors.price.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="date" className="block mb-2">Date</label>
          <input
            id="date"
            type="date"
            {...register('date', { required: 'Date is required' })}
            className="w-full p-2 border rounded"
          />
          {errors.date && <p className="text-red-500">{errors.date.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="startTime" className="block mb-2">Start Time</label>
          <input
            id="startTime"
            type="time"
            {...register('startTime', { required: 'Start time is required' })}
            className="w-full p-2 border rounded"
          />
          {errors.startTime && <p className="text-red-500">{errors.startTime.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="endTime" className="block mb-2">End Time</label>
          <input
            id="endTime"
            type="time"
            {...register('endTime', { required: 'End time is required' })}
            className="w-full p-2 border rounded"
          />
          {errors.endTime && <p className="text-red-500">{errors.endTime.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="availableSeats" className="block mb-2">Available Seats</label>
          <input
            id="availableSeats"
            type="number"
            {...register('availableSeats', { required: 'Available seats is required', min: 0 })}
            className="w-full p-2 border rounded"
          />
          {errors.availableSeats && <p className="text-red-500">{errors.availableSeats.message}</p>}
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Flight'}
        </button>
      </form>
    </div>
  )
}

