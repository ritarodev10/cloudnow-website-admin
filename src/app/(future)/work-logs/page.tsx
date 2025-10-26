"use client";

import React, { useState } from "react";
import { PageTitle } from "@/components/ui/page-title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ClipboardListIcon,
  SearchIcon,
  CalendarIcon,
  UsersIcon,
  ClockIcon,
  DollarSignIcon,
  EyeIcon,
} from "lucide-react";
import { WorkLog } from "@/types";
import { sampleWorkLogs } from "@/data/work-logs";
import { sampleStaff } from "@/data/staff-management";
import { formatDate, formatCurrency } from "@/lib/work-log-utils";

export default function AllWorkLogsPage() {
  // State management
  const [workLogs] = useState<WorkLog[]>(sampleWorkLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [staffFilter, setStaffFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "timeline">("table");

  // Filter work logs
  const filteredLogs = workLogs.filter((log) => {
    const matchesSearch = log.staffName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStaff = staffFilter === "all" || log.staffId === staffFilter;
    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "today" && log.date === new Date().toISOString().split("T")[0]) ||
      (dateFilter === "this-week" &&
        {
          // TODO: Implement week filtering
        });

    return matchesSearch && matchesStaff && matchesDate;
  });

  // Calculate totals
  const totalHours = filteredLogs.reduce((sum, log) => sum + log.totalHours, 0);
  const totalEarnings = filteredLogs.reduce((sum, log) => sum + log.totalEarnings, 0);
  const totalSessions = filteredLogs.reduce((sum, log) => sum + log.sessions.length, 0);

  const handleViewDetails = (staffId: string, date: string) => {
    // TODO: Navigate to detailed view
    console.log("View details for:", staffId, date);
  };

  const handleExportLogs = () => {
    // TODO: Implement CSV export
    console.log("Export work logs");
  };

  return (
    <PageTitle
      title="All Work Logs"
      description="View and manage work logs from all staff members."
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setViewMode(viewMode === "table" ? "timeline" : "table")}>
            {viewMode === "table" ? "Timeline View" : "Table View"}
          </Button>
          <Button variant="outline" onClick={handleExportLogs}>
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
                  <p className="text-sm font-medium text-gray-600">Total Hours</p>
                  <p className="text-2xl font-bold text-blue-600">{totalHours.toFixed(1)}h</p>
                </div>
                <ClockIcon className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalEarnings)}</p>
                </div>
                <DollarSignIcon className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sessions</p>
                  <p className="text-2xl font-bold text-purple-600">{totalSessions}</p>
                </div>
                <ClipboardListIcon className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Staff Members</p>
                  <p className="text-2xl font-bold text-orange-600">{filteredLogs.length}</p>
                </div>
                <UsersIcon className="h-8 w-8 text-orange-500" />
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
                    placeholder="Search staff..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={staffFilter} onValueChange={(value: string) => setStaffFilter(value)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Staff Member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Staff</SelectItem>
                  {sampleStaff.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={(value: string) => setDateFilter(value)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Work Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Work Logs ({filteredLogs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8">
                <ClipboardListIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No work logs found</h3>
                <p className="text-gray-500">
                  {searchTerm || staffFilter !== "all" || dateFilter !== "all"
                    ? "Try adjusting your filters to see more results."
                    : "No work logs have been recorded yet."}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Sessions</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Hourly Rate</TableHead>
                    <TableHead>Total Earnings</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={`${log.staffId}-${log.date}`}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{log.staffName}</div>
                          <div className="text-sm text-gray-500">{log.staffId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-gray-400" />
                          {formatDate(log.date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {log.sessions.length} session
                          {log.sessions.length !== 1 ? "s" : ""}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{log.totalHours.toFixed(1)}h</TableCell>
                      <TableCell>{formatCurrency(log.hourlyRate)}/hr</TableCell>
                      <TableCell className="font-medium text-green-600">{formatCurrency(log.totalEarnings)}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(log.staffId, log.date)}>
                          <EyeIcon className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Summary Footer */}
        {filteredLogs.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900">Summary</h3>
                  <p className="text-sm text-gray-500">
                    {filteredLogs.length} work log
                    {filteredLogs.length !== 1 ? "s" : ""} from {new Set(filteredLogs.map((log) => log.staffId)).size}{" "}
                    staff member
                    {new Set(filteredLogs.map((log) => log.staffId)).size !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{formatCurrency(totalEarnings)}</div>
                  <div className="text-sm text-gray-500">{totalHours.toFixed(1)} hours total</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageTitle>
  );
}
