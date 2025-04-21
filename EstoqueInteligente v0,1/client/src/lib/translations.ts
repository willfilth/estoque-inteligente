// Definindo uma interface para nossas traduções
export interface Translation {
  // Geral
  appName: string;
  loading: string;
  save: string;
  cancel: string;
  confirm: string;
  delete: string;
  edit: string;
  create: string;
  search: string;
  filter: string;
  selectOption: string;
  noData: string;

  // Navegação
  dashboard: string;
  inventory: string;
  sales: string;
  suppliers: string;
  reports: string;
  settings: string;

  // Dashboard
  totalStock: string;
  purchaseValue: string;
  potentialSales: string;
  lowStockItems: string;
  stockSummary: string;
  recentSales: string;
  category: string;
  itemCount: string;
  totalValue: string;
  potentialValue: string;

  // Inventário
  inventoryManagement: string;
  allCategories: string;
  allSuppliers: string;
  anyStock: string;
  lowStock: string;
  normalStock: string;
  newItem: string;
  exportExcel: string;
  exportPDF: string;
  totalItems: string;
  code: string;
  photo: string;
  name: string;
  supplier: string;
  subcategory: string;
  size: string;
  quantity: string;
  buyPrice: string;
  sellPrice: string;
  actions: string;
  addEditItem: string;
  productName: string;
  minQuantity: string;
  productPhoto: string;
  clearForm: string;

  // Vendas
  salesRecord: string;
  enterProductCode: string;
  price: string;
  stock: string;
  addToCart: string;
  cart: string;
  removeItem: string;
  subtotal: string;
  total: string;
  paymentMethod: string;
  cash: string;
  creditCard: string;
  debitCard: string;
  pix: string;
  finalizeSale: string;
  saleCompleted: string;
  change: string;
  print: string;

  // Fornecedores
  supplierManagement: string;
  newSupplier: string;
  supplierName: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  addEditSupplier: string;

  // Relatórios
  reportsAndAnalytics: string;
  salesByPeriod: string;
  stockReport: string;
  supplierReport: string;
  startDate: string;
  endDate: string;
  generateReport: string;

  // Configurações
  appearance: string;
  language: string;
  theme: string;
  light: string;
  dark: string;
  system: string;
  general: string;
  companyInfo: string;
  companyName: string;
  companyLogo: string;
  backupRestore: string;
  exportData: string;
  importData: string;
  resetSystem: string;
}

