import { 
  User, InsertUser, Category, InsertCategory, Supplier, InsertSupplier, 
  Product, InsertProduct, Sale, InsertSale, SaleItem, InsertSaleItem,
  Setting, InsertSetting, ProductWithDetails, SaleWithItems, CategorySummary, DashboardSummary
} from "@shared/schema";

// Interface que define os métodos de armazenamento
export interface IStorage {
  // Usuários
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Categorias
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryByName(name: string): Promise<Category | undefined>;
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
  getProductsWithDetails(): Promise<ProductWithDetails[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductByCode(code: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Vendas
  getSales(): Promise<Sale[]>;
  getSalesWithItems(): Promise<SaleWithItems[]>;
  getSale(id: number): Promise<Sale | undefined>;
  getSaleWithItems(id: number): Promise<SaleWithItems | undefined>;
  createSale(sale: InsertSale, items: InsertSaleItem[]): Promise<Sale>;
  
  // Dashboard e Relatórios
  getDashboardSummary(): Promise<DashboardSummary>;
  getLowStockProducts(): Promise<ProductWithDetails[]>;
  
  // Configurações
  getSetting(key: string): Promise<string | undefined>;
  updateSetting(key: string, value: string): Promise<boolean>;
}

// Implementação do armazenamento em memória
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private suppliers: Map<number, Supplier>;
  private products: Map<number, Product>;
  private sales: Map<number, Sale>;
  private saleItems: Map<number, SaleItem>;
  private settings: Map<string, string>;
  
  private userId: number;
  private categoryId: number;
  private supplierId: number;
  private productId: number;
  private saleId: number;
  private saleItemId: number;
  
  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.suppliers = new Map();
    this.products = new Map();
    this.sales = new Map();
    this.saleItems = new Map();
    this.settings = new Map();
    
    this.userId = 1;
    this.categoryId = 1;
    this.supplierId = 1;
    this.productId = 1;
    this.saleId = 1;
    this.saleItemId = 1;
    
    // Inicializar com dados padrão
    this.initializeData();
  }
  
  private initializeData(): void {
    // Adicionar usuário admin
    this.createUser({
      username: "admin",
      password: "admin", // Em produção usar hashing
      name: "Admin",
      role: "admin"
    });
    
    // Adicionar algumas categorias
    const categorias = [
      { name: "Roupas", hasSize: true },
      { name: "Calçados", hasSize: true },
      { name: "Acessórios", hasSize: false },
      { name: "Eletrônicos", hasSize: false }
    ];
    
    categorias.forEach(cat => this.createCategory(cat));
    
    // Adicionar alguns fornecedores
    const fornecedores = [
      { name: "Fornecedor 1", contact: "João Silva", phone: "(11) 98765-4321", email: "fornecedor1@email.com" },
      { name: "Fornecedor 2", contact: "Maria Souza", phone: "(11) 91234-5678", email: "fornecedor2@email.com" },
      { name: "Fornecedor 3", contact: "Carlos Santos", phone: "(11) 99876-5432", email: "fornecedor3@email.com" }
    ];
    
    fornecedores.forEach(forn => this.createSupplier(forn));
  }
  
