import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Transform image URLs to use duckdns domain in development
 * Converts /uploads/* paths to https://shaikhandsons.duckdns.org/uploads/*
 */
export function getImageUrl(path: string): string {
  if (!path) return path;
  
  // If it's already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // For local development uploads, always use duckdns domain
  if (path.startsWith('/uploads')) {
    return `https://shaikhandsons.duckdns.org${path}`;
  }
  
  return path;
}
