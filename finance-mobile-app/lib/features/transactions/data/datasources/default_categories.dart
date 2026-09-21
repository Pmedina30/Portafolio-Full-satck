import 'package:flutter/material.dart';
import '../../domain/entities/transaction_type.dart';
import '../models/category_model.dart';

final List<CategoryModel> defaultCategories = [
  // Gastos
  CategoryModel(
    id: 'cat_food',
    name: 'Alimentación',
    iconCode: Icons.restaurant.codePoint,
    colorHex: '#FF6B6B',
    type: TransactionType.expense,
  ),
  CategoryModel(
    id: 'cat_transport',
    name: 'Transporte',
    iconCode: Icons.directions_car.codePoint,
    colorHex: '#4D96FF',
    type: TransactionType.expense,
  ),
  CategoryModel(
    id: 'cat_housing',
    name: 'Vivienda y Servicios',
    iconCode: Icons.home.codePoint,
    colorHex: '#6BCB77',
    type: TransactionType.expense,
  ),
  CategoryModel(
    id: 'cat_entertainment',
    name: 'Entretenimiento',
    iconCode: Icons.sports_esports.codePoint,
    colorHex: '#9D4EDD',
    type: TransactionType.expense,
  ),
  CategoryModel(
    id: 'cat_health',
    name: 'Salud',
    iconCode: Icons.favorite.codePoint,
    colorHex: '#E63946',
    type: TransactionType.expense,
  ),
  CategoryModel(
    id: 'cat_shopping',
    name: 'Compras',
    iconCode: Icons.shopping_bag.codePoint,
    colorHex: '#F77F00',
    type: TransactionType.expense,
  ),
  CategoryModel(
    id: 'cat_education',
    name: 'Educación',
    iconCode: Icons.school.codePoint,
    colorHex: '#118AB2',
    type: TransactionType.expense,
  ),

  // Ingresos
  CategoryModel(
    id: 'cat_salary',
    name: 'Salario',
    iconCode: Icons.account_balance_wallet.codePoint,
    colorHex: '#06D6A0',
    type: TransactionType.income,
  ),
  CategoryModel(
    id: 'cat_freelance',
    name: 'Freelance & Consultoría',
    iconCode: Icons.computer.codePoint,
    colorHex: '#48CAE4',
    type: TransactionType.income,
  ),
  CategoryModel(
    id: 'cat_investment',
    name: 'Inversiones & Dividendos',
    iconCode: Icons.trending_up.codePoint,
    colorHex: '#7209B7',
    type: TransactionType.income,
  ),
  CategoryModel(
    id: 'cat_bonus',
    name: 'Premios y Bonos',
    iconCode: Icons.military_tech.codePoint,
    colorHex: '#FFB703',
    type: TransactionType.income,
  ),
];
