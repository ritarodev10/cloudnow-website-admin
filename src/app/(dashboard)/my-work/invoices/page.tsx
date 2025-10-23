"use client";

import React, { useState } from "react";
import { PageTitle } from "@/components/ui/page-title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  FileTextIcon,
  DownloadIcon,
  SearchIcon,
  CalendarIcon,
  DollarSignIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Invoice } from "@/types";
import {
  sampleInvoices,
  calculateInvoiceSummary,
  getInvoicesByStaff,
  formatCurrency,
  getInvoiceStatusColor,
  getInvoiceStatusIcon,
} from "@/data/invoices";
import { sampleStaff } from "@/data/staff-management";
import { formatDate } from "@/lib/work-log-utils";

export default function MyInvoicesPage() {
  // Mock current user (in real app, this would come from auth context)
  const currentUser = sampleStaff[0]; // John Doe

  // State management
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "unpaid">(
    "all"
  );
  const [dateFilter, setDateFilter] = useState("all");

  // Load invoices for current user
  React.useEffect(() => {
    const userInvoices = getInvoicesByStaff(sampleInvoices, currentUser.id);
    setInvoices(userInvoices);
  }, [currentUser.id]);

  // Filter invoices
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;
    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "this-month" &&
        new Date(invoice.createdAt).getMonth() === new Date().getMonth()) ||
      (dateFilter === "last-month" &&
        new Date(invoice.createdAt).getMonth() === new Date().getMonth() - 1);

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Calculate summary
  const summary = calculateInvoiceSummary(filteredInvoices);

  const handleExport = (invoice: Invoice) => {
    // TODO: Implement PDF export
    console.log("Export invoice:", invoice.id);
  };

  const handleDownload = (invoice: Invoice) => {
    // TODO: Implement download functionality
    console.log("Download invoice:", invoice.id);
  };

  return (
    <PageTitle
      title="My Invoices"
      description="View and manage your invoices and payment history."
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              /* TODO: Request new invoice */
            }}
          >
            <FileTextIcon className="h-4 w-4 mr-2" />
            Request Invoice
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Invoices
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {summary.totalInvoices}
                  </p>
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
                  <p className="text-2xl font-bold text-green-600">
                    {summary.paidInvoices}
                  </p>
                </div>
                <DollarSignIcon className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unpaid</p>
                  <p className="text-2xl font-bold text-red-600">
                    {summary.unpaidInvoices}
                  </p>
                </div>
                <CalendarIcon className="h-8 w-8 text-red-500" />
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

              <Select
                value={statusFilter}
                onValueChange={(value: "all" | "paid" | "unpaid") => setStatusFilter(value)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={dateFilter}
                onValueChange={(value: string) => setDateFilter(value)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Invoices List */}
        <Card>
          <CardHeader>
            <CardTitle>Invoices ({filteredInvoices.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-8">
                <FileTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No invoices found
                </h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                    ? "Try adjusting your filters to see more results."
                    : "You don't have any invoices yet."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">
                          {invoice.invoiceNumber}
                        </h3>
                        <Badge
                          className={getInvoiceStatusColor(invoice.status)}
                        >
                          {getInvoiceStatusIcon(invoice.status)}{" "}
                          {invoice.status}
                        </Badge>
                      </div>

                      <div className="text-sm text-gray-500 space-y-1">
                        <div>
                          Period: {formatDate(invoice.period.startDate)} -{" "}
                          {formatDate(invoice.period.endDate)}
                        </div>
                        <div>
                          Created: {formatDate(invoice.createdAt)}
                          {invoice.paidAt && (
                            <span className="ml-4">
                              Paid: {formatDate(invoice.paidAt)}
                            </span>
                          )}
                        </div>
                        {invoice.notes && (
                          <div className="text-gray-600">
                            Note: {invoice.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 mb-1">
                        {formatCurrency(invoice.total)}
                      </div>
                      <div className="text-sm text-gray-500 mb-3">
                        {invoice.items.length} item
                        {invoice.items.length !== 1 ? "s" : ""}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExport(invoice)}
                        >
                          <FileTextIcon className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(invoice)}
                        >
                          <DownloadIcon className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Total Summary */}
        {filteredInvoices.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900">Total Amount</h3>
                  <p className="text-sm text-gray-500">
                    {summary.paidInvoices} paid, {summary.unpaidInvoices} unpaid
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(summary.totalAmount)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Paid: {formatCurrency(summary.paidAmount)} | Unpaid:{" "}
                    {formatCurrency(summary.unpaidAmount)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageTitle>
  );
}
