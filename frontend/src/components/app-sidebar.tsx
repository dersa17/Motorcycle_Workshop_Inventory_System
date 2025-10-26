"use client"
import Link from "next/link"
import { Home, Package, FolderTree, FileText, Settings, Truck, CreditCard,DollarSign } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Barang", url: "/item", icon: Package },
  { title: "Kategori", url: "/kategori", icon: FolderTree }, 
  { title: "Supplier", url: "/supplier", icon: Truck },
    { title: "Pembelian", url: "/pembelian", icon: DollarSign },
      { title: "Penjualan", url: "/penjualan", icon: DollarSign },
  { title: "Laporan", url: "/reports", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { open } = useSidebar()
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="px-4 py-6">
          <h2
            className={`text-xl font-bold text-gradient transition-all ${
              !open ? "opacity-0" : "opacity-100"
            }`}
          >
            Utama Moto Inventory
          </h2>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={ `${pathname === item.url ? "bg-primary text-white" : ""} hover:bg-primary hover:text-white `}>
                    <Link href={item.url} className={`flex items-center gap-2`}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
