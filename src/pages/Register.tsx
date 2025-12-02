import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { z } from 'zod';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = registerSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(formData.email, formData.password, formData.fullName);

    if (error) {
      let message = error.message;
      if (error.message.includes('already registered')) {
        message = 'This email is already registered. Please sign in instead.';
      }
      toast({
        variant: 'destructive',
        title: 'Registration failed',
        description: message,
      });
    } else {
      toast({
        title: 'Account created!',
        description: 'Welcome to TaskCore. You can now start organizing your tasks.',
      });
      navigate('/dashboard');
    }
    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-primary">TaskCore</span>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join TaskCore and organize your studies</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              name="fullName"
              placeholder="your name"
              value={formData.fullName}
              onChange={handleChange}
              required
              className={`h-12 ${errors.fullName ? 'border-destructive' : ''}`}
            />
            {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
          </div>

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
              className={`h-12 ${errors.email ? 'border-destructive' : ''}`}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`h-12 pr-12 ${errors.password ? 'border-destructive' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={`h-12 pr-12 ${errors.confirmPassword ? 'border-destructive' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
          </div>

          <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <p className="text-center text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
