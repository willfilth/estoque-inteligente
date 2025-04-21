import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import express from "express";
import {
  insertProductSchema,
  insertCategorySchema,
  insertSupplierSchema,
  productFormSchema
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configurar rotas da API
  const apiRouter = express.Router();
  app.use("/api", apiRouter);

  // Rota para obter dashboard info
  apiRouter.get("/dashboard", async (req, res) => {
    try {
      const products = await storage.getProducts();
      const lowStockProducts = await storage.getLowStockProducts();
      const alerts = await storage.getUnreadAlerts();

      // Calcular o valor total do estoque
      const totalStockValue = products.reduce((total, product) => {
        return total + (product.salePrice || 0) * product.stock;
      }, 0);

      const dashboardData = {
        totalProducts: products.length,
        stockValue: totalStockValue,
        lowStockCount: lowStockProducts.length,
        recentSales: 89, // Valor fixo para este exemplo
        alerts: alerts.slice(0, 5) // Últimos 5 alertas
      };

      res.json(dashboardData);
    } catch (error) {
      res.status(500).json({ message: "Erro ao obter dados do dashboard" });
    }
  });

  // Rotas para produtos
  apiRouter.get("/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Erro ao obter produtos" });
    }
  });

  apiRouter.get("/products/low-stock", async (req, res) => {
    try {
      const lowStockProducts = await storage.getLowStockProducts();
      res.json(lowStockProducts);
    } catch (error) {
      res.status(500).json({ message: "Erro ao obter produtos com estoque baixo" });
    }
  });

  apiRouter.get("/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Erro ao obter produto" });
    }
  });

  apiRouter.post("/products", async (req, res) => {
    try {
      const validationResult = productFormSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const productData = validationResult.data;
      
      // Verificar se já existe um produto com o mesmo SKU
      const existingProduct = await storage.getProductBySkuOrBarcode(productData.sku);
      if (existingProduct) {
        return res.status(400).json({ message: "Já existe um produto com este SKU" });
      }
      
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar produto" });
    }
  });

  apiRouter.put("/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validationResult = productFormSchema.partial().safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const productData = validationResult.data;
      
      // Verificar se o produto existe
      const existingProduct = await storage.getProduct(id);
      if (!existingProduct) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
      
      // Verificar se há conflito de SKU em caso de alteração
      if (productData.sku && productData.sku !== existingProduct.sku) {
        const productWithSameSku = await storage.getProductBySkuOrBarcode(productData.sku);
        if (productWithSameSku) {
          return res.status(400).json({ message: "Já existe um produto com este SKU" });
        }
      }
      
      const updatedProduct = await storage.updateProduct(id, productData);
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar produto" });
    }
  });

  apiRouter.delete("/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Verificar se o produto existe
      const existingProduct = await storage.getProduct(id);
      if (!existingProduct) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
      
      const success = await storage.deleteProduct(id);
      
      if (!success) {
        return res.status(500).json({ message: "Não foi possível excluir o produto" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Erro ao excluir produto" });
    }
  });

  apiRouter.post("/products/:id/stock", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      
      if (typeof quantity !== 'number') {
        return res.status(400).json({ message: "Quantidade deve ser um número" });
      }
      
      const updatedProduct = await storage.updateProductStock(id, quantity);
      
      if (!updatedProduct) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar estoque" });
    }
  });

  // Rotas para categorias
  apiRouter.get("/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Erro ao obter categorias" });
    }
  });

  apiRouter.get("/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getCategory(id);
      
      if (!category) {
        return res.status(404).json({ message: "Categoria não encontrada" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Erro ao obter categoria" });
    }
  });

  apiRouter.post("/categories", async (req, res) => {
    try {
      const validationResult = insertCategorySchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const categoryData = validationResult.data;
      
      // Verificar se a categoria pai existe, caso tenha sido informada
      if (categoryData.parentId) {
        const parentCategory = await storage.getCategory(categoryData.parentId);
        if (!parentCategory) {
          return res.status(400).json({ message: "Categoria pai não encontrada" });
        }
      }
      
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar categoria" });
    }
  });

  apiRouter.put("/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validationResult = insertCategorySchema.partial().safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const categoryData = validationResult.data;
      
      // Verificar se a categoria existe
      const existingCategory = await storage.getCategory(id);
      if (!existingCategory) {
        return res.status(404).json({ message: "Categoria não encontrada" });
      }
      
      // Verificar se a categoria pai existe, caso tenha sido informada
      if (categoryData.parentId) {
        const parentCategory = await storage.getCategory(categoryData.parentId);
        if (!parentCategory) {
          return res.status(400).json({ message: "Categoria pai não encontrada" });
        }
        
        // Evitar ciclos: uma categoria não pode ser pai dela mesma ou de algum ancestral
        let currentParent = parentCategory;
        while (currentParent) {
          if (currentParent.id === id) {
            return res.status(400).json({ message: "Uma categoria não pode ser pai dela mesma ou de seus ancestrais" });
          }
          
          if (currentParent.parentId) {
            currentParent = await storage.getCategory(currentParent.parentId);
          } else {
            break;
          }
        }
      }
      
      const updatedCategory = await storage.updateCategory(id, categoryData);
      res.json(updatedCategory);
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar categoria" });
    }
  });

  apiRouter.delete("/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Verificar se a categoria existe
      const existingCategory = await storage.getCategory(id);
      if (!existingCategory) {
        return res.status(404).json({ message: "Categoria não encontrada" });
      }
      
      const success = await storage.deleteCategory(id);
      
      if (!success) {
        return res.status(400).json({ message: "Não é possível excluir uma categoria que possui subcategorias ou produtos associados" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Erro ao excluir categoria" });
    }
  });

  // Rotas para fornecedores
  apiRouter.get("/suppliers", async (req, res) => {
    try {
      const suppliers = await storage.getSuppliers();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ message: "Erro ao obter fornecedores" });
    }
  });

  apiRouter.get("/suppliers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const supplier = await storage.getSupplier(id);
      
      if (!supplier) {
        return res.status(404).json({ message: "Fornecedor não encontrado" });
      }
      
      res.json(supplier);
    } catch (error) {
      res.status(500).json({ message: "Erro ao obter fornecedor" });
    }
  });

  apiRouter.post("/suppliers", async (req, res) => {
    try {
      const validationResult = insertSupplierSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const supplierData = validationResult.data;
      const supplier = await storage.createSupplier(supplierData);
      res.status(201).json(supplier);
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar fornecedor" });
    }
  });

  apiRouter.put("/suppliers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validationResult = insertSupplierSchema.partial().safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const supplierData = validationResult.data;
      
      // Verificar se o fornecedor existe
      const existingSupplier = await storage.getSupplier(id);
      if (!existingSupplier) {
        return res.status(404).json({ message: "Fornecedor não encontrado" });
      }
      
      const updatedSupplier = await storage.updateSupplier(id, supplierData);
      res.json(updatedSupplier);
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar fornecedor" });
    }
  });

  apiRouter.delete("/suppliers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Verificar se o fornecedor existe
      const existingSupplier = await storage.getSupplier(id);
      if (!existingSupplier) {
        return res.status(404).json({ message: "Fornecedor não encontrado" });
      }
      
      const success = await storage.deleteSupplier(id);
      
      if (!success) {
        return res.status(500).json({ message: "Não foi possível excluir o fornecedor" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Erro ao excluir fornecedor" });
    }
  });

  // Rotas para alertas
  apiRouter.get("/alerts", async (req, res) => {
    try {
      const alerts = await storage.getAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Erro ao obter alertas" });
    }
  });

  apiRouter.get("/alerts/unread", async (req, res) => {
    try {
      const unreadAlerts = await storage.getUnreadAlerts();
      res.json(unreadAlerts);
    } catch (error) {
      res.status(500).json({ message: "Erro ao obter alertas não lidos" });
    }
  });

  apiRouter.put("/alerts/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updatedAlert = await storage.markAlertAsRead(id);
      
      if (!updatedAlert) {
        return res.status(404).json({ message: "Alerta não encontrado" });
      }
      
      res.json(updatedAlert);
    } catch (error) {
      res.status(500).json({ message: "Erro ao marcar alerta como lido" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
