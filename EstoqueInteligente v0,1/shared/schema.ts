import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp, json, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Empresas
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  cnpj: text("cnpj").notNull().unique(),
  legalName: text("legal_name").notNull(),
  cep: text("cep").notNull(),
  street: text("street").notNull(),
  number: text("number"),
  noNumber: boolean("no_number").default(false),
  complement: text("complement"),
  neighborhood: text("neighborhood"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  email: text("email"),
  logo: text("logo"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isConfigured: boolean("is_configured").default(false),
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
  isConfigured: true,
});

// Telefones das empresas
export const companyPhones = pgTable("company_phones", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull(),
  number: text("number").notNull(),
  isWhatsapp: boolean("is_whatsapp").default(false),
});

export const insertCompanyPhoneSchema = createInsertSchema(companyPhones).omit({
  id: true,
});

// Usuários
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id"),
  username: text("username").notNull(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("user"),
  isActive: boolean("is_active").default(true),
  lastActive: timestamp("last_active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    companyUsernameIdx: uniqueIndex("company_username_idx").on(table.companyId, table.username),
  };
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  lastActive: true,
  isActive: true,
  createdAt: true,
});

// Categorias
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id"),
  name: text("name").notNull(),
  hasSize: boolean("has_size").notNull().default(false),
}, (table) => {
  return {
    companyNameIdx: uniqueIndex("company_category_name_idx").on(table.companyId, table.name),
  };
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

// Fornecedores
export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id"),
  name: text("name").notNull(),
  contact: text("contact"),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
}, (table) => {
  return {
    companyNameIdx: uniqueIndex("company_supplier_name_idx").on(table.companyId, table.name),
  };
});

export const insertSupplierSchema = createInsertSchema(suppliers).omit({
  id: true,
});

// Produtos
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id"),
  code: text("code").notNull(),
  name: text("name").notNull(),
  categoryId: integer("category_id").notNull(),
  supplierId: integer("supplier_id"),
  subcategory: text("subcategory"),
  size: text("size"),
  description: text("description").notNull(),
  photo: text("photo"),
  quantity: integer("quantity").notNull().default(0),
  minQuantity: integer("min_quantity").notNull().default(1),
  buyPrice: doublePrecision("buy_price").notNull(),
  sellPrice: doublePrecision("sell_price").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => {
  return {
    companyCodeIdx: uniqueIndex("company_product_code_idx").on(table.companyId, table.code),
  };
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Vendas
export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id"),
  userId: integer("user_id"),
  date: timestamp("date").notNull().defaultNow(),
  paymentMethod: text("payment_method").notNull(),
  total: doublePrecision("total").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSaleSchema = createInsertSchema(sales).omit({
  id: true,
  createdAt: true,
});

// Itens de venda
export const saleItems = pgTable("sale_items", {
  id: serial("id").primaryKey(),
  saleId: integer("sale_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: doublePrecision("price").notNull(),
  total: doublePrecision("total").notNull(),
});

export const insertSaleItemSchema = createInsertSchema(saleItems).omit({
  id: true,
});

// Configurações
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id"),
  key: text("key").notNull(),
  value: text("value").notNull(),
}, (table) => {
  return {
    companyKeyIdx: uniqueIndex("company_key_idx").on(table.companyId, table.key),
  };
});

export const insertSettingSchema = createInsertSchema(settings).omit({
  id: true,
});

// Tipos derivados
export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;

export type CompanyPhone = typeof companyPhones.$inferSelect;
export type InsertCompanyPhone = z.infer<typeof insertCompanyPhoneSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Sale = typeof sales.$inferSelect;
export type InsertSale = z.infer<typeof insertSaleSchema>;

export type SaleItem = typeof saleItems.$inferSelect;
export type InsertSaleItem = z.infer<typeof insertSaleItemSchema>;

export type Setting = typeof settings.$inferSelect;
export type InsertSetting = z.infer<typeof insertSettingSchema>;

// Tipos adicionais
export type CompanyWithPhones = Company & {
  phones: CompanyPhone[];
};

// Tipos adicionais para dashboard e relatórios
export type ProductWithDetails = Product & {
  category?: string;
  supplier?: string;
};

export type SaleWithItems = Sale & {
  items: (SaleItem & { product: Product })[];
  itemCount: number;
  userName?: string;
};

export type CategorySummary = {
  name: string;
  itemCount: number;
  totalValue: number;
  potentialValue: number;
};

export type DashboardSummary = {
  totalStock: number;
  purchaseValue: number;
  potentialSales: number;
  lowStockItems: number;
  categories: CategorySummary[];
  recentSales: SaleWithItems[];
};
