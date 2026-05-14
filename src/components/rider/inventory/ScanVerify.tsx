"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ScanBarcode, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';
import { cn } from '@/lib/utils';
import { InventoryItem } from '@/types/inventory';
import { useToast } from '@/components/ui/toast-provider';

interface ScanVerifyProps {
    items: InventoryItem[];
}

interface ScanState {
    status: 'idle' | 'success' | 'error';
    message: string;
    subMessage?: string;
}

export function ScanVerify({ items }: ScanVerifyProps) {
    const { success, error } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [scannedCount, setScannedCount] = useState(0);
    const [scanState, setScanState] = useState<ScanState>({ status: 'idle', message: '' });
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const controlsRef = useRef<IScannerControls | null>(null);
    
    // Total units that are currently LOADED and need verification
    const totalToScan = items.reduce((acc, item) => {
        if (item.status === 'LOADED' && item.invStatus !== 'RETURN') {
            return acc + item.qtyLoaded;
        }
        return acc;
    }, 0);

    // Audio cues for scanning feedback
    const playSound = (type: 'success' | 'error') => {
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            if (type === 'success') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
                gain.gain.setValueAtTime(0.1, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.1);
            } else {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
                gain.gain.setValueAtTime(0.1, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.3);
            }
        } catch (e) {
            // Ignore if audio context fails (e.g., user hasn't interacted with page)
        }
    };

    const handleScan = useCallback((scannedSku: string) => {
        // Prevent multiple scans of the same code too quickly
        if (scanState.status !== 'idle') return;

        const foundItem = items.find(i => 
            i.sku.toLowerCase() === scannedSku.toLowerCase() && 
            i.status === 'LOADED' && 
            i.invStatus !== 'RETURN'
        );

        if (foundItem) {
            playSound('success');
            setScanState({
                status: 'success',
                message: foundItem.productName,
                subMessage: `SKU: ${foundItem.sku} • Expected: ${foundItem.qtyLoaded}`
            });
            setScannedCount(prev => Math.min(prev + 1, totalToScan));
            
            setTimeout(() => {
                setScanState({ status: 'idle', message: '' });
            }, 1500);
        } else {
            playSound('error');
            setScanState({
                status: 'error',
                message: 'Item not in manifest',
                subMessage: `SKU: ${scannedSku}`
            });
            
            setTimeout(() => {
                setScanState({ status: 'idle', message: '' });
            }, 2000);
        }
    }, [items, scanState.status, totalToScan]);

    const startScanner = async () => {
        try {
            const codeReader = new BrowserMultiFormatReader();
            const videoElement = videoRef.current;
            
            if (!videoElement) return;

            const controls = await codeReader.decodeFromVideoDevice(
                undefined, 
                videoElement, 
                (result, err) => {
                    if (result) {
                        handleScan(result.getText());
                    }
                }
            );
            controlsRef.current = controls;
        } catch (err) {
            console.error('Failed to start scanner:', err);
            error('Camera access denied or unavailable.');
            setIsOpen(false);
        }
    };

    const stopScanner = () => {
        if (controlsRef.current) {
            controlsRef.current.stop();
            controlsRef.current = null;
        }
    };

    // Manage scanner lifecycle
    useEffect(() => {
        if (isOpen) {
            startScanner();
        } else {
            stopScanner();
            setScanState({ status: 'idle', message: '' });
        }
        
        return () => {
            stopScanner();
        };
    }, [isOpen]);

    return (
        <>
            {/* Floating SCAN button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-[#1c3a2a] text-white px-5 py-3.5 rounded-full shadow-lg shadow-black/20 hover:bg-[#152d20] hover:scale-105 active:scale-95 transition-all"
                >
                    <ScanBarcode size={22} />
                    <span className="text-[13px] font-bold uppercase tracking-[0.15em]">Scan</span>
                </button>
            )}

            {/* Scanner Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex flex-col bg-black">
                    {/* Header */}
                    <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-6 bg-gradient-to-b from-black/80 to-transparent">
                        <div>
                            <h2 className="text-white font-semibold text-[17px]">Scan Verification</h2>
                            <p className="text-white/60 text-[13px]">Point camera at barcode or QR code</p>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Camera Viewport */}
                    <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
                        <video 
                            ref={videoRef}
                            className="absolute inset-0 w-full h-full object-cover"
                            playsInline
                            muted
                        />
                        
                        {/* Scanning Frame Overlay */}
                        <div className="absolute inset-0 z-10 pointer-events-none">
                            <div className="w-full h-full border-[60px] sm:border-[100px] border-black/40">
                                <div className="w-full h-full border-2 border-white/30 relative">
                                    {/* Corner markers */}
                                    <div className="absolute -top-0.5 -left-0.5 w-8 h-8 border-t-4 border-l-4 border-[#1c3a2a]" />
                                    <div className="absolute -top-0.5 -right-0.5 w-8 h-8 border-t-4 border-r-4 border-[#1c3a2a]" />
                                    <div className="absolute -bottom-0.5 -left-0.5 w-8 h-8 border-b-4 border-l-4 border-[#1c3a2a]" />
                                    <div className="absolute -bottom-0.5 -right-0.5 w-8 h-8 border-b-4 border-r-4 border-[#1c3a2a]" />
                                    
                                    {/* Animated scanning line */}
                                    {scanState.status === 'idle' && (
                                        <div className="absolute top-0 left-0 w-full h-0.5 bg-green-400/80 shadow-[0_0_8px_2px_rgba(74,222,128,0.5)] animate-[scan_2s_ease-in-out_infinite]" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Status Flash Overlay */}
                        <div className={cn(
                            "absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center transition-opacity duration-300 pointer-events-none",
                            scanState.status === 'success' ? "bg-teal-600/90 opacity-100" :
                            scanState.status === 'error' ? "bg-red-600/90 opacity-100" : "opacity-0"
                        )}>
                            {scanState.status === 'success' && <CheckCircle2 size={64} className="text-white mb-4 drop-shadow-md" />}
                            {scanState.status === 'error' && <AlertCircle size={64} className="text-white mb-4 drop-shadow-md" />}
                            
                            <h3 className="text-white text-2xl font-bold mb-2 drop-shadow-md">
                                {scanState.message}
                            </h3>
                            {scanState.subMessage && (
                                <p className="text-white/90 text-sm font-medium bg-black/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                                    {scanState.subMessage}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Footer Progress */}
                    <div className="bg-white px-6 pb-8 pt-6 rounded-t-3xl absolute bottom-0 left-0 right-0 z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[12px] font-bold uppercase tracking-widest text-foreground/40">
                                Verification Progress
                            </span>
                            <span className="text-[14px] font-bold text-[#1c3a2a] tabular-nums">
                                {scannedCount} <span className="text-foreground/30 font-medium">/ {totalToScan} items</span>
                            </span>
                        </div>
                        
                        <div className="h-2.5 w-full bg-foreground/[0.05] rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-[#1c3a2a] rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${totalToScan > 0 ? (scannedCount / totalToScan) * 100 : 0}%` }}
                            />
                        </div>
                        
                        <p className="text-center text-[12px] text-foreground/50 font-medium mt-5">
                            Keep scanning items as you load them onto the vehicle.
                        </p>
                    </div>
                </div>
            )}

            {/* Scanning line animation */}
            <style jsx global>{`
                @keyframes scan {
                    0% { top: 0; }
                    50% { top: 100%; }
                    100% { top: 0; }
                }
            `}</style>
        </>
    );
}
