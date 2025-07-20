"use client";
import { useGetSummaryQuery } from "@/apis/analytic-api";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setFilter } from "@/store/app-state/filter-slice";
import { useAppDispatch } from "@/store";

interface EventData {
  country: string;
  sessionId: string;
  device: string;
  type: string;
  page: string;
}

const EventTable = () => {
  const { data } = useGetSummaryQuery(null);
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [pageFilter, setPageFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const dispatch = useAppDispatch();

  if (!data || !data.result) {
    return <div>Loading...</div>;
  }

  const events: EventData[] = data.result;

  const countries = Array.from(new Set(events.map((event) => event.country)));
  const pages = Array.from(new Set(events.map((event) => event.page)));
  const types = Array.from(new Set(events.map((event) => event.type)));

  useEffect(() => {
    dispatch(
      setFilter({
        country: countryFilter,
        page: pageFilter,
      }),
    );
  }, [countryFilter, pageFilter, typeFilter, dispatch]);

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <Select onValueChange={setCountryFilter} value={countryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {countries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setPageFilter} value={pageFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Pages</SelectItem>
            {pages.map((page) => (
              <SelectItem key={page} value={page}>
                {page}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setTypeFilter} value={typeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {types.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <div
          className="relative w-full overflow-auto"
          style={{ maxHeight: "70vh" }}
        >
          <Table>
            <TableHeader className="bg-background sticky top-0">
              <TableRow>
                <TableHead>Country</TableHead>
                <TableHead>Session ID</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Page</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event, index) => (
                <TableRow key={`${event.sessionId}-${index}`}>
                  <TableCell className="font-medium">{event.country}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {event.sessionId}
                  </TableCell>
                  <TableCell>{event.device}</TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        event.type === "session_end"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {event.type}
                    </span>
                  </TableCell>
                  <TableCell>{event.page}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="text-muted-foreground text-sm">
        Showing {events.length} events
      </div>
    </div>
  );
};

export default EventTable;
