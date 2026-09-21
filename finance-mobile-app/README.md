# FinTrack Pro - Mobile Personal Finance App 📱💰

Aplicación móvil multiplataforma de Finanzas Personales para el control de gastos e ingresos, desarrollada con **Flutter**, **Dart null-safety**, **Clean Architecture (Feature-first)**, **BLoC Pattern** y persistencia local offline-first con **Hive**.

---

## 🏛️ 1. Arquitectura del Proyecto

El proyecto implementa los principios de **Clean Architecture** organizados por features para máxima separación de responsabilidades y testeabilidad:

```text
lib/
├── main.dart                                   # Punto de entrada de la app
├── core/                                       # Capa compartida y utilidades transversales
│   ├── constants/
│   │   └── app_constants.dart                  # Constantes globales y símbolos de monedas
│   ├── di/
│   │   └── injection_container.dart            # Inyección de dependencias con GetIt y registro Hive
│   ├── error/
│   │   └── failures.dart                       # Clases de fallos fuertemente tipadas
│   ├── theme/
│   │   └── app_theme.dart                      # Temas adaptativos Material 3 (Dark / Light)
│   └── utils/
│       ├── currency_formatter.dart             # Formateo de monedas y compact numbers
│       └── date_formatter.dart                 # Formateo relativo y fechas en español
└── features/
    ├── transactions/                           # Feature principal de ingresos y gastos
    │   ├── domain/                             # Reglas de negocio puras (independientes de UI/DB)
    │   │   ├── entities/
    │   │   │   ├── transaction.dart            # Entidad Transaction
    │   │   │   ├── category.dart               # Entidad Category
    │   │   │   ├── transaction_type.dart       # Enum TransactionType (income, expense)
    │   │   │   └── payment_method.dart         # Enum PaymentMethod (cash, debit, credit)
    │   │   ├── repositories/
    │   │   │   └── transaction_repository.dart # Interfaz abstracta del repositorio
    │   │   └── usecases/
    │   │       ├── get_transactions_usecase.dart
    │   │       ├── add_transaction_usecase.dart
    │   │       ├── delete_transaction_usecase.dart
    │   │       └── get_categories_usecase.dart
    │   ├── data/                               # Implementación y persistencia
    │   │   ├── models/
    │   │   │   ├── transaction_model.dart      # Modelo con TypeAdapter Hive y mappers
    │   │   │   └── category_model.dart         # Modelo Category con TypeAdapter Hive
    │   │   ├── datasources/
    │   │   │   ├── transaction_local_data_source.dart # Operaciones CRUD en Hive Boxes
    │   │   │   └── default_categories.dart     # Semilla de categorías iniciales
    │   │   └── repositories/
    │   │       └── transaction_repository_impl.dart   # Implementación del repositorio
    │   └── presentation/                       # Capa visual e interacción
    │       ├── bloc/
    │       │   ├── transaction_bloc.dart       # BLoC para gestión de estado
    │       │   ├── transaction_event.dart      # Eventos de transacción y filtros
    │       │   └── transaction_state.dart      # Estados y métricas financieras calculadas
    │       ├── pages/
    │       │   ├── dashboard_page.dart         # Pantalla principal (Dashboard)
    │       │   ├── add_transaction_page.dart   # Formulario con validación de inputs
    │       │   └── transactions_history_page.dart # Historial con búsqueda y filtros
    │       └── widgets/
    │           ├── balance_summary_card.dart   # Card de saldo total, ingresos y gastos
    │           ├── category_breakdown_chart.dart # Gráfico de dona con fl_chart
    │           ├── recent_transactions_list.dart # Lista de transacciones recientes
    │           ├── category_grid_selector.dart # Grid visual de selección de categorías
    │           └── currency_amount_input.dart  # Input numérico con máscara de moneda
    └── settings/                               # Configuración de usuario
        ├── domain/
        │   └── settings_entity.dart            # Entidad de preferencias
        └── presentation/
            └── cubit/
                └── settings_cubit.dart         # Cubit para selección de moneda y tema
```

---

## ⚡ 2. Dependencias Clave (`pubspec.yaml`)

- **Gestión de Estado:** `flutter_bloc: ^8.1.6`, `bloc: ^8.1.4`, `equatable: ^2.0.5`.
- **Inyección de Dependencias:** `get_it: ^7.7.0`.
- **Almacenamiento Local Offline-First:** `hive: ^2.2.3`, `hive_flutter: ^1.1.0`.
- **Visualización de Datos:** `fl_chart: ^0.68.0`.
- **UI & Estilo:** `google_fonts: ^6.2.1`, `intl: ^0.19.0`, `uuid: ^4.4.0`.

---

## 🚀 3. Cómo Ejecutar la Aplicación

### Requisitos Previos
- Flutter SDK `>=3.3.0` instalado.
- Emulador Android o Simulador iOS iniciado.

### Pasos
```bash
# 1. Navegar al directorio del proyecto
cd finance-mobile-app

# 2. Descargar las dependencias de Flutter
flutter pub get

# 3. Ejecutar la aplicación en tu dispositivo/emulador
flutter run
```

---

## 🔒 4. Seguridad, Robustez y Buenas Prácticas
1. **Offline-First:** No requiere conexión de red; los datos se persisten en binario con Hive de forma instantánea.
2. **Fuertemente Tipado:** Dart null-safety estricto (`analysis_options.yaml` con `strict-casts`, `strict-inference`).
3. **Manejo de Errores Desacoplado:** Reglas de validación en usecases que previenen montos negativos o títulos vacíos.
