"use client";
import * as React from "react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, FileSpreadsheet, FileText } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DataTablePurchaseReport } from "@/components/report/data-table-purchase-report";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { id } from "date-fns/locale";
import { DataTableSalesReport } from "@/components/report/data-table-sales-report";
import { DataTableItemsReport } from "@/components/report/data-table-items-report";
import { DataTableProfitLossReport } from "@/components/report/data-table-profit-loss-report";
type ReportType = "penjualan" | "pembelian" | "barang" | "labaRugi";

const Page = () => {
  const [reportType, setReportType] = useState<ReportType>("pembelian");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const tableRef = React.useRef<{
    getExportData: () => { headers: string[]; rows: (string | number)[][] };
  }>(null);

  const handleExportExcel = () => {
    if (!tableRef.current) return;

    const { headers, rows } = tableRef.current.getExportData();
    // Cari index kolom tanggal
    const dateColIndex = headers.findIndex(
      (header) => header.toLowerCase() === "tanggal"
    );

    // Format tanggal hanya jika ada kolom tanggal
    const formattedRows = rows.map((row) =>
      row.map((cell, index) => {
        if (
          dateColIndex !== -1 &&
          index === dateColIndex &&
          typeof cell === "string"
        ) {
          return format(cell, "dd MMM yyyy", { locale: id });
        }
        return cell;
      })
    );

    const data = [headers, ...formattedRows];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(
      wb,
      `Laporan${reportType.charAt(0).toUpperCase() + reportType.slice(1)}.xlsx`
    );
  };
  const handleExportPDF = () => {
    if (!tableRef.current) return;

    const { headers, rows } = tableRef.current.getExportData();

    const doc = new jsPDF();

    // Cari index kolom tanggal
    const dateColIndex = headers.findIndex(
      (header) => header.toLowerCase() === "tanggal"
    );

    // Format tanggal hanya jika ada kolom tanggal
    const formattedRows = rows.map((row) =>
      row.map((cell, index) => {
        if (
          dateColIndex !== -1 &&
          index === dateColIndex &&
          typeof cell === "string"
        ) {
          return format(cell, "dd MMM yyyy", { locale: id });
        }
        return cell;
      })
    );

    autoTable(doc, {
      head: [headers],
      body: formattedRows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [244.98, 73.49, -39.37], textColor: 255 },
      startY: 20,
    });

    doc.save(
      `Laporan${reportType.charAt(0).toUpperCase() + reportType.slice(1)}.pdf`
    );
  };

  const getReportDataTable = () => {
    switch (reportType) {
      case "pembelian":
        return (
          <DataTablePurchaseReport
            key={`Purchase-${startDate ? startDate.getTime() : ""}-${endDate ? endDate.getTime() : ""}`}
            ref={tableRef}
            startDate={startDate}
            endDate={endDate}
          />
        );
      case "penjualan":
        return <DataTableSalesReport  key={`Sales-${startDate ? startDate.getTime() : ""}-${endDate ? endDate.getTime() : ""}`}
            ref={tableRef}
            startDate={startDate}
            endDate={endDate} />
      case "barang":
        return <DataTableItemsReport  key={`Items-${startDate ? startDate.getTime() : ""}-${endDate ? endDate.getTime() : ""}`}
            ref={tableRef}
            startDate={startDate}
            endDate={endDate} />
      case "labaRugi":
        return <DataTableProfitLossReport  key={`ProfitLoss-${startDate ? startDate.getTime() : ""}-${endDate ? endDate.getTime() : ""}`}
            ref={tableRef}
            startDate={startDate}
            endDate={endDate} />
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gradient">Laporan</h1>
          <p className="text-muted-foreground">
            Membuat dan mengekspor laporan
          </p>
        </div>
        <Select
          value={reportType}
          onValueChange={(value) => setReportType(value as ReportType)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Pilih Laporan" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Laporan</SelectLabel>
              <SelectItem value="pembelian">Laporan Pembelian</SelectItem>
              <SelectItem value="penjualan">Laporan Penjualan</SelectItem>
              <SelectItem value="barang">Laporan Barang</SelectItem>
              <SelectItem value="labaRugi">Laporan Laba Rugi</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Rentang Tanggal: </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "w-[140px] justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, "MMM dd, yyyy")
                  ) : (
                    <span>Awal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <span className="text-muted-foreground">—</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "w-[140px] justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? (
                    format(endDate, "MMM dd, yyyy")
                  ) : (
                    <span>Akhir</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Export: </label>
            <Button
              className="bg-green-500  hover:bg-green-600"
              size="sm"
              onClick={handleExportExcel}
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Excel
            </Button>
            <Button
              className="bg-red-500  hover:bg-red-600"
              size="sm"
              onClick={handleExportPDF}
            >
              <FileText className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </Card>

      {!startDate || !endDate ? (
        <div className="p-6 text-center text-muted-foreground">
          Pilih tanggal dulu
        </div>
      ) : (
        getReportDataTable()
      )}
    </>
  );
};

export default Page;
