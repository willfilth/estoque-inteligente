import { 
  users, type User, type InsertUser,
  suppliers, type Supplier, type InsertSupplier,
  categories, type Category, type InsertCategory,
  products, type Product, type InsertProduct,
  alerts, type Alert, type InsertAlert
} from "@shared/schema";

// Interface do Storage
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Suppliers
  getSuppliers(): Promise<Supplier[]>;
  getSupplier(id: number): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: number, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined>;
  deleteSupplier(id: number): Promise<boolean>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySkuOrBarcode(skuOrBarcode: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  updateProductStock(id: number, quantity: number): Promise<Product | undefined>;
  getLowStockProducts(): Promise<Product[]>;

  // Alerts
  getAlerts(): Promise<Alert[]>;
  getAlert(id: number): Promise<Alert | undefined>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  markAlertAsRead(id: number): Promise<Alert | undefined>;
  getUnreadAlerts(): Promise<Alert[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private suppliers: Map<number, Supplier>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private alerts: Map<number, Alert>;

  private userCurrentId: number;
  private supplierCurrentId: number;
  private categoryCurrentId: number;
  private productCurrentId: number;
  private alertCurrentId: number;

  constructor() {
    this.users = new Map();
    this.suppliers = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.alerts = new Map();

    this.userCurrentId = 1;
    this.supplierCurrentId = 1;
    this.categoryCurrentId = 1;
    this.productCurrentId = 1;
    this.alertCurrentId = 1;

    // Inicializar com alguns dados para teste
    this.initializeDemoData();
  }

  // Inicializa dados de demonstração
  private initializeDemoData() {
    // Adicionar categorias
    const eletronicos = this.createCategory({ name: "Eletrônicos", description: "Dispositivos eletrônicos em geral" });
    const perifericos = this.createCategory({ name: "Periféricos", description: "Periféricos para computadores" });
    const monitores = this.createCategory({ name: "Monitores", description: "Monitores e displays" });
    
    // Adicionar subcategorias
    const teclados = this.createCategory({ name: "Teclados", description: "Teclados diversos", parentId: perifericos.id });
    const mouses = this.createCategory({ name: "Mouses", description: "Mouses diversos", parentId: perifericos.id });
    const ultrawide = this.createCategory({ name: "Ultrawide", description: "Monitores ultrawide", parentId: monitores.id });

    // Adicionar fornecedores
    const techSupply = this.createSupplier({ 
      name: "TechSupply Ltda", 
      contact: "Carlos Silva", 
      email: "contato@techsupply.com", 
      phone: "(11) 98765-4321" 
    });
    
    const electronicImports = this.createSupplier({ 
      name: "Eletronic Imports S.A.", 
      contact: "Ana Souza", 
      email: "vendas@electronicimports.com", 
      phone: "(21) 91234-5678" 
    });

    const computerParts = this.createSupplier({ 
      name: "ComputerParts Brasil", 
      contact: "João Oliveira", 
      email: "joao@computerparts.com.br", 
      phone: "(31) 98877-6655" 
    });

    // Adicionar produtos
    this.createProduct({
      name: "Monitor Ultra-wide 29\"",
      sku: "MON-UW-29",
      barcode: "7891234567890",
      description: "Monitor ultrawide para maior produtividade",
      categoryId: ultrawide.id,
      supplierId: techSupply.id,
      costPrice: 1500,
      salePrice: 1899,
      stock: 8,
      minStock: 3,
      imageUrls: ["https://images.unsplash.com/photo-1611078489935-0cb964de46d6"]
    });

    this.createProduct({
      name: "Teclado Mecânico RGB",
      sku: "TEC-MEC-RGB",
      barcode: "7899876543210",
      description: "Teclado mecânico com iluminação RGB",
      categoryId: teclados.id,
      supplierId: electronicImports.id,
      costPrice: 300,
      salePrice: 399.9,
      stock: 2,
      minStock: 5,
      imageUrls: ["https://images.unsplash.com/photo-1613141411244-0e4ac259d217"]
    });

    this.createProduct({
      name: "Mouse sem fio",
      sku: "MOU-SEM-FIO",
      barcode: "7890123456789",
      description: "Mouse sem fio com sensor de precisão",
      categoryId: mouses.id,
      supplierId: computerParts.id,
      costPrice: 120,
      salePrice: 159.9,
      stock: 5,
      minStock: 8,
      imageUrls: ["https://images.unsplash.com/photo-1605773527852-c546a8584ea3"]
    });

    // Criar alertas para produtos com estoque baixo
    this.createAlert({
      type: "low_stock",
      message: "Teclado Mecânico RGB - restam apenas 2 unidades",
      productId: 2,
      read: false
    });

    this.createAlert({
      type: "low_stock",
      message: "Monitor 24\" UltraWide - restam apenas 3 unidades",
      productId: 1,
      read: false
    });

    this.createAlert({
      type: "low_stock",
      message: "Mouse sem fio - restam apenas 5 unidades",
      productId: 3,
      read: false
    });
  }

  // Implementação dos métodos de usuário
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  // Implementação dos métodos de fornecedor
  async getSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async getSupplier(id: number): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const id = this.supplierCurrentId++;
    const now = new Date();
    const supplier: Supplier = { ...insertSupplier, id, createdAt: now };
    this.suppliers.set(id, supplier);
    return supplier;
  }

  async updateSupplier(id: number, supplierData: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const supplier = this.suppliers.get(id);
    if (!supplier) return undefined;

    const updatedSupplier = { ...supplier, ...supplierData };
    this.suppliers.set(id, updatedSupplier);
    return updatedSupplier;
  }

  async deleteSupplier(id: number): Promise<boolean> {
    return this.suppliers.delete(id);
  }

  // Implementação dos métodos de categoria
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryCurrentId++;
    const now = new Date();
    const category: Category = { ...insertCategory, id, createdAt: now };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: number, categoryData: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;

    const updatedCategory = { ...category, ...categoryData };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    // Verificar se há subcategorias que dependem desta categoria
    const hasSubcategories = Array.from(this.categories.values()).some(
      category => category.parentId === id
    );

    // Verificar se há produtos que usam esta categoria
    const hasProducts = Array.from(this.products.values()).some(
      product => product.categoryId === id
    );

    if (hasSubcategories || hasProducts) {
      return false;
    }

    return this.categories.delete(id);
  }

  // Implementação dos métodos de produto
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySkuOrBarcode(skuOrBarcode: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      product => product.sku === skuOrBarcode || product.barcode === skuOrBarcode
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productCurrentId++;
    const now = new Date();
    const product: Product = { 
      ...insertProduct, 
      id, 
      createdAt: now, 
      updatedAt: now,
      imageUrls: insertProduct.imageUrls || []
    };
    this.products.set(id, product);

    // Verificar se o estoque está abaixo do mínimo
    if (product.stock < product.minStock) {
      await this.createAlert({
        type: "low_stock",
        message: `${product.name} - restam apenas ${product.stock} unidades`,
        productId: product.id,
        read: false
      });
    }
    
    return product;
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const now = new Date();
    const updatedProduct = { ...product, ...productData, updatedAt: now };
    this.products.set(id, updatedProduct);

    // Verificar se o estoque está abaixo do mínimo
    if (productData.stock !== undefined && productData.stock < (productData.minStock || product.minStock)) {
      await this.createAlert({
        type: "low_stock",
        message: `${updatedProduct.name} - restam apenas ${updatedProduct.stock} unidades`,
        productId: updatedProduct.id,
        read: false
      });
    }

    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  async updateProductStock(id: number, quantity: number): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const now = new Date();
    const newStock = product.stock + quantity;
    const updatedProduct = { ...product, stock: newStock, updatedAt: now };
    this.products.set(id, updatedProduct);

    // Verificar se o estoque ficou abaixo do mínimo
    if (newStock < product.minStock) {
      await this.createAlert({
        type: "low_stock",
        message: `${product.name} - restam apenas ${newStock} unidades`,
        productId: product.id,
        read: false
      });
    }

    return updatedProduct;
  }

  async getLowStockProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.stock < product.minStock
    );
  }

  // Implementação dos métodos de alerta
  async getAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values());
  }

  async getAlert(id: number): Promise<Alert | undefined> {
    return this.alerts.get(id);
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = this.alertCurrentId++;
    const now = new Date();
    const alert: Alert = { ...insertAlert, id, createdAt: now };
    this.alerts.set(id, alert);
    return alert;
  }

  async markAlertAsRead(id: number): Promise<Alert | undefined> {
    const alert = this.alerts.get(id);
    if (!alert) return undefined;

    const updatedAlert = { ...alert, read: true };
    this.alerts.set(id, updatedAlert);
    return updatedAlert;
  }

  async getUnreadAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values()).filter(
      alert => !alert.read
    );
  }
}

