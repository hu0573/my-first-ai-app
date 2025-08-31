'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Profile } from '@/types/profile'

interface ProfileFormProps {
  profile: Profile | null
  onUpdate: (updates: Partial<Profile>) => Promise<void>
}

export function ProfileForm({ profile, onUpdate }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    avatar_url: profile?.avatar_url || '',
    email: profile?.email || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await onUpdate({
        first_name: formData.first_name || undefined,
        avatar_url: formData.avatar_url || undefined,
        email: formData.email
      })
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>个人资料</CardTitle>
        <CardDescription>
          更新您的个人信息
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">姓名</Label>
            <Input
              id="first_name"
              type="text"
              value={formData.first_name}
              onChange={(e) => handleInputChange('first_name', e.target.value)}
              placeholder="请输入您的姓名"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="avatar_url">头像 URL</Label>
            <Input
              id="avatar_url"
              type="url"
              value={formData.avatar_url}
              onChange={(e) => handleInputChange('avatar_url', e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? '更新中...' : '更新资料'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
