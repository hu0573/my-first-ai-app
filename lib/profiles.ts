import { createClient } from '@/lib/supabase/server'
import type { Profile, UpdateProfileData } from '@/types/profile'

/**
 * 获取当前用户的 profile 信息
 */
export async function getCurrentUserProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()
  
  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }
  
  return profile
}

/**
 * 更新当前用户的 profile 信息
 */
export async function updateCurrentUserProfile(updates: UpdateProfileData): Promise<Profile | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', user.id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating profile:', error)
    return null
  }
  
  return profile
}

/**
 * 根据用户 ID 获取 profile 信息（仅限自己的 profile）
 */
export async function getProfileByUserId(userId: string): Promise<Profile | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.id !== userId) return null
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }
  
  return profile
}