// Substituindo MemStorage por DatabaseStorage para persistência dos dados
import { db } from './db';
import { eq, lt, and, isNull, sql } from 'drizzle-orm';

export class DatabaseStorage implements IStorage {
  constructor() {
    // Inicializa dados de demonstração quando não houver registros
    this.initializeDemoData();
  }

  private async initializeDemoData() {
    try {
      // Verifica se já existem dados
      const existingUsers = await db.select({ count: sql`count(*)` }).from(users);
      const userCount = Number(existingUsers[0].count);
      
      if (userCount === 0) {
        console.log("[DatabaseStorage] Inicializando dados de demonstração");
        
        // Criar usuário admin
        await db.insert(users).values({
          username: "admin",
          password: "admin123", // Em produção, usaríamos hash
          name: "Administrador",
          email: "admin@example.com",
          role: "admin"
        });
        
        // Criar categorias
        const [hardware] = await db.insert(categories).values({
          name: "Hardware",
          description: "Componentes físicos de computador"
        }).returning();
        
        const [perifericos] = await db.insert(categories).values({
          name: "Periféricos",
          description: "Dispositivos externos para computador",
          parentId: hardware.id
        }).returning();
        
        const [redes] = await db.insert(categories).values({
          name: "Redes",
          description: "Equipamentos de rede e conectividade"
        }).returning();
        
        // Criar fornecedores
        const [fornecedor1] = await db.insert(suppliers).values({
          name: "TechSupply Ltda",
          contact: "João Silva",
          email: "contato@techsupply.com",
          phone: "(11) 98765-4321"
        }).returning();
        
        const [fornecedor2] = await db.insert(suppliers).values({
          name: "Distribuidora InfoTech",
          contact: "Maria Oliveira",
          email: "vendas@infotech.com",
          phone: "(11) 91234-5678"
        }).returning();
        
        // Criar produtos
        await db.insert(products).values({
          name: "Teclado Mecânico RGB",
          sku: "TEC001",
          barcode: "7891234567890",
          description: "Teclado mecânico com iluminação RGB",
          categoryId: perifericos.id,
          supplierId: fornecedor1.id,
          costPrice: 150,
          salePrice: 249.99,
          stock: 5,
          minStock: 10,
          imageUrls: ["https://example.com/teclado.jpg"]
        });
        
        await db.insert(products).values({
          name: "Mouse Gamer 6400dpi",
          sku: "MOU001",
          barcode: "7891234567891",
          description: "Mouse gamer de alta precisão",
          categoryId: perifericos.id,
          supplierId: fornecedor1.id,
          costPrice: 80,
          salePrice: 129.90,
          stock: 15,
          minStock: 8,
          imageUrls: ["https://example.com/mouse.jpg"]
        });
        
        await db.insert(products).values({
          name: "Roteador Wireless AC1200",
          sku: "ROT001",
          barcode: "7891234567892",
          description: "Roteador dual band com tecnologia AC",
          categoryId: redes.id,
          supplierId: fornecedor2.id,
          costPrice: 180,
          salePrice: 249.90,
          stock: 12,
          minStock: 5,
          imageUrls: ["https://example.com/roteador.jpg"]
        });
        
        // Criar alertas para produtos com estoque baixo
        await db.insert(alerts).values({
          type: "low_stock",
          message: "Teclado Mecânico RGB está com estoque abaixo do mínimo",
          productId: 1,
          read: false
        });
        
        console.log("[DatabaseStorage] Dados de demonstração inicializados com sucesso");
      } else {
        console.log("[DatabaseStorage] Banco de dados já contém dados, pulando inicialização");
      }
    } catch (error) {
      console.error("[DatabaseStorage] Erro ao inicializar dados de demonstração:", error);
    }
  }
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getSuppliers(): Promise<Supplier[]> {
    return await db.select().from(suppliers).orderBy(suppliers.name);
  }

