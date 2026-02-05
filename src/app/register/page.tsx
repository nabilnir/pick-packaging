"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { useAuth } from '@/contexts/auth-context';

const RegisterPage = () => {
    const router = useRouter();
    const { register, loginWithGoogle } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        agreeToTerms: false,
        subscribeToNewsletter: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            setIsLoading(false);
            return;
        }

        try {
            await register(formData.email, formData.password);
            router.push('/shop');
        } catch (err: any) {
            setError(err.message || 'Failed to register. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
        setIsLoading(true);
        setError('');

        try {
            await loginWithGoogle();
            router.push('/shop');
        } catch (err: any) {
            setError(err.message || 'Failed to register with Google.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-grow flex items-center justify-center pt-[90px]">
                <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-90px)]">
                    {/* Left Side - Form */}
                    <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16">
                        <div className="max-w-[480px] w-full">
                            <h1 className="text-[2.5rem] md:text-[3rem] font-light font-display leading-tight mb-3">
                                Register your account
                            </h1>
                            <p className="text-[15px] text-foreground/60 mb-12">
                                You'll get a one-time 10% discount coupon to your email inbox and 5% back on every order.
                            </p>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email Input */}
                                <div>
                                    <label htmlFor="email" className="sr-only">
                                        Email address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Email address"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-6 py-4 border border-foreground/10 rounded-md bg-transparent focus:outline-none focus:border-foreground/30 transition-colors text-[15px]"
                                        required
                                    />
                                </div>

                                {/* Password Input */}
                                <div>
                                    <label htmlFor="password" className="sr-only">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-6 py-4 border border-foreground/10 rounded-md bg-transparent focus:outline-none focus:border-foreground/30 transition-colors text-[15px]"
                                        required
                                    />
                                </div>

                                {/* Terms & Conditions */}
                                <div className="space-y-4">
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.agreeToTerms}
                                            onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                                            className="w-4 h-4 mt-0.5 rounded border-foreground/20 text-foreground focus:ring-0 cursor-pointer"
                                            required
                                        />
                                        <span className="text-[14px] text-foreground/70 leading-relaxed">
                                            By creating an account, you agree to our{' '}
                                            <Link href="/terms" className="text-foreground hover:text-brand-green transition-colors">
                                                Terms and Conditions
                                            </Link>
                                            {' '}and{' '}
                                            <Link href="/privacy" className="text-foreground hover:text-brand-green transition-colors">
                                                Privacy Policy
                                            </Link>
                                        </span>
                                    </label>

                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.subscribeToNewsletter}
                                            onChange={(e) => setFormData({ ...formData, subscribeToNewsletter: e.target.checked })}
                                            className="w-4 h-4 mt-0.5 rounded border-foreground/20 text-foreground focus:ring-0 cursor-pointer"
                                        />
                                        <span className="text-[14px] text-foreground/70 leading-relaxed">
                                            I would like to receive coupons, offers, product updates and news.
                                        </span>
                                    </label>
                                </div>

                                {/* Register Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-foreground text-background py-4 px-6 rounded-md font-medium text-[14px] uppercase tracking-widest hover:bg-brand-green transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Creating account...' : 'Create account'}
                                </button>

                                {/* Divider */}
                                <div className="relative my-8">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-foreground/10"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-background text-foreground/40 text-[13px]">or</span>
                                    </div>
                                </div>

                                {/* Google Login */}
                                <button
                                    type="button"
                                    onClick={handleGoogleRegister}
                                    disabled={isLoading}
                                    className="w-full py-4 px-6 border border-foreground/10 rounded-md flex items-center justify-center gap-3 hover:border-foreground/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                                        <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853" />
                                        <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z" fill="#FBBC05" />
                                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                                    </svg>
                                    <span className="text-[14px] font-medium">Sign up with Google</span>
                                </button>

                                {/* Login Link */}
                                <p className="text-center text-[14px] text-foreground/60 mt-8">
                                    Already have an account?{' '}
                                    <Link href="/login" className="text-foreground font-medium hover:text-brand-green transition-colors">
                                        Login
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>

                    {/* Right Side - Image */}
                    <div className="relative hidden lg:block bg-[#1a1a1a]">
                        <Image
                            src="https://yucca.co.za/wp-content/uploads/2025/07/Image-1.webp"
                            alt="Register"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default RegisterPage;