// Definindo as traduções para Português (Brasil)
export const ptBR: Translation = {
  // Geral
  appName: "Controle de Estoque",
  loading: "Carregando...",
  save: "Salvar",
  cancel: "Cancelar",
  confirm: "Confirmar",
  delete: "Excluir",
  edit: "Editar",
  create: "Criar",
  search: "Buscar",
  filter: "Filtrar",
  selectOption: "Selecione...",
  noData: "Nenhum dado encontrado",

  // Navegação
  dashboard: "Dashboard",
  inventory: "Estoque",
  sales: "Vendas",
  suppliers: "Fornecedores",
  reports: "Relatórios",
  settings: "Configurações",

  // Dashboard
  totalStock: "Total em Estoque",
  purchaseValue: "Valor Total (Compras)",
  potentialSales: "Valor Potencial (Vendas)",
  lowStockItems: "Itens em Estoque Baixo",
  stockSummary: "Resumo do Estoque",
  recentSales: "Últimas Vendas",
  category: "Categoria",
  itemCount: "Qtd Itens",
  totalValue: "Valor Total",
  potentialValue: "Valor Potencial",

  // Inventário
  inventoryManagement: "Gestão de Estoque",
  allCategories: "Todas categorias",
  allSuppliers: "Todos fornecedores",
  anyStock: "Qualquer estoque",
  lowStock: "Estoque baixo",
  normalStock: "Estoque normal",
  newItem: "Novo Item",
  exportExcel: "Exportar Excel",
  exportPDF: "Exportar PDF",
  totalItems: "Total de Itens",
  code: "Código",
  photo: "Foto",
  name: "Nome",
  supplier: "Fornecedor",
  subcategory: "Subcategoria",
  size: "Tamanho",
  quantity: "Quantidade",
  buyPrice: "Preço de Compra (R$)",
  sellPrice: "Preço de Venda (R$)",
  actions: "Ações",
  addEditItem: "Adicionar / Editar Item",
  productName: "Nome do Produto",
  minQuantity: "Estoque Mínimo",
  productPhoto: "Foto do Produto",
  clearForm: "Limpar",

  // Vendas
  salesRecord: "Registro de Vendas",
  enterProductCode: "Insira o código do produto",
  price: "Preço",
  stock: "Estoque",
  addToCart: "Adicionar ao Carrinho",
  cart: "Carrinho",
  removeItem: "Remover",
  subtotal: "Subtotal",
  total: "Total",
  paymentMethod: "Forma de Pagamento",
  cash: "Dinheiro",
  creditCard: "Cartão de Crédito",
  debitCard: "Cartão de Débito",
  pix: "PIX",
  finalizeSale: "Finalizar Venda",
  saleCompleted: "Venda Concluída",
  change: "Troco",
  print: "Imprimir",

  // Fornecedores
  supplierManagement: "Gestão de Fornecedores",
  newSupplier: "Novo Fornecedor",
  supplierName: "Nome do Fornecedor",
  contact: "Contato",
  email: "E-mail",
  phone: "Telefone",
  address: "Endereço",
  addEditSupplier: "Adicionar / Editar Fornecedor",

  // Relatórios
  reportsAndAnalytics: "Relatórios e Análises",
  salesByPeriod: "Vendas por Período",
  stockReport: "Relatório de Estoque",
  supplierReport: "Relatório de Fornecedores",
  startDate: "Data Inicial",
  endDate: "Data Final",
  generateReport: "Gerar Relatório",

  // Configurações
  appearance: "Aparência",
  language: "Idioma",
  theme: "Tema",
  light: "Claro",
  dark: "Escuro",
  system: "Sistema",
  general: "Geral",
  companyInfo: "Informações da Empresa",
  companyName: "Nome da Empresa",
  companyLogo: "Logo da Empresa",
  backupRestore: "Backup e Restauração",
  exportData: "Exportar Dados",
  importData: "Importar Dados",
  resetSystem: "Resetar Sistema"
};

// Definindo as traduções para Inglês
export const enUS: Translation = {
  // Geral
  appName: "Inventory Control",
  loading: "Loading...",
  save: "Save",
  cancel: "Cancel",
  confirm: "Confirm",
  delete: "Delete",
  edit: "Edit",
  create: "Create",
  search: "Search",
  filter: "Filter",
  selectOption: "Select...",
  noData: "No data found",

  // Navegação
  dashboard: "Dashboard",
  inventory: "Inventory",
  sales: "Sales",
  suppliers: "Suppliers",
  reports: "Reports",
  settings: "Settings",

  // Dashboard
  totalStock: "Total in Stock",
  purchaseValue: "Total Value (Purchases)",
  potentialSales: "Potential Value (Sales)",
  lowStockItems: "Low Stock Items",
  stockSummary: "Stock Summary",
  recentSales: "Recent Sales",
  category: "Category",
  itemCount: "Items Count",
  totalValue: "Total Value",
  potentialValue: "Potential Value",

  // Inventário
  inventoryManagement: "Inventory Management",
  allCategories: "All categories",
  allSuppliers: "All suppliers",
  anyStock: "Any stock",
  lowStock: "Low stock",
  normalStock: "Normal stock",
  newItem: "New Item",
  exportExcel: "Export Excel",
  exportPDF: "Export PDF",
  totalItems: "Total Items",
  code: "Code",
  photo: "Photo",
  name: "Name",
  supplier: "Supplier",
  subcategory: "Subcategory",
  size: "Size",
  quantity: "Quantity",
  buyPrice: "Purchase Price ($)",
  sellPrice: "Sale Price ($)",
  actions: "Actions",
  addEditItem: "Add / Edit Item",
  productName: "Product Name",
  minQuantity: "Minimum Stock",
  productPhoto: "Product Photo",
  clearForm: "Clear",

  // Vendas
  salesRecord: "Sales Record",
  enterProductCode: "Enter product code",
  price: "Price",
  stock: "Stock",
  addToCart: "Add to Cart",
  cart: "Cart",
  removeItem: "Remove",
  subtotal: "Subtotal",
  total: "Total",
  paymentMethod: "Payment Method",
  cash: "Cash",
  creditCard: "Credit Card",
  debitCard: "Debit Card",
  pix: "PIX",
  finalizeSale: "Finalize Sale",
  saleCompleted: "Sale Completed",
  change: "Change",
  print: "Print",

  // Fornecedores
  supplierManagement: "Supplier Management",
  newSupplier: "New Supplier",
  supplierName: "Supplier Name",
  contact: "Contact",
  email: "Email",
  phone: "Phone",
  address: "Address",
  addEditSupplier: "Add / Edit Supplier",

  // Relatórios
  reportsAndAnalytics: "Reports and Analytics",
  salesByPeriod: "Sales by Period",
  stockReport: "Stock Report",
  supplierReport: "Supplier Report",
  startDate: "Start Date",
  endDate: "End Date",
  generateReport: "Generate Report",

  // Configurações
  appearance: "Appearance",
  language: "Language",
  theme: "Theme",
  light: "Light",
  dark: "Dark",
  system: "System",
  general: "General",
  companyInfo: "Company Information",
  companyName: "Company Name",
  companyLogo: "Company Logo",
  backupRestore: "Backup and Restore",
  exportData: "Export Data",
  importData: "Import Data",
  resetSystem: "Reset System"
};

