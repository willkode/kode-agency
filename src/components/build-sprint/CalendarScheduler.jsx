import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import Card from '@/components/ui-custom/Card';
import { Loader2, CheckCircle, Calendar as CalendarIcon, Clock, Video } from 'lucide-react';
import { format, addDays, isWeekend } from 'date-fns';

export default function CalendarScheduler({ customerName, customerEmail, hours, mvpGoal, requestId, onScheduled }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [error, setError] = useState(null);

  // Fetch available slots when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchSlots = async (date) => {
    setLoading(true);
    setError(null);
    setAvailableSlots([]);
    setSelectedSlot(null);
    
    try {
      const { data } = await base44.functions.invoke('getAvailableSlots', {
        date: format(date, 'yyyy-MM-dd'),
        duration: 60,
        hours: hours || 1
      });
      setAvailableSlots(data.slots || []);
    } catch (err) {
      setError('Failed to load available times');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!selectedSlot) return;
    
    setBooking(true);
    setError(null);
    
    try {
      const { data } = await base44.functions.invoke('bookCalendarSlot', {
        startTime: selectedSlot.start,
        customerName,
        customerEmail,
        hours,
        mvpGoal,
        requestId
      });
      
      setBookingResult(data);
      setBooked(true);
      if (onScheduled) onScheduled(data);
    } catch (err) {
      setError('Failed to book session. Please try again.');
      console.error(err);
    } finally {
      setBooking(false);
    }
  };

  // Disable weekends, Monday, and past dates (only Tue-Fri available)
  const disabledDays = (date) => {
    const day = date.getDay();
    // 0=Sun, 1=Mon, 6=Sat are disabled
    return day === 0 || day === 1 || day === 6 || date < new Date();
  };

  if (booked && bookingResult) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#73e28a]/20 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-[#73e28a]" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Session Scheduled!</h3>
        <p className="text-slate-400 mb-6">
          You'll receive a calendar invite with the meeting details shortly.
        </p>
        
        <div className="bg-slate-800/50 rounded-lg p-4 mb-6 inline-block">
          <div className="flex items-center gap-2 text-slate-300 mb-2">
            <CalendarIcon className="w-4 h-4 text-[#73e28a]" />
            <span>{format(new Date(selectedSlot.start), 'EEEE, MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-4 h-4 text-[#73e28a]" />
            <span>{selectedSlot.displayTime} CT ({hours} hour{hours > 1 ? 's' : ''})</span>
          </div>
        </div>
        
        {bookingResult.meetLink && (
          <div className="mt-4">
            <a 
              href={bookingResult.meetLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#73e28a] hover:underline"
            >
              <Video className="w-4 h-4" />
              Join Google Meet
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Calendar */}
        <div>
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#73e28a]" />
            Select a Date
          </h4>
          <div className="bg-slate-800 rounded-lg p-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={disabledDays}
              fromDate={new Date()}
              toDate={addDays(new Date(), 30)}
              className="text-white"
            />
          </div>
        </div>
        
        {/* Time Slots */}
        <div>
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#73e28a]" />
            Select a {hours}-Hour Slot (CT)
          </h4>
          
          {!selectedDate && (
            <div className="bg-slate-800/50 rounded-lg p-8 text-center">
              <p className="text-slate-500">Select a date to see available times</p>
            </div>
          )}
          
          {selectedDate && loading && (
            <div className="bg-slate-800/50 rounded-lg p-8 text-center">
              <Loader2 className="w-6 h-6 animate-spin text-[#73e28a] mx-auto mb-2" />
              <p className="text-slate-400">Loading available times...</p>
            </div>
          )}
          
          {selectedDate && !loading && availableSlots.length === 0 && (
            <div className="bg-slate-800/50 rounded-lg p-8 text-center">
              <p className="text-slate-400">No available times on this date.</p>
              <p className="text-slate-500 text-sm mt-1">Try selecting a different day.</p>
            </div>
          )}
          
          {selectedDate && !loading && availableSlots.length > 0 && (
            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2">
              {availableSlots.map((slot, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${
                    selectedSlot?.start === slot.start
                      ? 'bg-[#73e28a] text-black'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {slot.displayTime}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <p className="text-red-400 text-sm text-center">{error}</p>
      )}
      
      <Button
        onClick={handleBook}
        disabled={!selectedSlot || booking}
        className="w-full bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-12"
      >
        {booking ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Booking...
          </>
        ) : (
          <>
            <CalendarIcon className="w-4 h-4 mr-2" />
            {selectedSlot 
              ? `Book ${format(new Date(selectedSlot.start), 'MMM d')} at ${selectedSlot.displayTime}` 
              : 'Select a date and time'}
          </>
        )}
      </Button>
    </div>
  );
}