import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(formData.email, formData.password);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: error.message === 'Invalid login credentials' 
          ? 'Invalid email or password. Please try again.' 
          : error.message,
      });
    } else {
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
      navigate('/dashboard');
    }
    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero/Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
        
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-primary-foreground">TaskCore</span>
          </div>
          
          <h1 className="text-4xl xl:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
            Organize your<br />academic journey
          </h1>
          
          <p className="text-lg text-primary-foreground/80 mb-10 max-w-md">
            Stay on top of assignments, exams, and projects. TaskCore helps students manage their academic workload efficiently.
          </p>
          
          <div className="space-y-4">
            {[
              'Smart task prioritization',
              'Pomodoro timer integration',
              'Progress tracking & analytics',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-primary-foreground/90 animate-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-slide-in-right">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">TaskCore</span>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome Back!</h2>
            <p className="text-muted-foreground">Login to manage your academic tasks</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <p className="text-center text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