// Definindo as traduções para Espanhol
export const esES: Translation = {
  // Geral
  appName: "Control de Inventario",
  loading: "Cargando...",
  save: "Guardar",
  cancel: "Cancelar",
  confirm: "Confirmar",
  delete: "Eliminar",
  edit: "Editar",
  create: "Crear",
  search: "Buscar",
  filter: "Filtrar",
  selectOption: "Seleccionar...",
  noData: "Datos no encontrados",

  // Navegação
  dashboard: "Panel",
  inventory: "Inventario",
  sales: "Ventas",
  suppliers: "Proveedores",
  reports: "Informes",
  settings: "Configuración",

  // Dashboard
  totalStock: "Total en Inventario",
  purchaseValue: "Valor Total (Compras)",
  potentialSales: "Valor Potencial (Ventas)",
  lowStockItems: "Artículos con Poco Stock",
  stockSummary: "Resumen de Inventario",
  recentSales: "Ventas Recientes",
  category: "Categoría",
  itemCount: "Cantidad de Artículos",
  totalValue: "Valor Total",
  potentialValue: "Valor Potencial",

  // Inventário
  inventoryManagement: "Gestión de Inventario",
  allCategories: "Todas las categorías",
  allSuppliers: "Todos los proveedores",
  anyStock: "Cualquier stock",
  lowStock: "Poco stock",
  normalStock: "Stock normal",
  newItem: "Nuevo Artículo",
  exportExcel: "Exportar Excel",
  exportPDF: "Exportar PDF",
  totalItems: "Total de Artículos",
  code: "Código",
  photo: "Foto",
  name: "Nombre",
  supplier: "Proveedor",
  subcategory: "Subcategoría",
  size: "Tamaño",
  quantity: "Cantidad",
  buyPrice: "Precio de Compra ($)",
  sellPrice: "Precio de Venta ($)",
  actions: "Acciones",
  addEditItem: "Añadir / Editar Artículo",
  productName: "Nombre del Producto",
  minQuantity: "Stock Mínimo",
  productPhoto: "Foto del Producto",
  clearForm: "Limpiar",

  // Vendas
  salesRecord: "Registro de Ventas",
  enterProductCode: "Introduzca el código del producto",
  price: "Precio",
  stock: "Stock",
  addToCart: "Añadir al Carrito",
  cart: "Carrito",
  removeItem: "Eliminar",
  subtotal: "Subtotal",
  total: "Total",
  paymentMethod: "Método de Pago",
  cash: "Efectivo",
  creditCard: "Tarjeta de Crédito",
  debitCard: "Tarjeta de Débito",
  pix: "PIX",
  finalizeSale: "Finalizar Venta",
  saleCompleted: "Venta Completada",
  change: "Cambio",
  print: "Imprimir",

  // Fornecedores
  supplierManagement: "Gestión de Proveedores",
  newSupplier: "Nuevo Proveedor",
  supplierName: "Nombre del Proveedor",
  contact: "Contacto",
  email: "Correo Electrónico",
  phone: "Teléfono",
  address: "Dirección",
  addEditSupplier: "Añadir / Editar Proveedor",

  // Relatórios
  reportsAndAnalytics: "Informes y Análisis",
  salesByPeriod: "Ventas por Período",
  stockReport: "Informe de Inventario",
  supplierReport: "Informe de Proveedores",
  startDate: "Fecha de Inicio",
  endDate: "Fecha de Fin",
  generateReport: "Generar Informe",

  // Configurações
  appearance: "Apariencia",
  language: "Idioma",
  theme: "Tema",
  light: "Claro",
  dark: "Oscuro",
  system: "Sistema",
  general: "General",
  companyInfo: "Información de la Empresa",
  companyName: "Nombre de la Empresa",
  companyLogo: "Logo de la Empresa",
  backupRestore: "Copia de Seguridad y Restauración",
  exportData: "Exportar Datos",
  importData: "Importar Datos",
  resetSystem: "Reiniciar Sistema"
};

