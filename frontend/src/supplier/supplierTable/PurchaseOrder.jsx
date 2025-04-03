// PurchaseOrdersTable.js

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const PurchaseOrdersTable = ({ purchaseOrders }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Created Date</TableHead>
        <TableHead>Order Number</TableHead>
        <TableHead>Payment Status</TableHead>
        <TableHead>Total Tax</TableHead>
        <TableHead>Total Discount</TableHead>
        <TableHead>Total Amount</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {purchaseOrders.map((order, index) => (
        <TableRow key={index}>
          <TableCell>{order.createdDate}</TableCell>
          <TableCell>{order.orderNumber}</TableCell>
          <TableCell>{order.paymentStatus}</TableCell>
          <TableCell>${order.totalTax}</TableCell>
          <TableCell>${order.totalDiscount}</TableCell>
          <TableCell>${order.totalAmount}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default PurchaseOrdersTable;
