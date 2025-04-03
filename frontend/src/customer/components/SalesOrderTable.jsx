'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const SalesOrderTable = ({ salesOrders = [] }) => { // Default to an empty array if salesOrders is not provided
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Created Date</TableHead>
          <TableHead>Order Number</TableHead>
          <TableHead>Payment Status</TableHead>
          <TableHead>Total Discount</TableHead>
          <TableHead>Total Tax</TableHead>
          <TableHead>Total Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {salesOrders.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center">No Data Found</TableCell>
          </TableRow>
        ) : (
          salesOrders.map((order) => (
            <TableRow key={order.orderNumber}>
              <TableCell>{order.createdDate}</TableCell>
              <TableCell>{order.orderNumber}</TableCell>
              <TableCell>{order.paymentStatus}</TableCell>
              <TableCell>{order.totalDiscount}</TableCell>
              <TableCell>{order.totalTax}</TableCell>
              <TableCell>{order.totalAmount}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default SalesOrderTable;
