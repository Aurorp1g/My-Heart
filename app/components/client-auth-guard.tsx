'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface ClientAuthGuardProps {
  children: React.ReactNode
  requiredPassword?: string
}

// 加密存储的密码（可以修改为你想要的密码）
const DEFAULT_PASSWORD = process.env.NEXT_PUBLIC_AUTH_PASSWORD || 'myheart2024'

export default function ClientAuthGuard({ 
  children, 
  requiredPassword = DEFAULT_PASSWORD 
}: ClientAuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [showLogin, setShowLogin] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const pathname = usePathname()

  // 检查认证状态
  useEffect(() => {
    const checkAuth = () => {
      const encryptedAuth = localStorage.getItem('encrypted-auth')
      const authTime = localStorage.getItem('auth-time')
      
      if (encryptedAuth && authTime) {
        // 简单的解密验证（实际项目中应该使用更安全的加密）
        try {
          const decrypted = atob(encryptedAuth)
          const [storedPassword, timestamp] = decrypted.split('|')
          
          // 检查密码正确性和时效性（24小时有效）
          if (storedPassword === btoa(requiredPassword) && 
              Date.now() - parseInt(timestamp) < 24 * 60 * 60 * 1000) {
            setIsAuthenticated(true)
            return
          }
        } catch (e) {
          // 解密失败，清除无效数据
          localStorage.removeItem('encrypted-auth')
          localStorage.removeItem('auth-time')
        }
      }
      
      setIsAuthenticated(false)
      setShowLogin(true)
    }

    checkAuth()
  }, [requiredPassword])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password === requiredPassword) {
      // 加密存储认证信息
      const timestamp = Date.now().toString()
      const encryptedAuth = btoa(`${btoa(requiredPassword)}|${timestamp}`)
      
      localStorage.setItem('encrypted-auth', encryptedAuth)
      localStorage.setItem('auth-time', timestamp)
      
      setIsAuthenticated(true)
      setShowLogin(false)
      setPassword('')
    } else {
      setError('密码错误，请重试')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('encrypted-auth')
    localStorage.removeItem('auth-time')
    setIsAuthenticated(false)
    setShowLogin(true)
    router.push('/')
  }

  // 显示登录界面
  if (showLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-red-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-lock text-red-500 text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">访问保护</h1>
            <p className="text-gray-600">请输入密码访问此页面</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入访问密码"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                autoFocus
              />
            </div>
            
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            
            <button 
              type="submit" 
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors"
            >
              解锁访问
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>这是受保护的私人内容</p>
          </div>
        </div>
      </div>
    )
  }

  // 显示加载状态
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">验证中...</p>
        </div>
      </div>
    )
  }

  // 显示受保护的内容和登出按钮
  return (
    <div className="relative">
      {/* 登出按钮 */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg"
          title="退出登录"
        >
          <i className="fas fa-sign-out-alt mr-2"></i>
          退出
        </button>
      </div>
      
      {children}
    </div>
  )
}