// Definindo as traduções para Francês
export const frFR: Translation = {
  // Geral
  appName: "Contrôle d'Inventaire",
  loading: "Chargement...",
  save: "Enregistrer",
  cancel: "Annuler",
  confirm: "Confirmer",
  delete: "Supprimer",
  edit: "Modifier",
  create: "Créer",
  search: "Rechercher",
  filter: "Filtrer",
  selectOption: "Sélectionner...",
  noData: "Aucune donnée trouvée",

  // Navegação
  dashboard: "Tableau de Bord",
  inventory: "Inventaire",
  sales: "Ventes",
  suppliers: "Fournisseurs",
  reports: "Rapports",
  settings: "Paramètres",

  // Dashboard
  totalStock: "Total en Stock",
  purchaseValue: "Valeur Totale (Achats)",
  potentialSales: "Valeur Potentielle (Ventes)",
  lowStockItems: "Articles en Stock Bas",
  stockSummary: "Résumé du Stock",
  recentSales: "Ventes Récentes",
  category: "Catégorie",
  itemCount: "Nombre d'Articles",
  totalValue: "Valeur Totale",
  potentialValue: "Valeur Potentielle",

  // Inventário
  inventoryManagement: "Gestion de l'Inventaire",
  allCategories: "Toutes les catégories",
  allSuppliers: "Tous les fournisseurs",
  anyStock: "Tous les stocks",
  lowStock: "Stock bas",
  normalStock: "Stock normal",
  newItem: "Nouvel Article",
  exportExcel: "Exporter Excel",
  exportPDF: "Exporter PDF",
  totalItems: "Total des Articles",
  code: "Code",
  photo: "Photo",
  name: "Nom",
  supplier: "Fournisseur",
  subcategory: "Sous-catégorie",
  size: "Taille",
  quantity: "Quantité",
  buyPrice: "Prix d'Achat (€)",
  sellPrice: "Prix de Vente (€)",
  actions: "Actions",
  addEditItem: "Ajouter / Modifier l'Article",
  productName: "Nom du Produit",
  minQuantity: "Stock Minimum",
  productPhoto: "Photo du Produit",
  clearForm: "Effacer",

  // Vendas
  salesRecord: "Registre des Ventes",
  enterProductCode: "Entrez le code du produit",
  price: "Prix",
  stock: "Stock",
  addToCart: "Ajouter au Panier",
  cart: "Panier",
  removeItem: "Supprimer",
  subtotal: "Sous-total",
  total: "Total",
  paymentMethod: "Méthode de Paiement",
  cash: "Espèces",
  creditCard: "Carte de Crédit",
  debitCard: "Carte de Débit",
  pix: "PIX",
  finalizeSale: "Finaliser la Vente",
  saleCompleted: "Vente Terminée",
  change: "Monnaie",
  print: "Imprimer",

  // Fornecedores
  supplierManagement: "Gestion des Fournisseurs",
  newSupplier: "Nouveau Fournisseur",
  supplierName: "Nom du Fournisseur",
  contact: "Contact",
  email: "E-mail",
  phone: "Téléphone",
  address: "Adresse",
  addEditSupplier: "Ajouter / Modifier le Fournisseur",

  // Relatórios
  reportsAndAnalytics: "Rapports et Analyses",
  salesByPeriod: "Ventes par Période",
  stockReport: "Rapport d'Inventaire",
  supplierReport: "Rapport des Fournisseurs",
  startDate: "Date de Début",
  endDate: "Date de Fin",
  generateReport: "Générer un Rapport",

  // Configurações
  appearance: "Apparence",
  language: "Langue",
  theme: "Thème",
  light: "Clair",
  dark: "Sombre",
  system: "Système",
  general: "Général",
  companyInfo: "Informations de l'Entreprise",
  companyName: "Nom de l'Entreprise",
  companyLogo: "Logo de l'Entreprise",
  backupRestore: "Sauvegarde et Restauration",
  exportData: "Exporter les Données",
  importData: "Importer les Données",
  resetSystem: "Réinitialiser le Système"
};

