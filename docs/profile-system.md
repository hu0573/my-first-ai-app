# Profile 系统文档

## 概述

这个 profile 系统为 Supabase Auth 用户提供了扩展的个人资料功能。当用户注册时，系统会自动创建一个关联的 profile 记录。

## 数据库结构

### profiles 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键，自动生成 |
| user_id | uuid | 关联 auth.users 的外键，唯一约束 |
| first_name | text | 用户姓名（可选） |
| avatar_url | text | 头像 URL（可选） |
| email | text | 邮箱地址（必填） |
| created_at | timestamptz | 创建时间 |
| updated_at | timestamptz | 更新时间 |

## 安全特性

### Row Level Security (RLS)

profiles 表启用了 RLS，包含以下策略：

1. **查看策略**: 用户只能查看自己的 profile
2. **插入策略**: 用户只能插入自己的 profile
3. **更新策略**: 用户只能更新自己的 profile
4. **删除策略**: 用户只能删除自己的 profile

### 自动触发器

- **用户注册触发器**: 当用户在 `auth.users` 表中创建时，自动在 `profiles` 表中创建对应的记录
- **更新时间触发器**: 当 profile 记录更新时，自动更新 `updated_at` 字段

## 类型定义

### Profile 接口

```typescript
interface Profile {
  id: string
  user_id: string
  first_name?: string
  avatar_url?: string
  email: string
  created_at: string
  updated_at: string
}
```

### 数据库类型

项目包含完整的 TypeScript 类型定义，位于 `types/database.ts` 文件中。

## 使用方法

### 获取当前用户的 profile

```typescript
import { getCurrentUserProfile } from '@/lib/profiles'

const profile = await getCurrentUserProfile()
```

### 更新用户 profile

```typescript
import { updateCurrentUserProfile } from '@/lib/profiles'

const updatedProfile = await updateCurrentUserProfile({
  first_name: '张三',
  avatar_url: 'https://example.com/avatar.jpg',
  email: 'zhangsan@example.com'
})
```

### 在组件中使用

```typescript
import { ProfileForm } from '@/components/profile-form'

// 在页面组件中
<ProfileForm 
  profile={profile} 
  onUpdate={handleProfileUpdate}
/>
```

## 文件结构

```
types/
├── profile.ts          # Profile 相关类型定义
└── database.ts         # 数据库类型定义

lib/
├── profiles.ts         # Profile 相关工具函数
└── supabase/
    ├── client.ts       # 客户端 Supabase 实例
    └── server.ts       # 服务端 Supabase 实例

components/
└── profile-form.tsx    # Profile 编辑表单组件

app/
└── profile/
    └── page.tsx        # Profile 页面示例

supabase/
└── migrations/
    ├── 20241220120000_create_profiles_table.sql
    └── 20241220120100_fix_function_search_path.sql
```

## 安全建议

1. **启用密码泄露保护**: 在 Supabase Dashboard 中启用密码泄露保护功能
2. **启用多因素认证**: 配置多种 MFA 选项以增强账户安全性
3. **定期审查 RLS 策略**: 确保 RLS 策略符合业务需求
4. **监控数据库访问**: 定期检查数据库访问日志

## 性能优化

1. **索引**: `user_id` 字段已创建索引以优化 RLS 策略性能
2. **函数调用优化**: 在 RLS 策略中使用 `(select auth.uid())` 而不是直接调用 `auth.uid()`
3. **避免不必要的查询**: 只在需要时获取 profile 数据

## 故障排除

### 常见问题

1. **Profile 未自动创建**: 检查触发器是否正确创建
2. **RLS 策略拒绝访问**: 确认用户已登录且策略配置正确
3. **类型错误**: 确保使用正确的 TypeScript 类型定义

### 调试步骤

1. 检查 Supabase 日志
2. 验证用户认证状态
3. 确认 RLS 策略配置
4. 检查数据库触发器状态
