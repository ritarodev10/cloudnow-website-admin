"use client";

import React, { useState } from "react";
import { PageTitle } from "@/components/ui/page-title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileTextIcon, SearchIcon, EyeIcon, DownloadIcon, CalendarIcon, DollarSignIcon } from "lucide-react";
import { Invoice } from "@/types";
import {
  sampleInvoices,
  calculateInvoiceSummary,
  formatCurrency,
  getInvoiceStatusColor,
  getInvoiceStatusIcon,
} from "@/data/invoices";
import { formatDate } from "@/lib/work-log-utils";

export default function MyInvoicesPage() {
  // State management
  const [invoices] = useState<Invoice[]>(sampleInvoices.filter((inv) => inv.staffId === "current-user")); // Filter for current user
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Filter invoices
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.staffName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Calculate summary
  const summary = calculateInvoiceSummary(filteredInvoices);

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailOpen(true);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    // TODO: Implement download functionality
    console.log("Download invoice:", invoice.id);
  };

  const handleExportInvoices = () => {
    // TODO: Implement CSV export
    console.log("Export invoices");
  };

  return (
    <PageTitle
      title="My Invoices"
      description="View and manage your invoices and payment history."
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportInvoices}>
            Export CSV
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.totalInvoices}</p>
                </div>
                <FileTextIcon className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Paid</p>
                  <p className="text-2xl font-bold text-green-600">{summary.paidInvoices}</p>
                </div>
                <FileTextIcon className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-orange-600">{summary.unpaidInvoices}</p>
                </div>
                <FileTextIcon className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-purple-600">{formatCurrency(summary.totalAmount)}</p>
                </div>
                <DollarSignIcon className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle>My Invoices ({filteredInvoices.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-8">
                <FileTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? "Try adjusting your search to see more results."
                    : "You haven't generated any invoices yet."}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-gray-400" />
                          <div className="text-sm">
                            {formatDate(invoice.period.startDate)} - {formatDate(invoice.period.endDate)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(invoice.total)}</TableCell>
                      <TableCell>
                        <Badge className={getInvoiceStatusColor(invoice.status)}>
                          {getInvoiceStatusIcon(invoice.status)} {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(invoice)}>
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDownloadInvoice(invoice)}>
                            <DownloadIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Summary Footer */}
        {filteredInvoices.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900">Financial Summary</h3>
                  <p className="text-sm text-gray-500">
                    {summary.paidInvoices} paid invoices, {summary.unpaidInvoices} pending payment
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{formatCurrency(summary.totalAmount)}</div>
                  <div className="text-sm text-gray-500">
                    Paid: {formatCurrency(summary.paidAmount)} | Pending: {formatCurrency(summary.unpaidAmount)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Invoice Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
            <DialogDescription>Review your invoice details and payment status.</DialogDescription>
          </DialogHeader>

          {selectedInvoice && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900">Invoice Information</h4>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <div>Invoice #: {selectedInvoice.invoiceNumber}</div>
                    <div>Staff: {selectedInvoice.staffName}</div>
                    <div>
                      Period: {formatDate(selectedInvoice.period.startDate)} -{" "}
                      {formatDate(selectedInvoice.period.endDate)}
                    </div>
                    <div>Created: {formatDate(selectedInvoice.createdAt)}</div>
                    {selectedInvoice.paidAt && <div>Paid: {formatDate(selectedInvoice.paidAt)}</div>}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Amount</h4>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <div>Subtotal: {formatCurrency(selectedInvoice.subtotal)}</div>
                    {selectedInvoice.tax && <div>Tax: {formatCurrency(selectedInvoice.tax)}</div>}
                    <div className="font-medium text-lg">Total: {formatCurrency(selectedInvoice.total)}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900">Items</h4>
                <div className="mt-2 space-y-2">
                  {selectedInvoice.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">{item.description}</div>
                        <div className="text-sm text-gray-500">
                          {item.hours} hours @ {formatCurrency(item.rate)}/hr
                        </div>
                      </div>
                      <div className="font-medium">{formatCurrency(item.amount)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedInvoice.notes && (
                <div>
                  <h4 className="font-medium text-gray-900">Notes</h4>
                  <p className="mt-1 text-sm text-gray-600">{selectedInvoice.notes}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => selectedInvoice && handleDownloadInvoice(selectedInvoice)}>
                Download PDF
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                Close
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTitle>
  );
}