// Definindo as traduções para Italiano
export const itIT: Translation = {
  // Geral
  appName: "Controllo Inventario",
  loading: "Caricamento...",
  save: "Salva",
  cancel: "Annulla",
  confirm: "Conferma",
  delete: "Elimina",
  edit: "Modifica",
  create: "Crea",
  search: "Cerca",
  filter: "Filtra",
  selectOption: "Seleziona...",
  noData: "Nessun dato trovato",

  // Navegação
  dashboard: "Dashboard",
  inventory: "Inventario",
  sales: "Vendite",
  suppliers: "Fornitori",
  reports: "Rapporti",
  settings: "Impostazioni",

  // Dashboard
  totalStock: "Totale in Magazzino",
  purchaseValue: "Valore Totale (Acquisti)",
  potentialSales: "Valore Potenziale (Vendite)",
  lowStockItems: "Articoli con Scorte Basse",
  stockSummary: "Riepilogo delle Scorte",
  recentSales: "Vendite Recenti",
  category: "Categoria",
  itemCount: "Numero di Articoli",
  totalValue: "Valore Totale",
  potentialValue: "Valore Potenziale",

  // Inventário
  inventoryManagement: "Gestione Inventario",
  allCategories: "Tutte le categorie",
  allSuppliers: "Tutti i fornitori",
  anyStock: "Qualsiasi scorta",
  lowStock: "Scorta bassa",
  normalStock: "Scorta normale",
  newItem: "Nuovo Articolo",
  exportExcel: "Esporta Excel",
  exportPDF: "Esporta PDF",
  totalItems: "Totale Articoli",
  code: "Codice",
  photo: "Foto",
  name: "Nome",
  supplier: "Fornitore",
  subcategory: "Sottocategoria",
  size: "Taglia",
  quantity: "Quantità",
  buyPrice: "Prezzo d'Acquisto (€)",
  sellPrice: "Prezzo di Vendita (€)",
  actions: "Azioni",
  addEditItem: "Aggiungi / Modifica Articolo",
  productName: "Nome del Prodotto",
  minQuantity: "Scorta Minima",
  productPhoto: "Foto del Prodotto",
  clearForm: "Cancella",

  // Vendas
  salesRecord: "Registro delle Vendite",
  enterProductCode: "Inserisci il codice del prodotto",
  price: "Prezzo",
  stock: "Magazzino",
  addToCart: "Aggiungi al Carrello",
  cart: "Carrello",
  removeItem: "Rimuovi",
  subtotal: "Subtotale",
  total: "Totale",
  paymentMethod: "Metodo di Pagamento",
  cash: "Contanti",
  creditCard: "Carta di Credito",
  debitCard: "Carta di Debito",
  pix: "PIX",
  finalizeSale: "Finalizza Vendita",
  saleCompleted: "Vendita Completata",
  change: "Resto",
  print: "Stampa",

  // Fornecedores
  supplierManagement: "Gestione Fornitori",
  newSupplier: "Nuovo Fornitore",
  supplierName: "Nome del Fornitore",
  contact: "Contatto",
  email: "Email",
  phone: "Telefono",
  address: "Indirizzo",
  addEditSupplier: "Aggiungi / Modifica Fornitore",

  // Relatórios
  reportsAndAnalytics: "Rapporti e Analisi",
  salesByPeriod: "Vendite per Periodo",
  stockReport: "Rapporto Inventario",
  supplierReport: "Rapporto Fornitori",
  startDate: "Data di Inizio",
  endDate: "Data di Fine",
  generateReport: "Genera Rapporto",

  // Configurações
  appearance: "Aspetto",
  language: "Lingua",
  theme: "Tema",
  light: "Chiaro",
  dark: "Scuro",
  system: "Sistema",
  general: "Generale",
  companyInfo: "Informazioni Aziendali",
  companyName: "Nome dell'Azienda",
  companyLogo: "Logo dell'Azienda",
  backupRestore: "Backup e Ripristino",
  exportData: "Esporta Dati",
  importData: "Importa Dati",
  resetSystem: "Ripristina Sistema"
};

