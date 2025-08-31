import { redirect } from 'next/navigation'
import { getCurrentUserProfile, updateCurrentUserProfile } from '@/lib/profiles'
import { ProfileForm } from '@/components/profile-form'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/types/profile'

export default async function ProfilePage() {
  const supabase = await createClient()
  
  // 检查用户是否已登录
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }
  
  // 获取用户 profile
  const profile = await getCurrentUserProfile()
  
  // 处理 profile 更新
  async function handleProfileUpdate(updates: Partial<Profile>) {
    'use server'
    
    const updatedProfile = await updateCurrentUserProfile(updates)
    if (!updatedProfile) {
      throw new Error('Failed to update profile')
    }
    
    // 重新验证页面以显示更新后的数据
    // 在实际应用中，你可能想要使用 revalidatePath 或 revalidateTag
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">个人资料</h1>
        
        {profile ? (
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">当前信息</h2>
              <div className="space-y-1 text-sm">
                <p><strong>用户 ID:</strong> {profile.user_id}</p>
                <p><strong>姓名:</strong> {profile.first_name || '未设置'}</p>
                <p><strong>邮箱:</strong> {profile.email}</p>
                <p><strong>头像:</strong> {profile.avatar_url || '未设置'}</p>
                <p><strong>创建时间:</strong> {new Date(profile.created_at).toLocaleString('zh-CN')}</p>
                <p><strong>更新时间:</strong> {new Date(profile.updated_at).toLocaleString('zh-CN')}</p>
              </div>
            </div>
            
            <ProfileForm 
              profile={profile} 
              onUpdate={handleProfileUpdate}
            />
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              正在加载个人资料...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
