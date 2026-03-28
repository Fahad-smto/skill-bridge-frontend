// app/dashboard/tutor/profile/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

interface ITutorProfile {
  bio: string;
  hourlyRate: number;
  subjects: string[];
  experience: number;
  education: string;
  languages: string[];
  isAvailable: boolean;
}

const availableSubjects = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English',
  'Programming', 'Web Development', 'Data Science', 'Business',
  'History', 'Geography', 'Music', 'Art', 'Languages'
]

export default function TutorProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<ITutorProfile>({
    bio: '',
    hourlyRate: 0,
    subjects: [],
    experience: 0,
    education: '',
    languages: [],
    isAvailable: true
  })
  const [newSubject, setNewSubject] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tutor/profile`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      const data = await res.json()
      if (data.success) {
        setProfile(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tutor/profile`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(profile)
        }
      )
      
      const data = await res.json()
      if (data.success) {
        toast.success('Profile updated successfully!')
        router.push('/dashboard/tutor')
      } else {
        toast.error(data.message || 'Failed to update profile')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const addSubject = () => {
    if (newSubject && !profile.subjects.includes(newSubject)) {
      setProfile({
        ...profile,
        subjects: [...profile.subjects, newSubject]
      })
      setNewSubject('')
    }
  }

  const removeSubject = (subject: string) => {
    setProfile({
      ...profile,
      subjects: profile.subjects.filter(s => s !== subject)
    })
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Tutor Profile</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bio */}
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => setProfile({...profile, bio: e.target.value})}
              placeholder="Tell students about yourself, your teaching style, and experience..."
              rows={4}
              className="mt-1"
            />
          </div>

          {/* Hourly Rate */}
          <div>
            <Label htmlFor="hourlyRate">Hourly Rate (BDT)</Label>
            <Input
              id="hourlyRate"
              type="number"
              value={profile.hourlyRate}
              onChange={(e) => setProfile({...profile, hourlyRate: parseInt(e.target.value)})}
              placeholder="e.g., 500"
              className="mt-1"
            />
          </div>

          {/* Subjects */}
          <div>
            <Label>Subjects</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Add a subject..."
                className="flex-1"
              />
              <Button type="button" onClick={addSubject} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {profile.subjects.map((subject) => (
                <span
                  key={subject}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-2"
                >
                  {subject}
                  <button
                    type="button"
                    onClick={() => removeSubject(subject)}
                    className="hover:text-purple-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div>
            <Label htmlFor="experience">Years of Experience</Label>
            <Input
              id="experience"
              type="number"
              value={profile.experience}
              onChange={(e) => setProfile({...profile, experience: parseInt(e.target.value)})}
              placeholder="e.g., 5"
              className="mt-1"
            />
          </div>

          {/* Education */}
          <div>
            <Label htmlFor="education">Education</Label>
            <Input
              id="education"
              value={profile.education}
              onChange={(e) => setProfile({...profile, education: e.target.value})}
              placeholder="e.g., B.Sc. in Computer Science, University of Dhaka"
              className="mt-1"
            />
          </div>

          {/* Availability */}
          <div className="flex items-center justify-between">
            <Label htmlFor="isAvailable">Available for new students</Label>
            <Switch
              id="isAvailable"
              checked={profile.isAvailable}
              onCheckedChange={(checked) => setProfile({...profile, isAvailable: checked})}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Saving...' : 'Save Changes'}
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