import 'package:equatable/equatable.dart';

enum SecurityStatus { checking, locked, authenticated, compromised, error }

class SecurityState extends Equatable {
  final SecurityStatus status;
  final bool isDeviceSecure;
  final bool hideFinancialFigures;
  final bool biometricsEnabled;
  final String? errorMessage;

  const SecurityState({
    this.status = SecurityStatus.checking,
    this.isDeviceSecure = true,
    this.hideFinancialFigures = false,
    this.biometricsEnabled = true,
    this.errorMessage,
  });

  bool get isLocked => status == SecurityStatus.locked;
  bool get isAuthenticated => status == SecurityStatus.authenticated;
  bool get isCompromised => status == SecurityStatus.compromised;

  SecurityState copyWith({
    SecurityStatus? status,
    bool? isDeviceSecure,
    bool? hideFinancialFigures,
    bool? biometricsEnabled,
    String? errorMessage,
  }) {
    return SecurityState(
      status: status ?? this.status,
      isDeviceSecure: isDeviceSecure ?? this.isDeviceSecure,
      hideFinancialFigures: hideFinancialFigures ?? this.hideFinancialFigures,
      biometricsEnabled: biometricsEnabled ?? this.biometricsEnabled,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }

  @override
  List<Object?> get props => [
        status,
        isDeviceSecure,
        hideFinancialFigures,
        biometricsEnabled,
        errorMessage,
      ];
}
