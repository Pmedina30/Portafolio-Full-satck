import 'package:equatable/equatable.dart';

abstract class SecurityEvent extends Equatable {
  const SecurityEvent();

  @override
  List<Object?> get props => [];
}

class AppStartedSecurityCheckEvent extends SecurityEvent {
  const AppStartedSecurityCheckEvent();
}

class AuthenticateUserEvent extends SecurityEvent {
  const AuthenticateUserEvent();
}

class LockAppEvent extends SecurityEvent {
  const LockAppEvent();
}

class TogglePrivacyFiguresEvent extends SecurityEvent {
  const TogglePrivacyFiguresEvent();
}

class UpdateBiometricsSettingEvent extends SecurityEvent {
  final bool enabled;

  const UpdateBiometricsSettingEvent(this.enabled);

  @override
  List<Object?> get props => [enabled];
}