// Definindo as traduções para Alemão
export const deDE: Translation = {
  // Geral
  appName: "Bestandskontrolle",
  loading: "Wird geladen...",
  save: "Speichern",
  cancel: "Abbrechen",
  confirm: "Bestätigen",
  delete: "Löschen",
  edit: "Bearbeiten",
  create: "Erstellen",
  search: "Suchen",
  filter: "Filtern",
  selectOption: "Auswählen...",
  noData: "Keine Daten gefunden",

  // Navegação
  dashboard: "Dashboard",
  inventory: "Inventar",
  sales: "Verkäufe",
  suppliers: "Lieferanten",
  reports: "Berichte",
  settings: "Einstellungen",

  // Dashboard
  totalStock: "Gesamtbestand",
  purchaseValue: "Gesamtwert (Einkäufe)",
  potentialSales: "Potenzieller Wert (Verkäufe)",
  lowStockItems: "Artikel mit niedrigem Bestand",
  stockSummary: "Bestandsübersicht",
  recentSales: "Letzte Verkäufe",
  category: "Kategorie",
  itemCount: "Artikelanzahl",
  totalValue: "Gesamtwert",
  potentialValue: "Potenzieller Wert",

  // Inventário
  inventoryManagement: "Inventarverwaltung",
  allCategories: "Alle Kategorien",
  allSuppliers: "Alle Lieferanten",
  anyStock: "Beliebiger Bestand",
  lowStock: "Niedriger Bestand",
  normalStock: "Normaler Bestand",
  newItem: "Neuer Artikel",
  exportExcel: "Excel exportieren",
  exportPDF: "PDF exportieren",
  totalItems: "Gesamtartikel",
  code: "Code",
  photo: "Foto",
  name: "Name",
  supplier: "Lieferant",
  subcategory: "Unterkategorie",
  size: "Größe",
  quantity: "Menge",
  buyPrice: "Einkaufspreis (€)",
  sellPrice: "Verkaufspreis (€)",
  actions: "Aktionen",
  addEditItem: "Artikel hinzufügen / bearbeiten",
  productName: "Produktname",
  minQuantity: "Mindestbestand",
  productPhoto: "Produktfoto",
  clearForm: "Leeren",

  // Vendas
  salesRecord: "Verkaufsprotokoll",
  enterProductCode: "Produktcode eingeben",
  price: "Preis",
  stock: "Bestand",
  addToCart: "Zum Warenkorb hinzufügen",
  cart: "Warenkorb",
  removeItem: "Entfernen",
  subtotal: "Zwischensumme",
  total: "Gesamtsumme",
  paymentMethod: "Zahlungsmethode",
  cash: "Bargeld",
  creditCard: "Kreditkarte",
  debitCard: "Debitkarte",
  pix: "PIX",
  finalizeSale: "Verkauf abschließen",
  saleCompleted: "Verkauf abgeschlossen",
  change: "Wechselgeld",
  print: "Drucken",

  // Fornecedores
  supplierManagement: "Lieferantenverwaltung",
  newSupplier: "Neuer Lieferant",
  supplierName: "Lieferantenname",
  contact: "Kontakt",
  email: "E-Mail",
  phone: "Telefon",
  address: "Adresse",
  addEditSupplier: "Lieferant hinzufügen / bearbeiten",

  // Relatórios
  reportsAndAnalytics: "Berichte und Analysen",
  salesByPeriod: "Verkäufe nach Zeitraum",
  stockReport: "Bestandsbericht",
  supplierReport: "Lieferantenbericht",
  startDate: "Startdatum",
  endDate: "Enddatum",
  generateReport: "Bericht generieren",

  // Configurações
  appearance: "Erscheinungsbild",
  language: "Sprache",
  theme: "Thema",
  light: "Hell",
  dark: "Dunkel",
  system: "System",
  general: "Allgemein",
  companyInfo: "Unternehmensinformationen",
  companyName: "Unternehmensname",
  companyLogo: "Unternehmenslogo",
  backupRestore: "Sichern und Wiederherstellen",
  exportData: "Daten exportieren",
  importData: "Daten importieren",
  resetSystem: "System zurücksetzen"
};

