import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { adminLoginSchema, type AdminLoginData } from '../../lib/validators'
import { adminLogin } from '../../lib/auth'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import humanaLogo from '../../assets/humana.png'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginData>({
    resolver: zodResolver(adminLoginSchema),
  })

  async function onSubmit(data: AdminLoginData) {
    const success = await adminLogin(data.email, data.password)
    if (success) {
      addToast('success', 'Signed in successfully', 'Welcome back to the admin portal.')
      navigate('/admin/dashboard')
    } else {
      addToast('error', 'Invalid credentials', 'Please check your email and password and try again.')
    }
  }

  return (
    <div className="min-h-screen bg-brand-softbg flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src={humanaLogo} alt="Humana" className="h-10 w-auto object-contain mb-4" />
          <h1 className="text-xl font-bold text-brand-deeptext">Recruitment Administration</h1>
          <p className="text-sm text-brand-secondarytext mt-1">Humana Careers Platform</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-brand-border shadow-card-md p-7">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@hamana.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="field-wrapper">
              <label htmlFor="password" className="field-label">
                Password <span className="text-brand-error">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`field-input pr-11 ${errors.password ? 'field-input-error' : ''}`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-secondarytext hover:text-brand-deeptext transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="field-error">{errors.password.message}</p>}
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors">
                Forgot password?
              </a>
            </div>

            <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full">
              Sign In
            </Button>
          </form>

          {/* Demo credentials notice */}
          <div className="mt-6 pt-5 border-t border-brand-border">
            <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-primary/5 border border-primary/15">
              <Lock size={14} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-primary">Demo credentials</p>
                <p className="text-xs text-brand-secondarytext mt-0.5">
                  Email: <code className="font-mono">admin@hamana.com</code>
                </p>
                <p className="text-xs text-brand-secondarytext">
                  Password: <code className="font-mono">Admin2026!</code>
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-brand-secondarytext mt-6">
          This is a demonstration platform. Authorised access only.
        </p>
      </div>
    </div>
  )
}
