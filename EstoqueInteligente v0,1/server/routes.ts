import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertCategorySchema,
  insertProductSchema,
  insertSaleSchema,
  insertSupplierSchema
} from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API de Categorias
  app.get("/api/categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar categorias" });
    }
  });

  app.post("/api/categories", async (req: Request, res: Response) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const existingCategory = await storage.getCategoryByName(validatedData.name);
      
      if (existingCategory) {
        return res.status(400).json({ message: "Já existe uma categoria com este nome" });
      }
      
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Erro ao criar categoria" });
    }
  });

  app.put("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }
      
      const validatedData = insertCategorySchema.parse(req.body);
      const updated = await storage.updateCategory(id, validatedData);
      
      if (!updated) {
        return res.status(404).json({ message: "Categoria não encontrada" });
      }
      
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Erro ao atualizar categoria" });
    }
  });

  app.delete("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }
      
      // Verificar se existem produtos usando esta categoria
      const products = await storage.getProducts();
      const hasProducts = products.some(p => p.categoryId === id);
      
      if (hasProducts) {
        return res.status(400).json({ 
          message: "Não é possível excluir esta categoria porque existem produtos associados a ela" 
        });
      }
      
      const deleted = await storage.deleteCategory(id);
      if (!deleted) {
        return res.status(404).json({ message: "Categoria não encontrada" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Erro ao excluir categoria" });
    }
  });

  // API de Fornecedores
  app.get("/api/suppliers", async (req: Request, res: Response) => {
    try {
      const suppliers = await storage.getSuppliers();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar fornecedores" });
    }
  });

  app.post("/api/suppliers", async (req: Request, res: Response) => {
    try {
      const validatedData = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(validatedData);
      res.status(201).json(supplier);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Erro ao criar fornecedor" });
    }
  });

  app.put("/api/suppliers/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }
      
      const validatedData = insertSupplierSchema.parse(req.body);
      const updated = await storage.updateSupplier(id, validatedData);
      
      if (!updated) {
        return res.status(404).json({ message: "Fornecedor não encontrado" });
      }
      
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Erro ao atualizar fornecedor" });
    }
  });

  app.delete("/api/suppliers/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }
      
      // Verificar se existem produtos usando este fornecedor
      const products = await storage.getProducts();
      const hasProducts = products.some(p => p.supplierId === id);
      
      if (hasProducts) {
        return res.status(400).json({ 
          message: "Não é possível excluir este fornecedor porque existem produtos associados a ele" 
        });
      }
      
      const deleted = await storage.deleteSupplier(id);
      if (!deleted) {
        return res.status(404).json({ message: "Fornecedor não encontrado" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Erro ao excluir fornecedor" });
    }
  });

  // API de Produtos
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const products = await storage.getProductsWithDetails();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar produtos" });
    }
  });

  app.get("/api/products/low-stock", async (req: Request, res: Response) => {
    try {
      const products = await storage.getLowStockProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar produtos com estoque baixo" });
    }
  });

  app.post("/api/products", async (req: Request, res: Response) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      
      // Verificar se o código já existe
      const existingProduct = await storage.getProductByCode(validatedData.code);
      if (existingProduct) {
        return res.status(400).json({ message: "Já existe um produto com este código" });
      }
      
      // Verificar se a categoria existe
      const categoryExists = await storage.getCategory(validatedData.categoryId);
      if (!categoryExists) {
        return res.status(400).json({ message: "Categoria não encontrada" });
      }
      
      // Verificar se o fornecedor existe (se especificado)
      if (validatedData.supplierId) {
        const supplierExists = await storage.getSupplier(validatedData.supplierId);
        if (!supplierExists) {
          return res.status(400).json({ message: "Fornecedor não encontrado" });
        }
      }
      
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Erro ao criar produto" });
    }
  });

  app.put("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }
      
      const validatedData = insertProductSchema.partial().parse(req.body);
      
      // Verificar se o produto existe
      const existingProduct = await storage.getProduct(id);
      if (!existingProduct) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
      
      // Se o código foi alterado, verificar se não conflita com outro produto
      if (validatedData.code && validatedData.code !== existingProduct.code) {
        const productWithCode = await storage.getProductByCode(validatedData.code);
        if (productWithCode && productWithCode.id !== id) {
          return res.status(400).json({ message: "Já existe um produto com este código" });
        }
      }
      
      // Verificar se a categoria existe (se especificada)
      if (validatedData.categoryId) {
        const categoryExists = await storage.getCategory(validatedData.categoryId);
        if (!categoryExists) {
          return res.status(400).json({ message: "Categoria não encontrada" });
        }
      }
      
      // Verificar se o fornecedor existe (se especificado)
      if (validatedData.supplierId) {
        const supplierExists = await storage.getSupplier(validatedData.supplierId);
        if (!supplierExists) {
          return res.status(400).json({ message: "Fornecedor não encontrado" });
        }
      }
      
      const updated = await storage.updateProduct(id, validatedData);
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Erro ao atualizar produto" });
    }
  });

  app.delete("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }
      
      // Verificar se o produto existe
      const existingProduct = await storage.getProduct(id);
      if (!existingProduct) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
      
      const deleted = await storage.deleteProduct(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Erro ao excluir produto" });
    }
  });

  // API de Vendas
  app.get("/api/sales", async (req: Request, res: Response) => {
    try {
      const sales = await storage.getSalesWithItems();
      res.json(sales);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar vendas" });
    }
  });

  app.get("/api/sales/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }
      
      const sale = await storage.getSaleWithItems(id);
      if (!sale) {
        return res.status(404).json({ message: "Venda não encontrada" });
      }
      
      res.json(sale);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar venda" });
    }
  });

  // Esquema para validar os itens da venda
  const saleRequestSchema = z.object({
    sale: insertSaleSchema,
    items: z.array(z.object({
      productId: z.number(),
      quantity: z.number().min(1),
      price: z.number().min(0),
      total: z.number().min(0)
    })).min(1)
  });

  app.post("/api/sales", async (req: Request, res: Response) => {
    try {
      const { sale, items } = saleRequestSchema.parse(req.body);
      
      // Verificar se há estoque disponível para cada produto
      for (const item of items) {
        const product = await storage.getProduct(item.productId);
        if (!product) {
          return res.status(400).json({ message: `Produto com ID ${item.productId} não encontrado` });
        }
        
        if (product.quantity < item.quantity) {
          return res.status(400).json({ 
            message: `Estoque insuficiente para o produto ${product.name}. Disponível: ${product.quantity}` 
          });
        }
      }
      
      const createdSale = await storage.createSale(sale, items);
      res.status(201).json(createdSale);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Erro ao registrar venda" });
    }
  });

  // API do Dashboard
  app.get("/api/dashboard", async (req: Request, res: Response) => {
    try {
      const summary = await storage.getDashboardSummary();
      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar dados do dashboard" });
    }
  });

  // Criar o servidor HTTP
  const httpServer = createServer(app);
  return httpServer;
}
