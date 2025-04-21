import { z } from 'zod';
import { pgTable, text, integer, serial, timestamp, doublePrecision, boolean, json } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';

// Usuários
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  role: true,
});

// Empresa
export const company = pgTable("company", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  cnpj: text("cnpj"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zip: text("zip"),
  phones: text("phones").array(),
  email: text("email"),
  logo: text("logo"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCompanySchema = createInsertSchema(company).pick({
  name: true,
  cnpj: true,
  address: true,
  city: true,
  state: true,
  zip: true,
  phones: true,
  email: true,
  logo: true,
});

// Categorias
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  description: true,
});

// Fornecedores
export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  cnpj: text("cnpj"),
  contact: text("contact"),
  email: text("email"),
  phone: text("phone"),
});

export const insertSupplierSchema = createInsertSchema(suppliers).pick({
  name: true,
  cnpj: true,
  contact: true,
  email: true,
  phone: true,
});

// Produtos
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  sku: text("sku"),
  price: integer("price").notNull(),
  cost: integer("cost"),
  quantity: integer("quantity").notNull(),
  minQuantity: integer("min_quantity"),
  categoryId: integer("category_id").references(() => categories.id),
  supplierId: integer("supplier_id").references(() => suppliers.id),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  sku: true,
  price: true,
  cost: true,
  quantity: true,
  minQuantity: true,
  categoryId: true,
  supplierId: true,
});

// Vendas
export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerDocument: text("customer_document"),
  totalAmount: integer("total_amount").notNull(),
  paymentMethod: text("payment_method").notNull(),
  status: text("status").default("completed").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSaleSchema = createInsertSchema(sales).pick({
  customerName: true,
  customerDocument: true,
  totalAmount: true,
  paymentMethod: true,
  status: true,
  notes: true,
});

// Itens de Venda
export const salesItems = pgTable("sales_items", {
  id: serial("id").primaryKey(),
  saleId: integer("sale_id").notNull().references(() => sales.id),
  productId: integer("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(),
  discount: integer("discount").default(0),
});

export const insertSaleItemSchema = createInsertSchema(salesItems).pick({
  saleId: true,
  productId: true,
  quantity: true,
  price: true,
  discount: true,
});

// Notificações
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").default("info"),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  title: true,
  message: true,
  type: true,
  read: true,
});

// Definindo as relações após todas as tabelas serem declaradas
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const suppliersRelations = relations(suppliers, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  supplier: one(suppliers, {
    fields: [products.supplierId],
    references: [suppliers.id],
  }),
  saleItems: many(salesItems),
}));

export const salesRelations = relations(sales, ({ many }) => ({
  items: many(salesItems),
}));

export const salesItemsRelations = relations(salesItems, ({ one }) => ({
  sale: one(sales, {
    fields: [salesItems.saleId],
    references: [sales.id],
  }),
  product: one(products, {
    fields: [salesItems.productId],
    references: [products.id],
  }),
}));

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof company.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type Supplier = typeof suppliers.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertSale = z.infer<typeof insertSaleSchema>;
export type Sale = typeof sales.$inferSelect;

export type InsertSaleItem = z.infer<typeof insertSaleItemSchema>;
export type SaleItem = typeof salesItems.$inferSelect;

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

export const phoneSchema = z.object({
  number: z.string().min(8),
  isWhatsapp: z.boolean().default(false),
  isMain: z.boolean().default(false),
  label: z.string().optional(),
});

export type Phone = z.infer<typeof phoneSchema>;