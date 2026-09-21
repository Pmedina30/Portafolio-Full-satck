import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/security/security_service.dart';
import 'security_event.dart';
import 'security_state.dart';

class SecurityBloc extends Bloc<SecurityEvent, SecurityState> {
  final SecurityService securityService;

  SecurityBloc({required this.securityService}) : super(const SecurityState()) {
    on<AppStartedSecurityCheckEvent>(_onAppStarted);
    on<AuthenticateUserEvent>(_onAuthenticate);
    on<LockAppEvent>(_onLockApp);
    on<TogglePrivacyFiguresEvent>(_onTogglePrivacyFigures);
    on<UpdateBiometricsSettingEvent>(_onUpdateBiometricsSetting);
  }

  Future<void> _onAppStarted(
    AppStartedSecurityCheckEvent event,
    Emitter<SecurityState> emit,
  ) async {
    emit(state.copyWith(status: SecurityStatus.checking));

    // 1. Verify Device Integrity (Root / Jailbreak)
    final isSecure = await securityService.verifyDeviceIntegrity();
    if (!isSecure) {
      emit(state.copyWith(
        status: SecurityStatus.compromised,
        isDeviceSecure: false,
        errorMessage:
            'Dispositivo comprometido detectado (Root/Jailbreak). Por seguridad financiera, el acceso está bloqueado.',
      ));
      return;
    }

    // 2. Initialize screen privacy protection
    await securityService.initializeSecurity();

    // 3. Trigger Biometric Auth if enabled
    if (state.biometricsEnabled) {
      final authenticated = await securityService.authenticateBiometric();
      if (authenticated) {
        emit(state.copyWith(status: SecurityStatus.authenticated));
      } else {
        emit(state.copyWith(status: SecurityStatus.locked));
      }
    } else {
      emit(state.copyWith(status: SecurityStatus.authenticated));
    }
  }

  Future<void> _onAuthenticate(
    AuthenticateUserEvent event,
    Emitter<SecurityState> emit,
  ) async {
    final success = await securityService.authenticateBiometric();
    if (success) {
      emit(state.copyWith(status: SecurityStatus.authenticated));
    } else {
      emit(state.copyWith(
        status: SecurityStatus.locked,
        errorMessage: 'Autenticación biométrica no completada',
      ));
    }
  }

  void _onLockApp(
    LockAppEvent event,
    Emitter<SecurityState> emit,
  ) {
    if (state.biometricsEnabled && state.status == SecurityStatus.authenticated) {
      emit(state.copyWith(status: SecurityStatus.locked));
    }
  }

  void _onTogglePrivacyFigures(
    TogglePrivacyFiguresEvent event,
    Emitter<SecurityState> emit,
  ) {
    emit(state.copyWith(hideFinancialFigures: !state.hideFinancialFigures));
  }

  void _onUpdateBiometricsSetting(
    UpdateBiometricsSettingEvent event,
    Emitter<SecurityState> emit,
  ) {
    emit(state.copyWith(biometricsEnabled: event.enabled));
  }
}
