import { useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';

// Parse UTM params once per session
const getUtmParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    utm_content: params.get('utm_content') || undefined,
    utm_term: params.get('utm_term') || undefined,
  };
};

// Get device type
const getDeviceType = () => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

// Get referrer domain
const getReferrerDomain = () => {
  try {
    if (!document.referrer) return undefined;
    return new URL(document.referrer).hostname;
  } catch {
    return undefined;
  }
};

// Get message length bucket
const getMessageLengthBucket = (length) => {
  if (length === 0) return '0';
  if (length <= 50) return '1-50';
  if (length <= 200) return '51-200';
  return '200+';
};

// Fire GA4 event via gtag
const fireGtag = (eventName, properties = {}) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, properties);
  }
};

// Core tracking function with common properties
export const track = (eventName, properties = {}) => {
  const commonProps = {
    page: window.location.pathname,
    device_type: getDeviceType(),
    referrer_domain: getReferrerDomain(),
    ...getUtmParams(),
  };

  // Filter out undefined values
  const filteredProps = Object.fromEntries(
    Object.entries({ ...commonProps, ...properties }).filter(([_, v]) => v !== undefined)
  );

  base44.analytics.track({
    eventName,
    properties: filteredProps,
  });

  // Mirror key events to GA4
  fireGtag(eventName, filteredProps);
};

// Track a purchase/conversion in GA4 with proper ecommerce schema
export const trackPurchase = (transactionId, value, itemName, currency = 'USD') => {
  // Base44 analytics
  track('purchase', { transaction_id: transactionId, value, item_name: itemName, currency });

  // GA4 ecommerce purchase event (standard schema GA4 expects)
  fireGtag('purchase', {
    transaction_id: transactionId,
    value,
    currency,
    items: [{ item_name: itemName, price: value, quantity: 1 }],
  });
};

// Hook for page view tracking
export const usePageView = (pageName, additionalProps = {}) => {
  const tracked = useRef(false);
  
  useEffect(() => {
    if (!tracked.current) {
      track(`${pageName}_viewed`, additionalProps);
      tracked.current = true;
    }
  }, []);
};

// Hook for scroll depth tracking
export const useScrollDepth = (pageName) => {
  const milestones = useRef({ 25: false, 50: false, 75: false, 90: false });
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);
      
      [25, 50, 75, 90].forEach((milestone) => {
        if (scrollPercent >= milestone && !milestones.current[milestone]) {
          milestones.current[milestone] = true;
          track('scroll_depth', { page: pageName, depth: milestone });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pageName]);
};

// Hook for time on page tracking
export const useTimeOnPage = (pageName) => {
  const intervals = useRef({ 10: false, 30: false, 60: false, 120: false });
  
  useEffect(() => {
    const timers = [10, 30, 60, 120].map((seconds) =>
      setTimeout(() => {
        if (!intervals.current[seconds]) {
          intervals.current[seconds] = true;
          track('time_on_page', { page: pageName, seconds });
        }
      }, seconds * 1000)
    );

    return () => timers.forEach(clearTimeout);
  }, [pageName]);
};

export { getMessageLengthBucket };
export default track;