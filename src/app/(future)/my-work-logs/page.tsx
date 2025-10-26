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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ClockIcon,
  SearchIcon,
  CalendarIcon,
  DollarSignIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
  SquareIcon,
} from "lucide-react";
import { WorkLog, WorkSession } from "@/types";
import { sampleWorkLogs } from "@/data/work-logs";
import { formatDate, formatCurrency } from "@/lib/work-log-utils";

export default function MyWorkLogsPage() {
  // State management
  const [workLogs] = useState<WorkLog[]>(sampleWorkLogs.filter((log) => log.staffId === "current-user")); // Filter for current user
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "timeline">("table");
  const [isSessionFormOpen, setIsSessionFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date().toISOString().split("T")[0]));

  // Filter work logs
  const filteredLogs = workLogs.filter((log) => {
    const matchesSearch = log.staffName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "today" && log.date === new Date().toISOString().split("T")[0]) ||
      (dateFilter === "this-week" &&
        {
          // TODO: Implement week filtering
        });

    return matchesSearch && matchesDate;
  });

  // Calculate totals
  const totalHours = filteredLogs.reduce((sum, log) => sum + log.totalHours, 0);
  const totalEarnings = filteredLogs.reduce((sum, log) => sum + log.totalEarnings, 0);
  const totalSessions = filteredLogs.reduce((sum, log) => sum + log.sessions.length, 0);

  const handleAddSession = () => {
    setIsSessionFormOpen(true);
  };

  const handleEditSession = (session: WorkSession) => {
    // TODO: Implement session editing
    console.log("Edit session:", session);
  };

  const handleDeleteSession = (sessionId: string) => {
    // TODO: Implement session deletion
    console.log("Delete session:", sessionId);
  };

  const handleStartTimer = () => {
    // TODO: Implement timer start
    console.log("Start timer");
  };

  const handlePauseTimer = () => {
    // TODO: Implement timer pause
    console.log("Pause timer");
  };

  const handleStopTimer = () => {
    // TODO: Implement timer stop
    console.log("Stop timer");
  };

  const handleExportLogs = () => {
    // TODO: Implement CSV export
    console.log("Export work logs");
  };

  return (
    <PageTitle
      title="My Work Logs"
      description="Track your work hours, sessions, and earnings."
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setViewMode(viewMode === "table" ? "timeline" : "table")}>
            {viewMode === "table" ? "Timeline View" : "Table View"}
          </Button>
          <Button variant="outline" onClick={handleExportLogs}>
            Export CSV
          </Button>
          <Button onClick={handleAddSession}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Session
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Timer Widget */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Today&apos;s Timer</h3>
                <p className="text-sm text-gray-500">{formatDate(new Date().toISOString().split("T")[0])}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-blue-600">00:00:00</div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleStartTimer} className="bg-green-600 hover:bg-green-700">
                    <PlayIcon className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={handlePauseTimer}>
                    <PauseIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleStopTimer}
                    className="border-red-500 text-red-600 hover:bg-red-50"
                  >
                    <SquareIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
                <ClockIcon className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hourly Rate</p>
                  <p className="text-2xl font-bold text-orange-600">$50.00/hr</p>
                </div>
                <DollarSignIcon className="h-8 w-8 text-orange-500" />
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
                    placeholder="Search work logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

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
                <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No work logs found</h3>
                <p className="text-gray-500">
                  {searchTerm || dateFilter !== "all"
                    ? "Try adjusting your filters to see more results."
                    : "Start tracking your work hours by adding your first session."}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
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
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditSession(log.sessions[0])}>
                            <EditIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteSession(log.sessions[0].id)}
                            className="border-red-500 text-red-600 hover:bg-red-50"
                          >
                            <TrashIcon className="h-4 w-4" />
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
        {filteredLogs.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900">Summary</h3>
                  <p className="text-sm text-gray-500">
                    {filteredLogs.length} work log
                    {filteredLogs.length !== 1 ? "s" : ""} tracked
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

      {/* Session Form Dialog */}
      <Dialog open={isSessionFormOpen} onOpenChange={setIsSessionFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Work Session</DialogTitle>
            <DialogDescription>Add a new work session to track your hours and earnings.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* TODO: Implement session form */}
            <p className="text-gray-500">Session form will be implemented here.</p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSessionFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsSessionFormOpen(false)}>Add Session</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTitle>
  );
}
