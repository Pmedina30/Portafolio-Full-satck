import React, { useState } from 'react';
import { DriverApplication } from '../types';
import {
  ShieldCheck,
  X,
  CheckCircle2,
  XCircle,
  FileText,
  User,
  Car,
  Phone,
  Calendar,
  AlertTriangle,
  Award,
  ExternalLink,
  Eye,
} from 'lucide-react';

interface DriverApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: DriverApplication[];
  onApprove: (applicationId: string) => void;
  onReject: (applicationId: string, reason: string) => void;
}

export const DriverApprovalModal: React.FC<DriverApprovalModalProps> = ({
  isOpen,
  onClose,
  applications,
  onApprove,
  onReject,
}) => {
  const [selectedAppId, setSelectedAppId] = useState<string>(
    applications[0]?.id || ''
  );
  const [rejectReason, setRejectReason] = useState<string>('Documentación no conforme');
  const [showRejectDialog, setShowRejectDialog] = useState<boolean>(false);
  const [inspectingDoc, setInspectingDoc] = useState<{
    name: string;
    issuer: string;
    docNumber: string;
    expiry: string;
    badge: string;
  } | null>(null);

  if (!isOpen) return null;

  const currentApp = applications.find((a) => a.id === selectedAppId) || applications[0];

  return (
    <div
      id="driver-approval-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-5xl w-full h-[90vh] flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="p-5 px-6 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Aprobación y Verificación de Conductores
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  INTRANT · República Dominicana
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Validación de licencias de conducir, pólizas de seguro y certificados de no antecedentes penales (PGR)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Left Applicant List + Right Inspection Workbench */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column: Applicants List */}
          <div className="w-72 border-r border-slate-200 bg-slate-50 flex flex-col">
            <div className="p-3 border-b border-slate-200 bg-white">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Solicitudes Pendientes ({applications.filter((a) => a.status === 'pending').length})
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {applications.map((app) => {
                const isSelected = app.id === currentApp?.id;

                return (
                  <button
                    key={app.id}
                    onClick={() => {
                      setSelectedAppId(app.id);
                      setShowRejectDialog(false);
                    }}
                    className={`w-full text-left p-3 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-white border-emerald-500 shadow-sm ring-1 ring-emerald-500/20'
                        : 'bg-white/80 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={app.avatar}
                        alt={app.fullName}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="overflow-hidden flex-1">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {app.fullName}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {app.vehicleModel} ({app.vehicleYear})
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] font-mono text-slate-600 font-bold bg-slate-100 px-1 py-0.2 rounded">
                            {app.vehiclePlate}
                          </span>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                              app.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : app.status === 'rejected'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {app.status === 'approved'
                              ? 'Aprobado'
                              : app.status === 'rejected'
                              ? 'Rechazado'
                              : 'Pendiente'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Document Verification Workbench */}
          {currentApp && (
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 flex flex-col justify-between">
              <div>
                {/* Applicant Profile Bar */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm mb-5 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={currentApp.avatar}
                      alt={currentApp.fullName}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900">
                          {currentApp.fullName}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {currentApp.vehicleCategory}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1 font-mono">
                          <strong>Cédula:</strong> {currentApp.cedula}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {currentApp.phone}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          Enviado: {currentApp.appliedDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Highlight Card */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-right">
                    <p className="text-[11px] text-slate-500">Vehículo Registrado</p>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {currentApp.vehicleModel} ({currentApp.vehicleYear})
                    </p>
                    <p className="font-mono text-emerald-800 font-extrabold text-sm mt-0.5">
                      {currentApp.vehiclePlate}
                    </p>
                  </div>
                </div>

                {/* 4 Required Verification Documents */}
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  Expediente de Documentación Obligatoria (INTRANT / PGR / Seguros)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-6">
                  {/* 1. Licencia de Conducir */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Documento Oficial 1
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Válida
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-slate-900">
                        {currentApp.documents.license.name}
                      </h5>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {currentApp.documents.license.issuer}
                      </p>

                      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-xs space-y-1 mt-3">
                        <div className="flex justify-between">
                          <span className="text-slate-500">No. Licencia:</span>
                          <span className="font-mono font-bold text-slate-900">
                            {currentApp.documents.license.documentNumber}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Vigencia hasta:</span>
                          <span className="font-semibold text-slate-800">
                            {currentApp.documents.license.expiryDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-emerald-700 font-medium">
                        ✓ {currentApp.documents.license.verificationBadge}
                      </span>
                      <button
                        onClick={() =>
                          setInspectingDoc({
                            name: currentApp.documents.license.name,
                            issuer: currentApp.documents.license.issuer,
                            docNumber: currentApp.documents.license.documentNumber,
                            expiry: currentApp.documents.license.expiryDate,
                            badge: currentApp.documents.license.verificationBadge,
                          })
                        }
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspeccionar
                      </button>
                    </div>
                  </div>

                  {/* 2. Póliza de Seguro Vehicular / Marbete */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Documento Oficial 2
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Vigente
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-slate-900">
                        {currentApp.documents.insurance.name}
                      </h5>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {currentApp.documents.insurance.issuer}
                      </p>

                      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-xs space-y-1 mt-3">
                        <div className="flex justify-between">
                          <span className="text-slate-500">No. Póliza:</span>
                          <span className="font-mono font-bold text-slate-900">
                            {currentApp.documents.insurance.documentNumber}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Vence:</span>
                          <span className="font-semibold text-slate-800">
                            {currentApp.documents.insurance.expiryDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-emerald-700 font-medium">
                        ✓ {currentApp.documents.insurance.verificationBadge}
                      </span>
                      <button
                        onClick={() =>
                          setInspectingDoc({
                            name: currentApp.documents.insurance.name,
                            issuer: currentApp.documents.insurance.issuer,
                            docNumber: currentApp.documents.insurance.documentNumber,
                            expiry: currentApp.documents.insurance.expiryDate,
                            badge: currentApp.documents.insurance.verificationBadge,
                          })
                        }
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspeccionar
                      </button>
                    </div>
                  </div>

                  {/* 3. Certificación de No Antecedentes Penales (PGR) */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Documento Oficial 3
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Sin Antecedentes
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-slate-900">
                        {currentApp.documents.criminalRecord.name}
                      </h5>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {currentApp.documents.criminalRecord.issuer}
                      </p>

                      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-xs space-y-1 mt-3">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Folio PGR:</span>
                          <span className="font-mono font-bold text-slate-900">
                            {currentApp.documents.criminalRecord.documentNumber}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Autenticidad:</span>
                          <span className="font-semibold text-emerald-700">
                            QR Validado Digitalmente
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-emerald-700 font-medium">
                        ✓ {currentApp.documents.criminalRecord.verificationBadge}
                      </span>
                      <button
                        onClick={() =>
                          setInspectingDoc({
                            name: currentApp.documents.criminalRecord.name,
                            issuer: currentApp.documents.criminalRecord.issuer,
                            docNumber: currentApp.documents.criminalRecord.documentNumber,
                            expiry: currentApp.documents.criminalRecord.expiryDate,
                            badge: currentApp.documents.criminalRecord.verificationBadge,
                          })
                        }
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspeccionar
                      </button>
                    </div>
                  </div>

                  {/* 4. Inspección Técnico-Mecánica */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Inspección de Flota 4
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Aprobada 100%
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-slate-900">
                        {currentApp.documents.inspection.name}
                      </h5>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {currentApp.documents.inspection.issuer}
                      </p>

                      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-xs space-y-1 mt-3">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Dictamen Técnico:</span>
                          <span className="font-semibold text-slate-900">
                            Excelente estado operativo
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Aire Acondicionado:</span>
                          <span className="font-semibold text-emerald-700">
                            100% Óptimo para pasajeros
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-emerald-700 font-medium">
                        ✓ {currentApp.documents.inspection.verificationBadge}
                      </span>
                      <button
                        onClick={() =>
                          setInspectingDoc({
                            name: currentApp.documents.inspection.name,
                            issuer: currentApp.documents.inspection.issuer,
                            docNumber: currentApp.documents.inspection.documentNumber,
                            expiry: currentApp.documents.inspection.expiryDate,
                            badge: currentApp.documents.inspection.verificationBadge,
                          })
                        }
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspeccionar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Reject Reason Dialog if open */}
                {showRejectDialog && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 animate-in fade-in duration-150">
                    <div className="flex items-center gap-2 text-red-800 font-bold text-xs mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      Indique el motivo del rechazo de la solicitud
                    </div>
                    <select
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-red-300 bg-white text-slate-800 mb-3"
                    >
                      <option value="Documento vencido o no vigente">Documento vencido o no vigente</option>
                      <option value="Fotografía ilegible o borrosa">Fotografía ilegible o borrosa</option>
                      <option value="Vehículo no cumple requisitos de año o categoría">
                        Vehículo no cumple requisitos de año o categoría
                      </option>
                      <option value="Observación en antecedentes de tránsito">
                        Observación en antecedentes de tránsito
                      </option>
                    </select>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setShowRejectDialog(false)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-red-100"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => {
                          onReject(currentApp.id, rejectReason);
                          setShowRejectDialog(false);
                        }}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs"
                      >
                        Confirmar Rechazo
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Sticky Action Bar: APROBAR / RECHAZAR */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between gap-4 mt-4">
                <div className="text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Estado actual: </span>
                  <span
                    className={`font-bold ${
                      currentApp.status === 'approved'
                        ? 'text-emerald-600'
                        : currentApp.status === 'rejected'
                        ? 'text-red-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {currentApp.status === 'approved'
                      ? 'Conductor Habilitado en la Flota'
                      : currentApp.status === 'rejected'
                      ? `Rechazado (${currentApp.rejectionReason || 'No conforme'})`
                      : 'Listo para Aprobación Operativa'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowRejectDialog(true)}
                    disabled={currentApp.status === 'approved'}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs transition-colors disabled:opacity-40"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Rechazar Solicitud</span>
                  </button>

                  <button
                    onClick={() => onApprove(currentApp.id)}
                    disabled={currentApp.status === 'approved'}
                    className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-600/20 disabled:opacity-60"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {currentApp.status === 'approved'
                        ? '✓ Conductor Ya Aprobado'
                        : 'Aprobar e Integrar a la Flota'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Document Inspector Modal Overlay */}
      {inspectingDoc && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  {inspectingDoc.name}
                </h4>
              </div>
              <button
                onClick={() => setInspectingDoc(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-100 rounded-2xl p-6 border border-slate-200 text-center space-y-3 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-white mx-auto flex items-center justify-center shadow-sm border border-slate-200 text-emerald-600">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">
                  Emisor Oficial
                </p>
                <p className="text-sm font-extrabold text-slate-900">
                  {inspectingDoc.issuer}
                </p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-slate-200 inline-block text-left text-xs font-mono">
                <p className="text-slate-500">Identificador:</p>
                <p className="font-bold text-slate-900">{inspectingDoc.docNumber}</p>
                <p className="text-slate-500 mt-1">Vigencia:</p>
                <p className="font-bold text-emerald-700">{inspectingDoc.expiry}</p>
              </div>
              <p className="text-xs text-emerald-800 font-semibold bg-emerald-50 py-1 px-3 rounded-full border border-emerald-200 inline-block">
                ✓ {inspectingDoc.badge}
              </p>
            </div>

            <button
              onClick={() => setInspectingDoc(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Cerrar Vista Previa
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
