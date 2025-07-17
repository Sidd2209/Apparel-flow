import { Router, Request, Response } from 'express';
import { getAllOrders, IOrder } from '../models/Order';
import db from '../db';

const router = Router();

// GET /api/v1/orders - Retrieve all orders
router.get('/', (req: Request, res: Response) => {
  const orders = getAllOrders();
  res.json(orders);
});

// POST /api/v1/orders - Create a new order
router.post('/', (req: Request, res: Response) => {
  const {
    orderNumber,
    productId,
    quantity,
    status,
    priority,
    totalValue,
    customerName,
    productType,
    assignedTo,
    validDate
  } = req.body;
  const now = new Date().toISOString();
  const result = db.prepare(
    'INSERT INTO orders (orderNumber, productId, quantity, status, priority, totalValue, customerName, productType, assignedTo, validDate, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(orderNumber, productId, quantity, status, priority, totalValue, customerName, productType, assignedTo, validDate, now, now);
  const newOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newOrder);
});

// GET /api/v1/orders/:id - Retrieve a single order by ID
router.get('/:id', (req: Request, res: Response) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (order) {
    res.json(order);
  } else {
    res.status(404).send('Order not found');
  }
});

// PATCH /api/v1/orders/:id - Update an existing order
router.patch('/:id', (req: Request, res: Response) => {
  const {
    orderNumber,
    productId,
    quantity,
    status,
    priority,
    totalValue,
    customerName,
    productType,
    assignedTo,
    validDate
  } = req.body;
  const now = new Date().toISOString();
  const result = db.prepare(
    'UPDATE orders SET orderNumber = ?, productId = ?, quantity = ?, status = ?, priority = ?, totalValue = ?, customerName = ?, productType = ?, assignedTo = ?, validDate = ?, updatedAt = ? WHERE id = ?'
  ).run(orderNumber, productId, quantity, status, priority, totalValue, customerName, productType, assignedTo, validDate, now, req.params.id);
  if (result.changes) {
    const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    res.json(updatedOrder);
  } else {
    res.status(404).send('Order not found');
  }
});

// DELETE /api/v1/orders/:id - Delete an order
router.delete('/:id', (req: Request, res: Response) => {
  const result = db.prepare('DELETE FROM orders WHERE id = ?').run(req.params.id);
  if (result.changes) {
    res.status(204).send();
  } else {
    res.status(404).send('Order not found');
  }
});

export default router;
