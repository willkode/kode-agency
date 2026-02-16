import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { track } from '@/components/analytics/useAnalytics';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, FileText, Loader2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function PublicQuotePage() {
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const pathParts = window.location.pathname.split('/');
  const quoteId = pathParts[pathParts.length - 1] || urlParams.get('id');
  
  const [clientNotes, setClientNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const { data: quote, isLoading, error } = useQuery({
    queryKey: ['public-quote', quoteId],
    queryFn: async () => {
      const quotes = await base44.entities.Quote.filter({ id: quoteId });
      if (quotes.length === 0) throw new Error('Quote not found');
      return quotes[0];
    },
    enabled: !!quoteId
  });

  // Track quote view and mark as viewed
  const viewTracked = useRef(false);
  useEffect(() => {
    if (quote && !viewTracked.current) {
      viewTracked.current = true;
      const isExpired = quote.valid_until && new Date(quote.valid_until) < new Date();
      
      track('quote_viewed', {
        quote_id: quote.id,
        quote_number: quote.quote_number,
        amount: quote.price,
        status: quote.status,
        is_expired: isExpired ? 'yes' : 'no'
      });
      
      if (quote.status === 'sent') {
        track('quote_status_changed', {
          quote_id: quote.id,
          from_status: 'sent',
          to_status: 'viewed'
        });
        base44.entities.Quote.update(quote.id, { status: 'viewed' });
        queryClient.invalidateQueries({ queryKey: ['public-quote', quoteId] });
      }
    }
  }, [quote?.id]);

  // Handle PayPal return
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('token');
    const requestId = params.get('requestId');
    
    if (orderId && requestId) {
      setIsProcessing(true);
      base44.functions.invoke('captureQuotePayment', { orderId, quoteId: requestId })
        .then(() => {
          setPaymentSuccess(true);
          track('quote_payment_success', {
            quote_id: requestId,
            order_id: orderId
          });
          queryClient.invalidateQueries({ queryKey: ['public-quote', requestId] });
          window.history.replaceState({}, '', `/quote/${requestId}`);
        })
        .catch((err) => {
          console.error(err);
          track('payment_handler_failed', { error_type: 'quote_payment', quote_id: requestId });
        })
        .finally(() => setIsProcessing(false));
    }
  }, []);

  const acceptMutation = useMutation({
    mutationFn: async () => {
      if (clientNotes) {
        track('quote_note_added', { quote_id: quote.id });
      }
      await base44.entities.Quote.update(quote.id, {
        status: 'accepted',
        client_notes: clientNotes,
        accepted_date: new Date().toISOString()
      });
    },
    onSuccess: () => {
      track('quote_accepted', {
        quote_id: quote.id,
        quote_number: quote.quote_number,
        amount: quote.price
      });
      track('quote_status_changed', {
        quote_id: quote.id,
        from_status: quote.status,
        to_status: 'accepted'
      });
      queryClient.invalidateQueries({ queryKey: ['public-quote', quoteId] });
    }
  });

  const payMutation = useMutation({
    mutationFn: async () => {
      track('quote_payment_clicked', {
        quote_id: quote.id,
        quote_number: quote.quote_number,
        amount: quote.price
      });
      const response = await base44.functions.invoke('createQuotePayment', {
        quoteId: quote.id,
        amount: quote.price
      });
      if (response.data?.approvalUrl) {
        window.location.href = response.data.approvalUrl;
      }
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#73e28a] animate-spin" />
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Quote Not Found</h1>
          <p className="text-slate-400">This quote may have expired or been removed.</p>
        </div>
      </div>
    );
  }

  if (paymentSuccess || quote.status === 'paid') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
          <p className="text-slate-400 mb-6">
            Thank you for your payment. We've received your confirmation and will begin work on your project shortly.
          </p>
          <div className="bg-slate-800/50 rounded-lg p-4 text-left">
            <p className="text-slate-400 text-sm">Quote Number</p>
            <p className="text-white font-mono">{quote.quote_number}</p>
            <p className="text-slate-400 text-sm mt-3">Amount Paid</p>
            <p className="text-[#73e28a] font-bold text-xl">${quote.price?.toLocaleString()}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#73e28a] animate-spin mx-auto mb-4" />
          <p className="text-white">Processing your payment...</p>
        </div>
      </div>
    );
  }

  const isExpired = quote.valid_until && new Date(quote.valid_until) < new Date();

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4">
      {/* noindex meta */}
      <meta name="robots" content="noindex, nofollow" />
      
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691e276e2117009b68e21c5c/3e54475dc_KA-Logo.png" 
            alt="Kode Agency" 
            className="h-12 mx-auto mb-6" 
          />
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-slate-500 font-mono">{quote.quote_number}</span>
            <Badge className={`${
              quote.status === 'accepted' ? 'bg-amber-500' :
              quote.status === 'viewed' ? 'bg-purple-500' :
              'bg-blue-500'
            } text-white`}>
              {quote.status}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-white">{quote.project_title}</h1>
          {quote.client_company && (
            <p className="text-slate-400 mt-1">Prepared for {quote.client_company}</p>
          )}
        </div>

        {/* Quote Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          {/* Price Header */}
          <div className="bg-gradient-to-r from-[#73e28a]/20 to-transparent p-6 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Amount</p>
                <p className="text-[#73e28a] font-bold text-4xl">${quote.price?.toLocaleString()}</p>
              </div>
              {quote.valid_until && (
                <div className="text-right">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Clock className="w-4 h-4" />
                    Valid until
                  </div>
                  <p className={`font-medium ${isExpired ? 'text-red-400' : 'text-white'}`}>
                    {format(new Date(quote.valid_until), 'MMMM d, yyyy')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Scope of Work */}
          <div className="p-6">
            <div className="flex items-center gap-2 text-white font-semibold mb-4">
              <FileText className="w-5 h-5 text-[#73e28a]" />
              Scope of Work
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 whitespace-pre-wrap text-slate-300 leading-relaxed">
              {quote.scope_of_work}
            </div>
          </div>

          {/* Client Notes / Accept Section */}
          {quote.status !== 'accepted' && !isExpired && (
            <div className="p-6 border-t border-slate-800">
              <Label className="text-white mb-2 block">Add notes or questions (optional)</Label>
              <Textarea
                value={clientNotes}
                onChange={(e) => setClientNotes(e.target.value)}
                placeholder="Any special requirements or questions..."
                className="bg-slate-800 border-slate-700 text-white mb-4"
              />
              <Button
                onClick={() => acceptMutation.mutate()}
                disabled={acceptMutation.isPending}
                className="w-full bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-12"
              >
                {acceptMutation.isPending ? 'Processing...' : 'Accept Quote'}
              </Button>
            </div>
          )}

          {/* Payment Section */}
          {quote.status === 'accepted' && (
            <div className="p-6 border-t border-slate-800 bg-slate-800/30">
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-[#73e28a] mx-auto mb-3" />
                <p className="text-white font-semibold mb-1">Quote Accepted!</p>
                <p className="text-slate-400 text-sm mb-6">Complete your payment to get started.</p>
                <Button
                  onClick={() => payMutation.mutate()}
                  disabled={payMutation.isPending}
                  className="bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold h-12 px-8"
                >
                  {payMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                  ) : (
                    <>Pay ${quote.price?.toLocaleString()} with PayPal</>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Expired Notice */}
          {isExpired && quote.status !== 'paid' && (
            <div className="p-6 border-t border-slate-800 bg-red-500/10">
              <p className="text-red-400 text-center">
                This quote has expired. Please contact us for a new quote.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-500 text-sm">
          <p>Questions? Email us at <a href="mailto:will@kodeagency.us" className="text-[#73e28a] hover:underline">will@kodeagency.us</a></p>
        </div>
      </div>
    </div>
  );
}