  // Implementação de usuários
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }
  
  // Implementação de categorias
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async getCategoryByName(name: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(cat => cat.name === name);
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  
  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const existing = this.categories.get(id);
    if (!existing) return undefined;
    
    const updated: Category = { ...existing, ...category };
    this.categories.set(id, updated);
    return updated;
  }
  
  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }
  
  // Implementação de fornecedores
  async getSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }
  
  async getSupplier(id: number): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }
  
  async createSupplier(supplier: InsertSupplier): Promise<Supplier> {
    const id = this.supplierId++;
    const newSupplier: Supplier = { ...supplier, id };
    this.suppliers.set(id, newSupplier);
    return newSupplier;
  }
  
  async updateSupplier(id: number, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const existing = this.suppliers.get(id);
    if (!existing) return undefined;
    
    const updated: Supplier = { ...existing, ...supplier };
    this.suppliers.set(id, updated);
    return updated;
  }
  
  async deleteSupplier(id: number): Promise<boolean> {
    return this.suppliers.delete(id);
  }
  
  // Implementação de produtos
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProductsWithDetails(): Promise<ProductWithDetails[]> {
    const products = Array.from(this.products.values());
    return Promise.all(products.map(async (prod) => {
      const category = await this.getCategory(prod.categoryId);
      const supplier = prod.supplierId ? await this.getSupplier(prod.supplierId) : undefined;
      
      return {
        ...prod,
        category: category?.name,
        supplier: supplier?.name
      };
    }));
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductByCode(code: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(prod => prod.code === code);
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const now = new Date();
    const newProduct: Product = { 
      ...product, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.products.set(id, newProduct);
    return newProduct;
  }
  
  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;
    
    const updated: Product = { 
      ...existing, 
      ...product, 
      updatedAt: new Date() 
    };
    this.products.set(id, updated);
    return updated;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }
  
  // Implementação de vendas
  async getSales(): Promise<Sale[]> {
    return Array.from(this.sales.values());
  }
  
  async getSalesWithItems(): Promise<SaleWithItems[]> {
    const sales = Array.from(this.sales.values());
    
    return Promise.all(sales.map(async (sale) => {
      const saleItems = Array.from(this.saleItems.values())
        .filter(item => item.saleId === sale.id);
      
      const itemsWithProducts = await Promise.all(saleItems.map(async (item) => {
        const product = await this.getProduct(item.productId);
        return { ...item, product: product! };
      }));
      
      return {
        ...sale,
        items: itemsWithProducts,
        itemCount: itemsWithProducts.length
      };
    }));
  }
  
  async getSale(id: number): Promise<Sale | undefined> {
    return this.sales.get(id);
  }
  
  async getSaleWithItems(id: number): Promise<SaleWithItems | undefined> {
    const sale = this.sales.get(id);
    if (!sale) return undefined;
    
    const saleItems = Array.from(this.saleItems.values())
      .filter(item => item.saleId === id);
    
    const itemsWithProducts = await Promise.all(saleItems.map(async (item) => {
      const product = await this.getProduct(item.productId);
      return { ...item, product: product! };
    }));
    
    return {
      ...sale,
      items: itemsWithProducts,
      itemCount: itemsWithProducts.length
    };
  }
  
  async createSale(sale: InsertSale, items: InsertSaleItem[]): Promise<Sale> {
    // Criar a venda
    const id = this.saleId++;
    const now = new Date();
    const newSale: Sale = { 
      ...sale, 
      id, 
      createdAt: now 
    };
    this.sales.set(id, newSale);
    
    // Adicionar os itens da venda
    for (const item of items) {
      const saleItemId = this.saleItemId++;
      const newItem: SaleItem = {
        ...item,
        id: saleItemId,
        saleId: id
      };
      this.saleItems.set(saleItemId, newItem);
      
      // Atualizar o estoque do produto
      const product = await this.getProduct(item.productId);
      if (product) {
        await this.updateProduct(item.productId, {
          quantity: product.quantity - item.quantity
        });
      }
    }
    
    return newSale;
  }
  
  // Dashboard e relatórios
  async getDashboardSummary(): Promise<DashboardSummary> {
    const products = await this.getProductsWithDetails();
    const lowStockProducts = products.filter(p => p.quantity <= p.minQuantity);
    
    // Calcular valores do estoque
    let totalStock = 0;
    let purchaseValue = 0;
    let potentialSales = 0;
    
    // Agrupar por categoria
    const categoriesMap = new Map<string, CategorySummary>();
    
    products.forEach(product => {
      const categoryName = product.category || "Sem categoria";
      const totalValue = product.quantity * product.buyPrice;
      const potentialValue = product.quantity * product.sellPrice;
      
      // Acumular totais
      purchaseValue += totalValue;
      potentialSales += potentialValue;
      totalStock += product.quantity;
      
      // Acumular por categoria
      if (!categoriesMap.has(categoryName)) {
        categoriesMap.set(categoryName, {
          name: categoryName,
          itemCount: 0,
          totalValue: 0,
          potentialValue: 0
        });
      }
      
      const categorySummary = categoriesMap.get(categoryName)!;
      categorySummary.itemCount += 1;
      categorySummary.totalValue += totalValue;
      categorySummary.potentialValue += potentialValue;
    });
    
    // Obter vendas recentes (5 mais recentes)
    const allSales = await this.getSalesWithItems();
    const recentSales = allSales
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);
    
    return {
      totalStock,
      purchaseValue,
      potentialSales,
      lowStockItems: lowStockProducts.length,
      categories: Array.from(categoriesMap.values()),
      recentSales
    };
  }
  
  async getLowStockProducts(): Promise<ProductWithDetails[]> {
    const products = await this.getProductsWithDetails();
    return products.filter(p => p.quantity <= p.minQuantity);
  }
  
  // Configurações
  async getSetting(key: string): Promise<string | undefined> {
    return this.settings.get(key);
  }
  
  async updateSetting(key: string, value: string): Promise<boolean> {
    this.settings.set(key, value);
    return true;
  }
}

export const storage = new MemStorage();
