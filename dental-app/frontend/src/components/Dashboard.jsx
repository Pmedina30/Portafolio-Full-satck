import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, CheckCircle2, AlertCircle, FileText, 
  Sparkles, User, Shield, Plus, RefreshCw, XCircle, ChevronRight, Activity 
} from 'lucide-react';
import { api } from '../api';

export default function Dashboard({ user, onBookNewClick, onLogout }) {
  const [appointments, setAppointments] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments', 'records', 'care'
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  const isStaff = user && user.role === 'staff';

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const apptRes = await api.getAppointments();
      setAppointments(apptRes.appointments || []);

      if (!isStaff) {
        const treatRes = await api.getTreatments();
        setTreatments(treatRes.treatments || []);
      } else {
        const statsRes = await api.getStats();
        setStats(statsRes.stats || null);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const handleUpdateStatus = async (apptId, newStatus) => {
    try {
      await api.updateAppointmentStatus(apptId, newStatus);
      setActionMessage(`Appointment #${apptId} status updated to ${newStatus}.`);
      setTimeout(() => setActionMessage(''), 4000);
      loadDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to update appointment status.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Completed':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Dashboard Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-dental-900 via-slate-900 to-brand-navy p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-dental-300 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>{isStaff ? 'Clinic Administration & Management' : 'Secure Patient Medical Portal'}</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Patient'} 👋
            </h1>
            <p className="text-slate-300 text-sm max-w-xl">
              {isStaff 
                ? 'Overview of clinic daily schedule, patient bookings, and operations.' 
                : 'Manage your upcoming visits, diagnostic dental chart, and post-procedure care plans.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onBookNewClick}
              className="flex items-center gap-2 bg-gradient-to-r from-dental-600 to-sky-600 hover:from-dental-700 hover:to-sky-700 text-white font-bold px-5 py-3 rounded-2xl shadow-lg shadow-dental-500/25 transition text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{isStaff ? 'New Appointment' : 'Book Dental Visit'}</span>
            </button>

            <button
              onClick={loadDashboardData}
              title="Refresh Data"
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Action Banner message */}
      {actionMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{actionMessage}</span>
          </div>
          <button onClick={() => setActionMessage('')} className="text-emerald-700 hover:text-emerald-900 font-bold">&times;</button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isStaff ? (
          <>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Bookings</div>
              <div className="text-3xl font-black text-slate-900 mt-1">{stats?.total_appointments || 0}</div>
              <div className="text-xs text-emerald-600 font-semibold mt-1">Live in Clinic System</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Confirmed Visits</div>
              <div className="text-3xl font-black text-dental-600 mt-1">{stats?.confirmed_appointments || 0}</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Ready for consultation</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Patients</div>
              <div className="text-3xl font-black text-sky-600 mt-1">{stats?.total_patients || 0}</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Registered accounts</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Services Offered</div>
              <div className="text-3xl font-black text-slate-900 mt-1">{stats?.total_services || 0}</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Active procedures</div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Next Scheduled Visit</div>
              <div className="text-lg font-bold text-slate-900 mt-1">
                {appointments[0] ? appointments[0].appointment_date : 'None Scheduled'}
              </div>
              <div className="text-xs text-dental-600 font-semibold mt-1">
                {appointments[0] ? appointments[0].appointment_time : 'Book anytime'}
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Dental Health Status</div>
              <div className="text-lg font-bold text-emerald-600 mt-1">Excellent</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Checkup on schedule</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Completed Treatments</div>
              <div className="text-lg font-bold text-slate-900 mt-1">{treatments.length} Procedures</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Recorded in chart</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Hygiene Recall</div>
              <div className="text-lg font-bold text-dental-600 mt-1">6 Months</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Biannual cleaning cycle</div>
            </div>
          </>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`pb-3 border-b-2 transition ${activeTab === 'appointments' ? 'border-dental-600 text-dental-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          {isStaff ? 'All Clinic Bookings' : 'My Appointments'} ({appointments.length})
        </button>

        {!isStaff && (
          <>
            <button
              onClick={() => setActiveTab('records')}
              className={`pb-3 border-b-2 transition ${activeTab === 'records' ? 'border-dental-600 text-dental-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              Treatment History & Records ({treatments.length})
            </button>
            <button
              onClick={() => setActiveTab('care')}
              className={`pb-3 border-b-2 transition ${activeTab === 'care' ? 'border-dental-600 text-dental-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              Care Guidelines & Instructions
            </button>
          </>
        )}
      </div>

      {/* Tab 1: Appointments List */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No appointments scheduled yet</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Ready to refresh your smile? Book your dental consultation with our specialists in just 60 seconds.
              </p>
              <button
                onClick={onBookNewClick}
                className="mt-2 text-sm font-bold text-dental-600 hover:text-dental-800 bg-dental-50 px-5 py-2.5 rounded-xl inline-flex items-center gap-1.5"
              >
                <span>Schedule Now</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-100">
                {appointments.map((appt) => (
                  <div key={appt.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/70 transition">
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusBadge(appt.status)}`}>
                          {appt.status}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          ID #{appt.id}
                        </span>
                        {isStaff && (
                          <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                            Patient: {appt.patient_name}
                          </span>
                        )}
                      </div>

                      <h4 className="text-lg font-bold text-slate-900">
                        {appt.service_name || 'Dental Consultation'}
                      </h4>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-dental-600" />
                          <strong>Date:</strong> {appt.appointment_date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-dental-600" />
                          <strong>Time:</strong> {appt.appointment_time}
                        </span>
                        {appt.dentist_name && (
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-dental-600" />
                            <strong>Doctor:</strong> {appt.dentist_name}
                          </span>
                        )}
                      </div>

                      {appt.notes && (
                        <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                          Notes: "{appt.notes}"
                        </p>
                      )}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isStaff ? (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(appt.id, 'Confirmed')}
                            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(appt.id, 'Completed')}
                            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 transition"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(appt.id, 'Cancelled')}
                            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        appt.status !== 'Cancelled' && appt.status !== 'Completed' && (
                          <button
                            onClick={() => handleUpdateStatus(appt.id, 'Cancelled')}
                            className="text-xs font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 transition"
                          >
                            Cancel Visit
                          </button>
                        )
                      )}
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Treatment History Records */}
      {activeTab === 'records' && !isStaff && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Official Clinical Dental Chart</h3>
              <p className="text-xs text-slate-500 mt-1">
                Records of completed restorative, cosmetic, and diagnostic procedures at SmileCraft Dental.
              </p>
            </div>

            <div className="space-y-4">
              {treatments.map((tr) => (
                <div key={tr.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        {tr.status}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">Date: {tr.treatment_date}</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900">{tr.procedure_name}</h4>
                    <div className="text-xs text-slate-600 flex items-center gap-4">
                      <span><strong>Tooth / Area:</strong> {tr.tooth_number}</span>
                      <span><strong>Dentist:</strong> {tr.dentist_name}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Clinical Notes: {tr.notes}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Care Guidelines */}
      {activeTab === 'care' && !isStaff && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-dental-600 font-bold">
              <Sparkles className="w-5 h-5" />
              <h4>Post-Whitening Maintenance Guide</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              To lock in your brilliant white shade and protect temporary enamel porosity:
            </p>
            <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
              <li>Adhere to the <strong>"White Diet"</strong> for the first 48 hours (avoid coffee, red wine, turmeric, dark berries).</li>
              <li>Brush gently with potassium-nitrate desensitizing toothpaste if temporary sensitivity occurs.</li>
              <li>Rinse thoroughly with water after drinking acidic beverages.</li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-sky-600 font-bold">
              <Activity className="w-5 h-5" />
              <h4>Everyday Enamel & Gum Protection</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Preserve clean margins and gum health between dental checkups:
            </p>
            <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
              <li>Use a soft-bristled or sonic toothbrush twice daily for 2 full minutes.</li>
              <li>Daily flossing or interdental brushing removes 40% of plaque standard brushes miss.</li>
              <li>Schedule your professional ultrasonic scaling every 6 months to prevent calculus buildup.</li>
            </ul>
          </div>
        </div>
      )}

    </div>
  );
}