  async getSupplier(id: number): Promise<Supplier | undefined> {
    const [supplier] = await db.select().from(suppliers).where(eq(suppliers.id, id));
    return supplier;
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const [supplier] = await db.insert(suppliers).values(insertSupplier).returning();
    return supplier;
  }

  async updateSupplier(id: number, supplierData: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const [updatedSupplier] = await db
      .update(suppliers)
      .set(supplierData)
      .where(eq(suppliers.id, id))
      .returning();
    return updatedSupplier;
  }

  async deleteSupplier(id: number): Promise<boolean> {
    const result = await db.delete(suppliers).where(eq(suppliers.id, id));
    return true;
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.name);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  async updateCategory(id: number, categoryData: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updatedCategory] = await db
      .update(categories)
      .set(categoryData)
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return true;
  }

  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(products.name);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductBySkuOrBarcode(skuOrBarcode: string): Promise<Product | undefined> {
    const [product] = await db
      .select()
      .from(products)
      .where(
        eq(products.sku, skuOrBarcode)
      );
    
    if (product) return product;
    
    const [barcodeProduct] = await db
      .select()
      .from(products)
      .where(
        eq(products.barcode, skuOrBarcode)
      );
    
    return barcodeProduct;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set(productData)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return true;
  }

  async updateProductStock(id: number, quantity: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    if (!product) return undefined;
    
    const newStock = product.stock + quantity;
    
    const [updatedProduct] = await db
      .update(products)
      .set({ stock: newStock })
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async getLowStockProducts(): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(
        lt(products.stock, products.minStock)
      );
  }

  async getAlerts(): Promise<Alert[]> {
    return await db.select().from(alerts).orderBy(alerts.createdAt);
  }

  async getAlert(id: number): Promise<Alert | undefined> {
    const [alert] = await db.select().from(alerts).where(eq(alerts.id, id));
    return alert;
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const [alert] = await db.insert(alerts).values(insertAlert).returning();
    return alert;
  }

  async markAlertAsRead(id: number): Promise<Alert | undefined> {
    const [updatedAlert] = await db
      .update(alerts)
      .set({ read: true })
      .where(eq(alerts.id, id))
      .returning();
    return updatedAlert;
  }

  async getUnreadAlerts(): Promise<Alert[]> {
    return await db
      .select()
      .from(alerts)
      .where(
        eq(alerts.read, false)
      )
      .orderBy(alerts.createdAt);
  }
}

export const storage = new DatabaseStorage();
