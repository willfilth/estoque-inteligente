import { 
  users, type User, type InsertUser,
  company, type Company, type InsertCompany,
  categories, type Category, type InsertCategory,
  suppliers, type Supplier, type InsertSupplier,
  products, type Product, type InsertProduct,
  notifications, type Notification, type InsertNotification,
  sales, type Sale, type InsertSale,
  salesItems, type SaleItem, type InsertSaleItem
} from "@shared/schema";
import { db } from './db';
import { eq, desc } from 'drizzle-orm';

// Interface de armazenamento
export interface IStorage {
  // Usuários
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Empresa
  getCompany(): Promise<Company | undefined>;
  saveCompany(companyData: InsertCompany): Promise<Company>;
  
  // Categorias
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Fornecedores
  getSuppliers(): Promise<Supplier[]>;
  getSupplier(id: number): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: number, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined>;
  deleteSupplier(id: number): Promise<boolean>;
  
  // Produtos
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Notificações
  getNotifications(): Promise<Notification[]>;
  getNotification(id: number): Promise<Notification | undefined>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
  deleteNotification(id: number): Promise<boolean>;
  
  // Vendas
  getSales(): Promise<Sale[]>;
  getSale(id: number): Promise<Sale | undefined>;
  createSale(sale: InsertSale): Promise<Sale>;
  updateSale(id: number, sale: Partial<InsertSale>): Promise<Sale | undefined>;
  deleteSale(id: number): Promise<boolean>;
  
  // Itens de Venda
  getSaleItems(saleId: number): Promise<SaleItem[]>;
  addSaleItem(item: InsertSaleItem): Promise<SaleItem>;
  removeSaleItem(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // Usuários
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({...insertUser, createdAt: new Date()})
      .returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser || undefined;
  }

  // Empresa
  async getCompany(): Promise<Company | undefined> {
    const [companyData] = await db.select().from(company);
    return companyData || undefined;
  }

  async saveCompany(companyData: InsertCompany): Promise<Company> {
    const existingCompany = await this.getCompany();
    
    if (existingCompany) {
      const [updated] = await db
        .update(company)
        .set({...companyData, updatedAt: new Date()})
        .where(eq(company.id, existingCompany.id))
        .returning();
      return updated;
    } else {
      const [newCompany] = await db
        .insert(company)
        .values({...companyData, createdAt: new Date(), updatedAt: new Date()})
        .returning();
      return newCompany;
    }
  }

  // Categorias
  async getCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async createCategory(categoryData: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(categoryData)
      .returning();
    return category;
  }

  async updateCategory(id: number, categoryData: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updatedCategory] = await db
      .update(categories)
      .set(categoryData)
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory || undefined;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db
      .delete(categories)
      .where(eq(categories.id, id));
    return true; // Se não lançar erro, consideramos que foi deletado
  }

  // Fornecedores
  async getSuppliers(): Promise<Supplier[]> {
    return db.select().from(suppliers);
  }

  async getSupplier(id: number): Promise<Supplier | undefined> {
    const [supplier] = await db.select().from(suppliers).where(eq(suppliers.id, id));
    return supplier || undefined;
  }

  async createSupplier(supplierData: InsertSupplier): Promise<Supplier> {
    const [supplier] = await db
      .insert(suppliers)
      .values(supplierData)
      .returning();
    return supplier;
  }

  async updateSupplier(id: number, supplierData: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const [updatedSupplier] = await db
      .update(suppliers)
      .set(supplierData)
      .where(eq(suppliers.id, id))
      .returning();
    return updatedSupplier || undefined;
  }

  async deleteSupplier(id: number): Promise<boolean> {
    const result = await db
      .delete(suppliers)
      .where(eq(suppliers.id, id));
    return true;
  }

  // Produtos
  async getProducts(): Promise<Product[]> {
    return db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(productData)
      .returning();
    return product;
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set(productData)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct || undefined;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db
      .delete(products)
      .where(eq(products.id, id));
    return true;
  }

  // Notificações
  async getNotifications(): Promise<Notification[]> {
    return db.select().from(notifications).orderBy(desc(notifications.createdAt));
  }

  async getNotification(id: number): Promise<Notification | undefined> {
    const [notification] = await db.select().from(notifications).where(eq(notifications.id, id));
    return notification || undefined;
  }

  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values({
        ...notificationData,
        read: notificationData.read || false,
        createdAt: new Date()
      })
      .returning();
    return notification;
  }

  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const [updatedNotification] = await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id))
      .returning();
    return updatedNotification || undefined;
  }

  async deleteNotification(id: number): Promise<boolean> {
    const result = await db
      .delete(notifications)
      .where(eq(notifications.id, id));
    return true;
  }

  // Vendas
  async getSales(): Promise<Sale[]> {
    return db.select().from(sales).orderBy(desc(sales.createdAt));
  }

  async getSale(id: number): Promise<Sale | undefined> {
    const [sale] = await db.select().from(sales).where(eq(sales.id, id));
    return sale || undefined;
  }

  async createSale(saleData: InsertSale): Promise<Sale> {
    const [sale] = await db
      .insert(sales)
      .values({
        ...saleData,
        status: saleData.status || 'completed',
        createdAt: new Date()
      })
      .returning();
    return sale;
  }

  async updateSale(id: number, saleData: Partial<InsertSale>): Promise<Sale | undefined> {
    const [updatedSale] = await db
      .update(sales)
      .set(saleData)
      .where(eq(sales.id, id))
      .returning();
    return updatedSale || undefined;
  }

  async deleteSale(id: number): Promise<boolean> {
    // Deletar todos os itens de venda relacionados primeiro
    await db.delete(salesItems).where(eq(salesItems.saleId, id));
    
    // Depois deletar a venda
    const result = await db
      .delete(sales)
      .where(eq(sales.id, id));
    return true;
  }

  // Itens de Venda
  async getSaleItems(saleId: number): Promise<SaleItem[]> {
    return db.select().from(salesItems).where(eq(salesItems.saleId, saleId));
  }

  async addSaleItem(itemData: InsertSaleItem): Promise<SaleItem> {
    const [item] = await db
      .insert(salesItems)
      .values(itemData)
      .returning();
    return item;
  }

  async removeSaleItem(id: number): Promise<boolean> {
    const result = await db
      .delete(salesItems)
      .where(eq(salesItems.id, id));
    return true;
  }
}

// Verificar se já existe um usuário, se não, criar um padrão
const initializeDatabase = async () => {
  const storage = new DatabaseStorage();
  
  try {
    // Criar um usuário admin padrão se não existir nenhum
    const admin = await storage.getUserByUsername('admin');
    if (!admin) {
      await storage.createUser({
        username: 'admin',
        password: 'admin',
        name: 'Administrador',
        email: 'admin@example.com',
        role: 'admin'
      });
      console.log('Usuário admin criado com sucesso');
    }
    
    // Criar uma notificação inicial se não existir nenhuma
    const notifications = await storage.getNotifications();
    if (notifications.length === 0) {
      await storage.createNotification({
        title: 'Bem-vindo ao Estoque Inteligente',
        message: 'Este é o sistema de gerenciamento de estoque. Comece cadastrando sua empresa e seus produtos.',
        type: 'info'
      });
      console.log('Notificação inicial criada com sucesso');
    }
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
  }
};

// Inicializar o banco de dados quando o servidor iniciar
initializeDatabase();

// Exportar a instância de armazenamento baseada em banco de dados
export const storage = new DatabaseStorage();