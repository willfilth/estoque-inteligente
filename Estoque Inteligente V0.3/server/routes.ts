import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertCompanySchema, 
  insertCategorySchema, 
  insertSupplierSchema, 
  insertProductSchema,
  insertNotificationSchema,
  insertSaleSchema,
  insertSaleItemSchema,
  phoneSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  const apiRouter = express.Router();
  
  // Middleware para verificar erros de validação do Zod
  const validateRequest = (schema: z.ZodType<any, any>) => {
    return (req: Request, res: Response, next: Function) => {
      try {
        req.body = schema.parse(req.body);
        next();
      } catch (error: any) {
        return res.status(400).json({ 
          message: "Erro de validação", 
          errors: error.errors || error.message
        });
      }
    };
  };

  // Rotas para empresa
  apiRouter.get("/company", async (_req, res) => {
    const company = await storage.getCompany();
    res.json(company || null);
  });

  apiRouter.post("/company", validateRequest(insertCompanySchema), async (req, res) => {
    try {
      // Garantir que os telefones estão no formato correto
      if (req.body.phones) {
        req.body.phones = req.body.phones.map((phone: any) => phoneSchema.parse(phone));
      }
      
      const company = await storage.saveCompany(req.body);
      res.json(company);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Rotas para categorias
  apiRouter.get("/categories", async (_req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  apiRouter.get("/categories/:id", async (req, res) => {
    const category = await storage.getCategory(Number(req.params.id));
    if (!category) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }
    res.json(category);
  });

  apiRouter.post("/categories", validateRequest(insertCategorySchema), async (req, res) => {
    try {
      const category = await storage.createCategory(req.body);
      res.status(201).json(category);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  apiRouter.put("/categories/:id", validateRequest(insertCategorySchema.partial()), async (req, res) => {
    try {
      const category = await storage.updateCategory(Number(req.params.id), req.body);
      if (!category) {
        return res.status(404).json({ message: "Categoria não encontrada" });
      }
      res.json(category);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  apiRouter.delete("/categories/:id", async (req, res) => {
    const deleted = await storage.deleteCategory(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }
    res.status(204).send();
  });

  // Rotas para fornecedores
  apiRouter.get("/suppliers", async (_req, res) => {
    const suppliers = await storage.getSuppliers();
    res.json(suppliers);
  });

  apiRouter.get("/suppliers/:id", async (req, res) => {
    const supplier = await storage.getSupplier(Number(req.params.id));
    if (!supplier) {
      return res.status(404).json({ message: "Fornecedor não encontrado" });
    }
    res.json(supplier);
  });

  apiRouter.post("/suppliers", validateRequest(insertSupplierSchema), async (req, res) => {
    try {
      const supplier = await storage.createSupplier(req.body);
      res.status(201).json(supplier);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  apiRouter.put("/suppliers/:id", validateRequest(insertSupplierSchema.partial()), async (req, res) => {
    try {
      const supplier = await storage.updateSupplier(Number(req.params.id), req.body);
      if (!supplier) {
        return res.status(404).json({ message: "Fornecedor não encontrado" });
      }
      res.json(supplier);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  apiRouter.delete("/suppliers/:id", async (req, res) => {
    const deleted = await storage.deleteSupplier(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ message: "Fornecedor não encontrado" });
    }
    res.status(204).send();
  });

  // Rotas para produtos
  apiRouter.get("/products", async (_req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  apiRouter.get("/products/:id", async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }
    res.json(product);
  });

  apiRouter.post("/products", validateRequest(insertProductSchema), async (req, res) => {
    try {
      // Garantir que os campos numéricos sejam convertidos corretamente
      const data = {
        ...req.body,
        price: Number(req.body.price),
        cost: req.body.cost ? Number(req.body.cost) : undefined,
        quantity: Number(req.body.quantity),
        minQuantity: req.body.minQuantity ? Number(req.body.minQuantity) : undefined,
        categoryId: req.body.categoryId ? Number(req.body.categoryId) : undefined,
        supplierId: req.body.supplierId ? Number(req.body.supplierId) : undefined,
      };
      
      const product = await storage.createProduct(data);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  apiRouter.put("/products/:id", validateRequest(insertProductSchema.partial()), async (req, res) => {
    try {
      // Converter campos numéricos se presentes
      const data: any = { ...req.body };
      if (data.price !== undefined) data.price = Number(data.price);
      if (data.cost !== undefined) data.cost = Number(data.cost);
      if (data.quantity !== undefined) data.quantity = Number(data.quantity);
      if (data.minQuantity !== undefined) data.minQuantity = Number(data.minQuantity);
      if (data.categoryId !== undefined) data.categoryId = Number(data.categoryId);
      if (data.supplierId !== undefined) data.supplierId = Number(data.supplierId);
      
      const product = await storage.updateProduct(Number(req.params.id), data);
      if (!product) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  apiRouter.delete("/products/:id", async (req, res) => {
    const deleted = await storage.deleteProduct(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }
    res.status(204).send();
  });

  // Rotas para notificações
  apiRouter.get("/notifications", async (_req, res) => {
    const notifications = await storage.getNotifications();
    res.json(notifications);
  });

  apiRouter.post("/notifications", validateRequest(insertNotificationSchema), async (req, res) => {
    try {
      const notification = await storage.createNotification(req.body);
      res.status(201).json(notification);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  apiRouter.patch("/notifications/:id/read", async (req, res) => {
    const notification = await storage.markNotificationAsRead(Number(req.params.id));
    if (!notification) {
      return res.status(404).json({ message: "Notificação não encontrada" });
    }
    res.json(notification);
  });
  
  // Rota para buscar produto por SKU
  apiRouter.get("/products/sku/:sku", async (req, res) => {
    try {
      const products = await storage.getProducts();
      const product = products.find(p => p.sku === req.params.sku);
      if (!product) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Rotas para vendas
  apiRouter.get("/sales", async (_req, res) => {
    const sales = await storage.getSales();
    res.json(sales);
  });
  
  apiRouter.get("/sales/:id", async (req, res) => {
    const sale = await storage.getSale(Number(req.params.id));
    if (!sale) {
      return res.status(404).json({ message: "Venda não encontrada" });
    }
    res.json(sale);
  });
  
  apiRouter.post("/sales", validateRequest(insertSaleSchema), async (req, res) => {
    try {
      // Garantir que os campos numéricos sejam convertidos corretamente
      const data = {
        ...req.body,
        totalAmount: Number(req.body.totalAmount),
      };
      
      const sale = await storage.createSale(data);
      res.status(201).json(sale);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });
  
  apiRouter.put("/sales/:id", validateRequest(insertSaleSchema.partial()), async (req, res) => {
    try {
      // Converter campos numéricos se presentes
      const data: any = { ...req.body };
      if (data.totalAmount !== undefined) data.totalAmount = Number(data.totalAmount);
      
      const sale = await storage.updateSale(Number(req.params.id), data);
      if (!sale) {
        return res.status(404).json({ message: "Venda não encontrada" });
      }
      res.json(sale);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });
  
  apiRouter.delete("/sales/:id", async (req, res) => {
    const deleted = await storage.deleteSale(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ message: "Venda não encontrada" });
    }
    res.status(204).send();
  });
  
  // Rotas para itens de venda
  apiRouter.get("/sales/:saleId/items", async (req, res) => {
    try {
      const items = await storage.getSaleItems(Number(req.params.saleId));
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  apiRouter.post("/sales/items", validateRequest(insertSaleItemSchema), async (req, res) => {
    try {
      // Garantir que os campos numéricos sejam convertidos corretamente
      const data = {
        ...req.body,
        saleId: Number(req.body.saleId),
        productId: Number(req.body.productId),
        quantity: Number(req.body.quantity),
        price: Number(req.body.price),
        discount: req.body.discount ? Number(req.body.discount) : 0,
      };
      
      const item = await storage.addSaleItem(data);
      
      // Atualizar o estoque do produto
      const product = await storage.getProduct(data.productId);
      if (product) {
        const newQuantity = product.quantity - data.quantity;
        await storage.updateProduct(product.id, { quantity: newQuantity });
        
        // Verificar se o estoque está baixo e criar uma notificação se necessário
        if (product.minQuantity && newQuantity <= product.minQuantity) {
          await storage.createNotification({
            title: 'Estoque baixo',
            message: `O produto ${product.name} está com estoque baixo (${newQuantity} unidades)`,
            type: 'warning'
          });
        }
      }
      
      res.status(201).json(item);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });
  
  apiRouter.delete("/sales/items/:id", async (req, res) => {
    const deleted = await storage.removeSaleItem(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ message: "Item de venda não encontrado" });
    }
    res.status(204).send();
  });

  // Registra o roteador na aplicação
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}

// Importação necessária para o middleware
import express from "express";
