export interface Profile {
  id: string
  user_id: string
  first_name: string | null
  avatar_url: string | null
  email: string
  created_at: string
  updated_at: string
}

export interface CreateProfileData {
  user_id: string
  first_name?: string
  avatar_url?: string
  email: string
}

export interface UpdateProfileData {
  first_name?: string | null
  avatar_url?: string | null
  email?: string
}
