"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDashboard } from "@/hooks/use-dashboard";
import {
  Package,
  ArrowLeftRight,
  Truck,
  FolderTree,
  LoaderCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

type Stat = {
  title: string;
  value: number;
  icon: LucideIcon;
  description: string;
};

type RiwayatAktivitas = {
  nama: string;
  deskripsi: string;
  tanggal: string;
};

type StokBarangMenipis = {
  nama: string;
  harga: number;
  stok: number;
  StokInitial: number;
  StokMinimum: number;
  Gambar: string;
};

const Page = () => {
  const { data, isPending } = useDashboard();
  console.log(data?.RiwayatAktivitas);
  const stats: Stat[] = [
    {
      title: "Total Barang",
      value: data?.jumlahBarang ?? 0,
      icon: Package,
      description: "Barang di inventaris",
    },
    {
      title: "Total Transaksi",
      value: data?.jumlahTransaksi ?? 0,
      icon: ArrowLeftRight,
      description: "Transaksi di inventaris",
    },
    {
      title: "Total Supplier",
      value: data?.jumlahSupplier ?? 0,
      icon: Truck,
      description: "Supplier di inventaris",
    },
    {
      title: "Total Kategori",
      value: data?.jumlahKategori ?? 0,
      icon: FolderTree,
      description: "Kategori di inventaris",
    },
  ];

  return (
    <>
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gradient">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang di sini. Berikut ringkasan inventaris bengkel Anda.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card
              key={stat.title}
              className="card-glow hover:glow-border transition-all"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                {isPending ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <div className="text-3xl font-bold">{stat.value}</div>
                )}

                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activities */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="card-glow">
          <CardHeader>
            <CardTitle>Riwayat Aktivitas</CardTitle>
            <CardDescription>
              Informasi terbaru dari bengkel Anda
            </CardDescription>
          </CardHeader>

         <CardContent>
  <div className="space-y-4 max-h-80 overflow-y-auto">
    {isPending ? (
      <div className="flex justify-center py-4">
        <LoaderCircle className="h-6 w-6 animate-spin" />
      </div>
    ) : data?.RiwayatAktivitas && data.RiwayatAktivitas.length > 0 ? (
      data.RiwayatAktivitas.map((activity: RiwayatAktivitas, index: number) => (
        <div key={index} className="flex items-start space-x-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
          <div className="w-2 h-2 rounded-full bg-primary mt-2" />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium">{activity.nama}</p>
            <p className="text-xs text-muted-foreground">{activity.deskripsi}</p>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(activity.tanggal), { addSuffix: true, locale: id })}
          </span>
        </div>
      ))
    ) : (
      <p className="text-sm text-muted-foreground text-center">
        Belum ada aktivitas terbaru
      </p>
    )}
  </div>
</CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle>Pemberitahuan Stok</CardTitle>
            <CardDescription>
              Informasi stok barang yang perlu diperhatikan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 max-h-80 overflow-y-auto">
            {isPending ? (
              <div className="flex justify-center py-4">
                <LoaderCircle className="h-6 w-6 animate-spin" />
              </div>
            ) : data?.stokBarangMenipisList &&
              data.stokBarangMenipisList.length > 0 ? (
              data.stokBarangMenipisList.map(
                (item: StokBarangMenipis, index: number) => (
                  <div
                    key={index}
                    className="flex items-start space-x-2 p-2 rounded-lg hover:bg-muted/50"
                  >
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{item.nama}</p>
                      <p className="text-xs text-muted-foreground">
                        Stok tersisa: {item.stok}
                      </p>
                    </div>
                  </div>
                )
              )
            ) : (
              <p className="text-sm text-muted-foreground text-center">
                Semua stok aman
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Page;
