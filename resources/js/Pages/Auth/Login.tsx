import { FormEventHandler, useState } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import { Eye, EyeOff, UserRound, KeyRound } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import GuestLayout from '@/Layouts/GuestLayout'
import InputError from '@/Components/InputError'
import { error } from 'console'
import toast from 'react-hot-toast'

export default function Login({
  status,
  canResetPassword,
}: {
  status?: string
  canResetPassword: boolean
}) {
  const [isVisible, setIsVisible] = useState(false)
  const toggleVisibility = () => setIsVisible(prev => !prev)

  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  })

  const submit: FormEventHandler = e => {
    e.preventDefault()
    post(route('login'), {
      onFinish: () => reset('password'),
      onError: error => {
        if (error.message) {
          toast.error(error.message)
        }
      },
    })
  }

  return (
    <GuestLayout>
      <Head title="Log in" />

      <div className="w-full md:px-8 py-12 sm:max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">Welcome back!</h1>
          <p className="text-muted-foreground mt-2">Please sign in to continue</p>
        </div>

        {status && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400 rounded-lg text-sm">
            {status}
          </div>
        )}

        <form onSubmit={submit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                name="email"
                value={data.email}
                className="pl-10"
                placeholder="Enter your email"
                autoComplete="username"
                onChange={e => setData('email', e.target.value)}
              />
              <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <InputError message={errors.email} className="mt-1" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={isVisible ? 'text' : 'password'}
                name="password"
                value={data.password}
                className="pl-10 pr-10"
                placeholder="Enter your password"
                autoComplete="current-password"
                onChange={e => setData('password', e.target.value)}
              />
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <button
                type="button"
                onClick={toggleVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={isVisible ? 'Hide password' : 'Show password'}
              >
                {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <InputError message={errors.password} className="mt-1" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                name="remember"
                checked={data.remember}
                onCheckedChange={checked => setData('remember', Boolean(checked))}
              />
              <Label htmlFor="remember" className="text-sm">
                Remember me
              </Label>
            </div>

            {canResetPassword && (
              <Link
                href={route('password.request')}
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            )}
          </div>

          <Button className="w-full" size="lg" disabled={processing}>
            Sign In
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href={route('register')} className="text-primary hover:underline">
              Create one
            </Link>
          </div>
        </form>
      </div>
    </GuestLayout>
  )
}
