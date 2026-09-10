import React, { useState } from 'react';
import { 
  Sparkles, Calendar, Clock, Star, ShieldCheck, CheckCircle2, 
  ArrowRight, Award, Heart, Phone, MapPin, Check, AlertCircle 
} from 'lucide-react';

export default function LandingPage({ services, dentists, onBookAppointment, onOpenAuth, user }) {
  const [bookingData, setBookingData] = useState({
    patient_name: user ? user.name : '',
    patient_email: user ? user.email : '',
    patient_phone: user ? (user.phone || '') : '',
    service_id: services[0] ? services[0].id : '',
    dentist_id: dentists[0] ? dentists[0].id : '',
    appointment_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    appointment_time: '10:00 AM',
    notes: ''
  });

  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingError, setBookingError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess(null);
    setIsSubmitting(true);

    try {
      const payload = {
        ...bookingData,
        service_id: parseInt(bookingData.service_id) || (services[0]?.id || 1),
        dentist_id: parseInt(bookingData.dentist_id) || (dentists[0]?.id || 1)
      };
      const res = await onBookAppointment(payload);
      setBookingSuccess('Your dental appointment has been successfully scheduled! We look forward to seeing you.');
      // Reset optional fields
      setBookingData(prev => ({ ...prev, notes: '' }));
    } catch (err) {
      setBookingError(err.message || 'Failed to book appointment. Please check details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToBooking = (serviceId = null) => {
    if (serviceId) {
      setBookingData(prev => ({ ...prev, service_id: serviceId }));
    }
    const el = document.getElementById('booking');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-24 pb-20">
      
      {/* ================= HERO SECTION ================= */}
      <section id="hero" className="relative pt-12 pb-20 overflow-hidden gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-dental-200 text-dental-800 text-xs sm:text-sm font-bold shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-dental-500"></span>
                <span>Voted #1 Aesthetic Dental Practice in 2026</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Exceptional Care for <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-dental-600 via-sky-600 to-teal-500 bg-clip-text text-transparent">
                  Confident, Radiant Smiles.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Experience gentle, cutting-edge dentistry tailored to your comfort. From painless laser cleanings to custom porcelain smile transformations.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => scrollToBooking()}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-dental-600 to-sky-600 hover:from-dental-700 hover:to-sky-700 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-dental-500/25 hover:shadow-dental-500/35 transform hover:-translate-y-0.5 transition duration-200 text-base"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book Your Appointment</span>
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('services');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold px-7 py-4 rounded-2xl shadow-sm hover:shadow transition text-base"
                >
                  <span>Explore Treatments</span>
                  <ArrowRight className="w-4 h-4 text-dental-600" />
                </button>
              </div>

              {/* Key Trust Highlights */}
              <div className="pt-8 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                <div>
                  <div className="text-2xl font-black text-dental-700">15,000+</div>
                  <div className="text-xs text-slate-500 font-medium">Smiles Restored</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-dental-700">99.8%</div>
                  <div className="text-xs text-slate-500 font-medium">Satisfaction Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-dental-700">0% APR</div>
                  <div className="text-xs text-slate-500 font-medium">Flexible Financing</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-dental-700">100%</div>
                  <div className="text-xs text-slate-500 font-medium">Comfort Guarantee</div>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-1 bg-gradient-to-r from-dental-500 to-sky-500 rounded-3xl blur-xl opacity-20 transform -rotate-1"></div>
                
                <div className="relative bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=700" 
                    alt="SmileCraft Clinic Interior" 
                    className="w-full h-72 object-cover rounded-2xl mb-6 shadow-inner"
                  />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Next-Gen Technology</span>
                      </div>
                      <span className="text-xs font-semibold text-dental-700 bg-dental-50 px-2.5 py-1 rounded-full">Pain-Free Protocol</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                      Digital 3D Intraoral Scans & Same-Day Restorations
                    </h3>
                    
                    <p className="text-sm text-slate-500">
                      No gagging, no messy putty trays. Experience our ultra-precise 3D laser imaging for exact crown fitting and orthodontic simulation in minutes.
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs text-slate-600 font-medium">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Sedation Options
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Direct Insurance Billing
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= SERVICES SECTION ================= */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 text-dental-600 font-bold text-xs uppercase tracking-widest bg-dental-50 px-3 py-1 rounded-full border border-dental-100">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Comprehensive Dental Treatments</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Specialized Dentistry Tailored to You
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Whether you need routine preventive hygiene or a complete aesthetic smile makeover, our board-certified specialists provide gentle, personalized care.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((srv) => (
            <div 
              key={srv.id} 
              className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-dental-300 transition duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-dental-50 text-dental-700 border border-dental-100">
                    {srv.category}
                  </span>
                  <div className="flex items-center text-xs font-semibold text-slate-500 gap-1">
                    <Clock className="w-3.5 h-3.5 text-dental-600" />
                    <span>{srv.duration_minutes} min</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-dental-600 transition">
                    {srv.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    {srv.description}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Starting at</span>
                  <span className="text-2xl font-black text-slate-900">${srv.price.toFixed(0)}</span>
                </div>

                <button
                  onClick={() => scrollToBooking(srv.id)}
                  className="flex items-center gap-1.5 text-sm font-bold text-dental-600 bg-dental-50 hover:bg-dental-600 hover:text-white px-4 py-2 rounded-xl transition duration-200"
                >
                  <span>Select</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= INTERACTIVE BOOKING FORM ================= */}
      <section id="booking" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-gradient-to-br from-dental-900 via-slate-900 to-brand-navy rounded-3xl p-8 sm:p-12 shadow-2xl text-white relative overflow-hidden">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-dental-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid lg:grid-cols-12 gap-12">
            
            {/* Booking Left Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-dental-300 text-xs font-semibold">
                <Calendar className="w-3.5 h-3.5" />
                <span>Instant Confirmation</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Schedule Your Smile Consultation
              </h2>

              <p className="text-slate-300 text-sm leading-relaxed">
                Choose your preferred service, dentist, and convenient time slot. Our clinical coordinators will confirm your visit right away.
              </p>

              <div className="space-y-4 pt-4 border-t border-white/10 text-sm text-slate-200">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-dental-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white font-semibold">Free 3D Smile Assessment</strong>
                    <span className="text-xs text-slate-400">Included complimentary with your initial comprehensive checkup.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-dental-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white font-semibold">Zero Wait Time Guarantee</strong>
                    <span className="text-xs text-slate-400">We respect your schedule. Prompt seating within 5 minutes of arrival.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-dental-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white font-semibold">Need urgent emergency care?</strong>
                    <span className="text-xs text-slate-400">Call us directly at (555) 123-SMILE for same-day walk-ins.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form Card */}
            <div className="lg:col-span-7 bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl">
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                
                {bookingSuccess && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">{bookingSuccess}</p>
                      {user && (
                        <p className="text-xs text-emerald-700 mt-1">
                          You can view and manage this booking directly in your Dashboard.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {bookingError && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>{bookingError}</span>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Full Name
                    </label>
                    <input 
                      type="text" 
                      name="patient_name" 
                      required 
                      value={bookingData.patient_name} 
                      onChange={handleInputChange} 
                      placeholder="e.g. Alex Morgan"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-dental-600 focus:ring-2 focus:ring-dental-500/20 text-sm outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      name="patient_email" 
                      required 
                      value={bookingData.patient_email} 
                      onChange={handleInputChange} 
                      placeholder="alex@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-dental-600 focus:ring-2 focus:ring-dental-500/20 text-sm outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <input 
                      type="tel" 
                      name="patient_phone" 
                      value={bookingData.patient_phone} 
                      onChange={handleInputChange} 
                      placeholder="(555) 000-0000"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-dental-600 focus:ring-2 focus:ring-dental-500/20 text-sm outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Select Treatment / Service
                    </label>
                    <select 
                      name="service_id" 
                      value={bookingData.service_id} 
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-dental-600 focus:ring-2 focus:ring-dental-500/20 text-sm outline-none transition bg-white"
                    >
                      {services.map(s => (
                        <option key={s.id} value={s.id}>{s.name} (${s.price})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Preferred Specialist
                    </label>
                    <select 
                      name="dentist_id" 
                      value={bookingData.dentist_id} 
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-dental-600 focus:ring-2 focus:ring-dental-500/20 text-sm outline-none transition bg-white"
                    >
                      {dentists.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.specialty.split('&')[0]})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Preferred Date
                    </label>
                    <input 
                      type="date" 
                      name="appointment_date" 
                      required 
                      value={bookingData.appointment_date} 
                      onChange={handleInputChange} 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-dental-600 focus:ring-2 focus:ring-dental-500/20 text-sm outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select Convenient Time
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {['08:30 AM', '10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'].map((time) => (
                      <button
                        type="button"
                        key={time}
                        onClick={() => setBookingData(prev => ({ ...prev, appointment_time: time }))}
                        className={`py-2 px-2 text-xs font-bold rounded-xl border transition ${
                          bookingData.appointment_time === time 
                            ? 'bg-dental-600 text-white border-dental-600 shadow-sm' 
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Notes or Specific Concerns (Optional)
                  </label>
                  <textarea 
                    name="notes" 
                    rows="2"
                    value={bookingData.notes} 
                    onChange={handleInputChange} 
                    placeholder="e.g. Sensitive lower gums, interested in sedation options, etc."
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-dental-600 focus:ring-2 focus:ring-dental-500/20 text-sm outline-none transition"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-dental-600 to-sky-600 hover:from-dental-700 hover:to-sky-700 shadow-lg shadow-dental-500/25 transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Booking your appointment...</span>
                  ) : (
                    <>
                      <span>Confirm Appointment Request</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* ================= SPECIALISTS SECTION ================= */}
      <section id="dentists" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 text-dental-600 font-bold text-xs uppercase tracking-widest bg-dental-50 px-3 py-1 rounded-full border border-dental-100">
            <Award className="w-3.5 h-3.5" />
            <span>World-Class Clinical Team</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Meet Our Board-Certified Dentists
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Our clinicians combine artistic vision with advanced medical precision to ensure pain-free, exceptional outcomes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {dentists.map((doc) => (
            <div key={doc.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition duration-300">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={doc.image_url} 
                  alt={doc.name} 
                  className="w-full h-full object-cover object-top hover:scale-105 transition duration-500"
                />
                <span className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {doc.experience_years}+ Years Clinical Experience
                </span>
              </div>

              <div className="p-6 space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{doc.name}</h3>
                  <div className="text-xs font-bold text-dental-600 uppercase tracking-wider">{doc.title}</div>
                </div>

                <div className="text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  Specialty: {doc.specialty}
                </div>

                <p className="text-sm text-slate-500 leading-relaxed">
                  {doc.bio}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Accepting Patients
                  </span>
                  <button 
                    onClick={() => {
                      setBookingData(prev => ({ ...prev, dentist_id: doc.id }));
                      scrollToBooking();
                    }}
                    className="text-xs font-bold text-dental-600 hover:text-dental-800"
                  >
                    Book with {doc.name.split(' ')[1]} &rarr;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= PATIENT TESTIMONIALS ================= */}
      <section id="reviews" className="bg-slate-100/70 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 text-dental-600 font-bold text-xs uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-200">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Patient Testimonials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Real Smiles, Real Stories
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              See what our patients say about our gentle touch, high-tech clinic, and compassionate dental care.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed italic">
                "I used to have crippling dental anxiety, but Dr. Mitchell and the team completely transformed my perspective. The laser whitening and cleaning were 100% painless!"
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm">
                  EM
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Emily Martinez</div>
                  <div className="text-xs text-slate-400">Cosmetic Whitening Patient</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed italic">
                "Dr. Vance fitted me with Invisalign and the 3D preview was spot on. My teeth straightened in just 8 months without any brackets. The clinic feels more like a luxury spa than a dentist."
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-sm">
                  DK
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">David Kim</div>
                  <div className="text-xs text-slate-400">Invisalign Patient</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed italic">
                "Had an emergency chipped front tooth on Friday afternoon. SmileCraft accommodated me within 45 minutes and restored it flawlessly with composite bonding. Truly lifesavers!"
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                  SL
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Sophia Lawson</div>
                  <div className="text-xs text-slate-400">Emergency Dental Patient</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CLINIC INFO & LOCATION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-dental-50 text-dental-600 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Clinic Location</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                450 Aesthetic Plaza, Suite 300<br />
                Metro Health District<br />
                Complimentary Patient Parking Available
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-dental-50 text-dental-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Opening Hours</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Monday – Friday: 8:00 AM – 7:00 PM<br />
                Saturday: 9:00 AM – 4:00 PM<br />
                Sunday: Emergency On-Call Only
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-dental-50 text-dental-600 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Direct Contact</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Appointment Desk: (555) 123-SMILE<br />
                Email: care@smilecraftdental.com<br />
                24/7 Dental Trauma Line: (555) 911-DENT
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-200 pt-12 text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-dental-600" />
            <span className="font-bold text-slate-800">SmileCraft Dental</span>
            <span>&copy; 2026. All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-xs font-semibold">
            <a href="#hero" className="hover:text-dental-600">Privacy Policy</a>
            <a href="#hero" className="hover:text-dental-600">HIPAA Notice</a>
            <a href="#hero" className="hover:text-dental-600">Patient Rights</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