// Definindo as traduções para Chinês Simplificado
export const zhCN: Translation = {
  // Geral
  appName: "库存控制",
  loading: "加载中...",
  save: "保存",
  cancel: "取消",
  confirm: "确认",
  delete: "删除",
  edit: "编辑",
  create: "创建",
  search: "搜索",
  filter: "筛选",
  selectOption: "选择...",
  noData: "未找到数据",

  // Navegação
  dashboard: "仪表盘",
  inventory: "库存",
  sales: "销售",
  suppliers: "供应商",
  reports: "报告",
  settings: "设置",

  // Dashboard
  totalStock: "库存总量",
  purchaseValue: "总价值（采购）",
  potentialSales: "潜在价值（销售）",
  lowStockItems: "低库存物品",
  stockSummary: "库存摘要",
  recentSales: "最近销售",
  category: "类别",
  itemCount: "物品数量",
  totalValue: "总价值",
  potentialValue: "潜在价值",

  // Inventário
  inventoryManagement: "库存管理",
  allCategories: "所有类别",
  allSuppliers: "所有供应商",
  anyStock: "任何库存",
  lowStock: "低库存",
  normalStock: "正常库存",
  newItem: "新物品",
  exportExcel: "导出Excel",
  exportPDF: "导出PDF",
  totalItems: "物品总数",
  code: "代码",
  photo: "照片",
  name: "名称",
  supplier: "供应商",
  subcategory: "子类别",
  size: "尺寸",
  quantity: "数量",
  buyPrice: "购买价格（¥）",
  sellPrice: "销售价格（¥）",
  actions: "操作",
  addEditItem: "添加/编辑物品",
  productName: "产品名称",
  minQuantity: "最小库存",
  productPhoto: "产品照片",
  clearForm: "清除",

  // Vendas
  salesRecord: "销售记录",
  enterProductCode: "输入产品代码",
  price: "价格",
  stock: "库存",
  addToCart: "添加到购物车",
  cart: "购物车",
  removeItem: "移除",
  subtotal: "小计",
  total: "总计",
  paymentMethod: "支付方式",
  cash: "现金",
  creditCard: "信用卡",
  debitCard: "借记卡",
  pix: "PIX",
  finalizeSale: "完成销售",
  saleCompleted: "销售已完成",
  change: "找零",
  print: "打印",

  // Fornecedores
  supplierManagement: "供应商管理",
  newSupplier: "新供应商",
  supplierName: "供应商名称",
  contact: "联系人",
  email: "电子邮件",
  phone: "电话",
  address: "地址",
  addEditSupplier: "添加/编辑供应商",

  // Relatórios
  reportsAndAnalytics: "报告和分析",
  salesByPeriod: "按期间销售",
  stockReport: "库存报告",
  supplierReport: "供应商报告",
  startDate: "开始日期",
  endDate: "结束日期",
  generateReport: "生成报告",

  // Configurações
  appearance: "外观",
  language: "语言",
  theme: "主题",
  light: "明亮",
  dark: "暗黑",
  system: "系统",
  general: "常规",
  companyInfo: "公司信息",
  companyName: "公司名称",
  companyLogo: "公司标志",
  backupRestore: "备份和恢复",
  exportData: "导出数据",
  importData: "导入数据",
  resetSystem: "重置系统"
};

