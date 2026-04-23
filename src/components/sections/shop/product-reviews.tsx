"use client";

import React, { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, CheckCircle2, User, Send, Loader2 } from 'lucide-react';
import StarRating from '@/components/ui/star-rating';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/components/ui/toast-provider';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ReviewItem {
    _id: string;
    user: {
        name: string;
        image?: string;
    };
    rating: number;
    comment: string;
    verified: boolean;
    createdAt: string;
}

interface ProductReviewsProps {
    productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
    const [reviews, setReviews] = useState<ReviewItem[]>([]);
    const [summary, setSummary] = useState({ total: 0, average: 0 });
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState('');
    const [showForm, setShowForm] = useState(false);

    const { user } = useAuth();
    const { success, error } = useToast();

    const fetchReviews = async () => {
        try {
            const res = await fetch(`/api/reviews/${productId}`);
            const data = await res.json();
            setReviews(data.reviews || []);
            setSummary(data.summary || { total: 0, average: 0 });
        } catch (err) {
            console.error('Failed to fetch reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (productId) fetchReviews();
    }, [productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            error('Sign in to leave a review');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId,
                    rating: newRating,
                    comment: newComment,
                    user: {
                        name: user.displayName || 'Anonymous',
                        email: user.email,
                        image: user.photoURL
                    }
                })
            });

            if (res.ok) {
                success('Thank you for your review!');
                setNewComment('');
                setShowForm(false);
                fetchReviews();
            } else {
                throw new Error('Failed to submit');
            }
        } catch (err) {
            error('Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="h-40 flex items-center justify-center"><Loader2 className="animate-spin opacity-20" size={32} /></div>;

    return (
        <section className="py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left: Summary */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="p-8 rounded-2xl bg-foreground/3 border border-foreground/5">
                        <h3 className="text-[1.5rem] font-light font-display mb-2">Customer Reviews</h3>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-[3rem] font-light leading-none">{summary.average}</span>
                            <div>
                                <StarRating rating={summary.average} size={18} />
                                <p className="text-[13px] opacity-40 mt-1">Based on {summary.total} reviews</p>
                            </div>
                        </div>

                        {!showForm ? (
                            <button 
                                onClick={() => user ? setShowForm(true) : error('Sign in to leave a review')}
                                className="w-full py-4 rounded-xl border border-foreground/10 hover:border-brand-green hover:text-brand-green transition-all uppercase tracking-widest text-[11px] font-bold"
                            >
                                Write a Review
                            </button>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[11px] uppercase tracking-widest opacity-40">Your Rating</label>
                                        <StarRating 
                                            rating={newRating} 
                                            interactive 
                                            size={24} 
                                            onRatingChange={setNewRating} 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] uppercase tracking-widest opacity-40">Your Review</label>
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            required
                                            placeholder="What did you think of this product?"
                                            className="w-full h-32 p-4 bg-background border border-foreground/10 rounded-xl focus:outline-none focus:border-brand-green resize-none text-[14px]"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 py-4 bg-foreground text-background rounded-xl font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 hover:bg-brand-green transition-colors"
                                        >
                                            {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                                            Post Review
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="px-6 rounded-xl border border-foreground/10 hover:bg-foreground/5 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Review List */}
                <div className="lg:col-span-8 space-y-8">
                    {reviews.length === 0 ? (
                        <div className="py-20 text-center rounded-2xl border-2 border-dashed border-foreground/5">
                            <MessageSquare className="mx-auto opacity-10 mb-4" size={40} />
                            <p className="opacity-40 font-light italic">No reviews yet. Be the first to review this product!</p>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {reviews.map((review) => (
                                <div key={review._id} className="group animate-in fade-in duration-700">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center overflow-hidden shrink-0 border border-foreground/10">
                                                {review.user.image ? (
                                                    <Image src={review.user.image} alt={review.user.name} width={48} height={48} />
                                                ) : (
                                                    <User size={24} className="opacity-20" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-[14px] font-medium leading-tight">{review.user.name}</h4>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <StarRating rating={review.rating} size={12} />
                                                    {review.verified && (
                                                        <span className="flex items-center gap-1 text-[11px] text-brand-green font-medium">
                                                            <CheckCircle2 size={12} />
                                                            Verified Purchase
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[12px] opacity-30 font-light">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-[15px] text-foreground/70 leading-relaxed pl-16">
                                        {review.comment}
                                    </p>
                                    <div className="flex items-center gap-6 mt-4 pl-16">
                                        <button className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-bold opacity-30 hover:opacity-100 hover:text-brand-green transition-all">
                                            <ThumbsUp size={12} />
                                            Helpful
                                        </button>
                                        <button className="text-[11px] uppercase tracking-widest font-bold opacity-30 hover:opacity-100 transition-all">
                                            Report
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
