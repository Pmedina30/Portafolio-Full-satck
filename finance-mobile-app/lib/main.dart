import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'core/constants/app_constants.dart';
import 'core/di/injection_container.dart' as di;
import 'core/theme/app_theme.dart';
import 'features/security/presentation/bloc/security_bloc.dart';
import 'features/security/presentation/bloc/security_event.dart';
import 'features/security/presentation/bloc/security_state.dart';
import 'features/security/presentation/pages/biometric_lock_screen.dart';
import 'features/settings/domain/settings_entity.dart';
import 'features/settings/presentation/cubit/settings_cubit.dart';
import 'features/transactions/presentation/bloc/transaction_bloc.dart';
import 'features/transactions/presentation/bloc/transaction_event.dart';
import 'features/transactions/presentation/pages/dashboard_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Security, AES-256 Storage, and Dependency Injection
  await di.initDependencies();

  runApp(const FinTrackApp());
}

class FinTrackApp extends StatefulWidget {
  const FinTrackApp({super.key});

  @override
  State<FinTrackApp> createState() => _FinTrackAppState();
}

class _FinTrackAppState extends State<FinTrackApp> with WidgetsBindingObserver {
  late final SecurityBloc _securityBloc;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _securityBloc = di.sl<SecurityBloc>()..add(const AppStartedSecurityCheckEvent());
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _securityBloc.close();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    // OWASP MASVS: Trigger Auto-Lock when app moves to background/paused
    if (state == AppLifecycleState.paused || state == AppLifecycleState.inactive) {
      _securityBloc.add(const LockAppEvent());
    } else if (state == AppLifecycleState.resumed) {
      // Re-trigger biometric authentication when user re-opens app
      _securityBloc.add(const AuthenticateUserEvent());
    }
  }

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider<SecurityBloc>.value(
          value: _securityBloc,
        ),
        BlocProvider<SettingsCubit>(
          create: (_) => di.sl<SettingsCubit>(),
        ),
        BlocProvider<TransactionBloc>(
          create: (_) => di.sl<TransactionBloc>()..add(const LoadTransactionsEvent()),
        ),
      ],
      child: BlocBuilder<SettingsCubit, AppSettings>(
        builder: (context, settings) {
          return MaterialApp(
            title: AppConstants.appName,
            debugShowCheckedModeBanner: false,
            theme: AppTheme.lightTheme,
            darkTheme: AppTheme.darkTheme,
            themeMode: settings.themeMode,
            home: BlocBuilder<SecurityBloc, SecurityState>(
              builder: (context, secState) {
                if (secState.isCompromised || secState.isLocked) {
                  return const BiometricLockScreen();
                }
                return const DashboardPage();
              },
            ),
          );
        },
      ),
    );
  }
}