// Definindo as traduções para Japonês
export const jaJP: Translation = {
  // Geral
  appName: "在庫管理",
  loading: "読み込み中...",
  save: "保存",
  cancel: "キャンセル",
  confirm: "確認",
  delete: "削除",
  edit: "編集",
  create: "作成",
  search: "検索",
  filter: "フィルター",
  selectOption: "選択...",
  noData: "データが見つかりません",

  // Navegação
  dashboard: "ダッシュボード",
  inventory: "在庫",
  sales: "販売",
  suppliers: "サプライヤー",
  reports: "レポート",
  settings: "設定",

  // Dashboard
  totalStock: "総在庫",
  purchaseValue: "総額（購入）",
  potentialSales: "潜在価値（販売）",
  lowStockItems: "在庫の少ないアイテム",
  stockSummary: "在庫概要",
  recentSales: "最近の販売",
  category: "カテゴリー",
  itemCount: "アイテム数",
  totalValue: "合計金額",
  potentialValue: "潜在価値",

  // Inventário
  inventoryManagement: "在庫管理",
  allCategories: "すべてのカテゴリー",
  allSuppliers: "すべてのサプライヤー",
  anyStock: "任意の在庫",
  lowStock: "在庫少",
  normalStock: "通常在庫",
  newItem: "新しいアイテム",
  exportExcel: "Excelにエクスポート",
  exportPDF: "PDFにエクスポート",
  totalItems: "総アイテム数",
  code: "コード",
  photo: "写真",
  name: "名前",
  supplier: "サプライヤー",
  subcategory: "サブカテゴリー",
  size: "サイズ",
  quantity: "数量",
  buyPrice: "購入価格（¥）",
  sellPrice: "販売価格（¥）",
  actions: "アクション",
  addEditItem: "アイテムの追加/編集",
  productName: "製品名",
  minQuantity: "最小在庫",
  productPhoto: "製品写真",
  clearForm: "クリア",

  // Vendas
  salesRecord: "販売記録",
  enterProductCode: "製品コードを入力",
  price: "価格",
  stock: "在庫",
  addToCart: "カートに追加",
  cart: "カート",
  removeItem: "削除",
  subtotal: "小計",
  total: "合計",
  paymentMethod: "支払方法",
  cash: "現金",
  creditCard: "クレジットカード",
  debitCard: "デビットカード",
  pix: "PIX",
  finalizeSale: "販売を確定",
  saleCompleted: "販売完了",
  change: "お釣り",
  print: "印刷",

  // Fornecedores
  supplierManagement: "サプライヤー管理",
  newSupplier: "新しいサプライヤー",
  supplierName: "サプライヤー名",
  contact: "連絡先",
  email: "メール",
  phone: "電話",
  address: "住所",
  addEditSupplier: "サプライヤーの追加/編集",

  // Relatórios
  reportsAndAnalytics: "レポートと分析",
  salesByPeriod: "期間別販売",
  stockReport: "在庫レポート",
  supplierReport: "サプライヤーレポート",
  startDate: "開始日",
  endDate: "終了日",
  generateReport: "レポート生成",

  // Configurações
  appearance: "外観",
  language: "言語",
  theme: "テーマ",
  light: "ライト",
  dark: "ダーク",
  system: "システム",
  general: "一般",
  companyInfo: "会社情報",
  companyName: "会社名",
  companyLogo: "会社ロゴ",
  backupRestore: "バックアップと復元",
  exportData: "データのエクスポート",
  importData: "データのインポート",
  resetSystem: "システムのリセット"
};

// Lista de idiomas disponíveis
export const availableLanguages = [
  { code: "pt-BR", name: "Português (Brasil)", translation: ptBR },
  { code: "en-US", name: "English (US)", translation: enUS },
  { code: "es-ES", name: "Español", translation: esES },
  { code: "fr-FR", name: "Français", translation: frFR },
  { code: "it-IT", name: "Italiano", translation: itIT },
  { code: "de-DE", name: "Deutsch", translation: deDE },
  { code: "zh-CN", name: "中文 (简体)", translation: zhCN },
  { code: "ja-JP", name: "日本語", translation: jaJP }
];

// Função para obter a tradução com base no código do idioma
export function getTranslation(languageCode: string): Translation {
  const language = availableLanguages.find(lang => lang.code === languageCode);
  return language?.translation || ptBR; // Retorna português como fallback
}