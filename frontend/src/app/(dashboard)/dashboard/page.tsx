import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Wrench, TrendingUp, AlertCircle } from "lucide-react";

const Page = () => {
  const stats = [
    {
      title: "Total Parts",
      value: "1,247",
      change: "+12.5%",
      icon: Package,
      description: "Parts in inventory",
    },
    {
      title: "Active Services",
      value: "23",
      change: "+4.2%",
      icon: Wrench,
      description: "Services in progress",
    },
    {
      title: "Monthly Revenue",
      value: "$45,231",
      change: "+18.7%",
      icon: TrendingUp,
      description: "This month's earnings",
    },
    {
      title: "Low Stock Items",
      value: "8",
      change: "-2 from last week",
      icon: AlertCircle,
      description: "Items need reorder",
    },
  ];

  const recentActivities = [
    { id: 1, action: "New part added", item: "Brake Pads - Honda", time: "2 hours ago" },
    { id: 2, action: "Service completed", item: "Oil Change - Yamaha R15", time: "3 hours ago" },
    { id: 3, action: "Inventory updated", item: "Chain Sprocket Kit", time: "5 hours ago" },
    { id: 4, action: "New order received", item: "Air Filter - Suzuki", time: "1 day ago" },
  ];

  return (
    <>
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gradient">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here your workshop overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="card-glow hover:glow-border transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                <p className="text-sm text-primary font-medium mt-2">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="card-glow">
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest updates from your workshop</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.item}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="card-glow">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Add Part", icon: Package },
                  { label: "New Service", icon: Wrench },
                  { label: "View Reports", icon: TrendingUp },
                  { label: "Check Alerts", icon: AlertCircle },
                ].map((action) => (
                  <button
                    key={action.label}
                    className="flex flex-col items-center justify-center p-6 rounded-lg bg-card hover:bg-muted/50 border border-border hover:border-primary/50 transition-all group"
                  >
                    <action.icon className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
    </>
  );
};

export default Page;
