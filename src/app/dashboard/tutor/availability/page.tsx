// app/dashboard/tutor/availability/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Plus, Trash2, Clock } from 'lucide-react'

interface ITimeSlot {
  id?: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
}

const days = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
]

export default function TutorAvailabilityPage() {
  const router = useRouter()
  const [availability, setAvailability] = useState<ITimeSlot[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchAvailability()
  }, [])

  const fetchAvailability = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tutor/availability`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      const data = await res.json()
      if (data.success) {
        setAvailability(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch availability:', error)
    }
  }

  const addTimeSlot = () => {
    setAvailability([
      ...availability,
      {
        dayOfWeek: 0,
        startTime: '09:00',
        endTime: '17:00',
        isRecurring: true
      }
    ])
  }

  const removeTimeSlot = (index: number) => {
    setAvailability(availability.filter((_, i) => i !== index))
  }

  const updateTimeSlot = (index: number, field: keyof ITimeSlot, value: any) => {
    const updated = [...availability]
    updated[index] = { ...updated[index], [field]: value }
    setAvailability(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tutor/availability`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ availability })
        }
      )
      
      const data = await res.json()
      if (data.success) {
        toast.success('Availability updated successfully!')
        router.push('/dashboard/tutor')
      } else {
        toast.error(data.message || 'Failed to update availability')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Availability Schedule</h1>
            <p className="text-gray-600 mt-1">Set your teaching hours for each day</p>
          </div>
          <Button onClick={addTimeSlot} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Time Slot
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {availability.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No availability set yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Click "Add Time Slot" to set your teaching hours
              </p>
            </div>
          ) : (
            availability.map((slot, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Day */}
                    <div>
                      <Label>Day</Label>
                      <select
                        value={slot.dayOfWeek}
                        onChange={(e) => updateTimeSlot(index, 'dayOfWeek', parseInt(e.target.value))}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {days.map((day, idx) => (
                          <option key={idx} value={idx}>{day}</option>
                        ))}
                      </select>
                    </div>

                    {/* Start Time */}
                    <div>
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    {/* End Time */}
                    <div>
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    {/* Recurring */}
                    <div className="flex items-center gap-2 pt-6">
                      <Switch
                        checked={slot.isRecurring}
                        onCheckedChange={(checked) => updateTimeSlot(index, 'isRecurring', checked)}
                      />
                      <Label>Recurring weekly</Label>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeTimeSlot(index)}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Saving...' : 'Save Availability'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/tutor')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}