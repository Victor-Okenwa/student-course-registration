import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Bell, AlertCircle, CheckCircle, Info, Clock, Trash2, Mail, Settings } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'academic' | 'system' | 'payment' | 'registration';
  timestamp: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Course Registration Deadline',
      message: 'Course registration for 2024/2025 session ends in 3 days. Complete your registration to avoid late fees.',
      type: 'warning',
      category: 'registration',
      timestamp: '2024-01-15T10:30:00Z',
      read: false,
      priority: 'high'
    },
    {
      id: '2',
      title: 'New Result Published',
      message: 'Your result for CSC 301 (Database Systems) has been published. Check your academic record for details.',
      type: 'success',
      category: 'academic',
      timestamp: '2024-01-14T14:22:00Z',
      read: false,
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Payment Confirmation',
      message: 'Your school fees payment of ₦150,000 has been confirmed. Receipt available in your account.',
      type: 'success',
      category: 'payment',
      timestamp: '2024-01-13T09:15:00Z',
      read: true,
      priority: 'medium'
    },
    {
      id: '4',
      title: 'System Maintenance',
      message: 'The student portal will be undergoing maintenance on January 20th from 2:00 AM to 6:00 AM.',
      type: 'info',
      category: 'system',
      timestamp: '2024-01-12T16:45:00Z',
      read: true,
      priority: 'low'
    },
    {
      id: '5',
      title: 'Missing Course Prerequisites',
      message: 'You are registered for CSC 401 but missing prerequisite CSC 301. Please contact your advisor.',
      type: 'error',
      category: 'academic',
      timestamp: '2024-01-11T11:30:00Z',
      read: false,
      priority: 'high'
    },
    {
      id: '6',
      title: 'Library Book Due',
      message: 'Your library book "Advanced Database Systems" is due for return in 2 days.',
      type: 'warning',
      category: 'academic',
      timestamp: '2024-01-10T08:20:00Z',
      read: true,
      priority: 'medium'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'error': return AlertCircle;
      default: return Info;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAsUnread = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: false } : notif
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const filteredNotifications = selectedCategory === 'all' 
    ? notifications 
    : notifications.filter(notif => notif.category === selectedCategory);

  const unreadCount = notifications.filter(notif => !notif.read).length;
  const categoryStats = {
    academic: notifications.filter(n => n.category === 'academic').length,
    system: notifications.filter(n => n.category === 'system').length,
    payment: notifications.filter(n => n.category === 'payment').length,
    registration: notifications.filter(n => n.category === 'registration').length,
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold mb-2">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with your academic activities</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="destructive">{unreadCount} Unread</Badge>
            <Button variant="outline" onClick={markAllAsRead}>
              Mark All Read
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card 
            className={`cursor-pointer transition-colors ${selectedCategory === 'all' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">All Notifications</p>
                  <p className="text-2xl font-bold">{notifications.length}</p>
                </div>
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-colors ${selectedCategory === 'academic' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedCategory('academic')}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Academic</p>
                  <p className="text-2xl font-bold">{categoryStats.academic}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-colors ${selectedCategory === 'registration' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedCategory('registration')}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Registration</p>
                  <p className="text-2xl font-bold">{categoryStats.registration}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-colors ${selectedCategory === 'payment' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedCategory('payment')}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Payment</p>
                  <p className="text-2xl font-bold">{categoryStats.payment}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Notifications</TabsTrigger>
            <TabsTrigger value="unread">Unread Only ({unreadCount})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No notifications in this category</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                return (
                  <Card 
                    key={notification.id} 
                    className={`transition-all hover:shadow-md ${!notification.read ? 'border-l-4 border-l-primary bg-primary/5' : ''}`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className={`font-medium ${!notification.read ? 'text-primary' : ''}`}>
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2">
                                <Badge variant={getPriorityColor(notification.priority)} className="text-xs">
                                  {notification.priority} priority
                                </Badge>
                                <Badge variant="outline" className="text-xs capitalize">
                                  {notification.category}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {formatTimestamp(notification.timestamp)}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {notification.read ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsUnread(notification.id)}
                                  className="h-8 w-8 p-0"
                                  title="Mark as unread"
                                >
                                  <Mail className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="h-8 w-8 p-0"
                                  title="Mark as read"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                title="Delete notification"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="unread" className="space-y-4">
            {notifications.filter(n => !n.read).length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <p className="text-muted-foreground">All caught up! No unread notifications.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              notifications.filter(n => !n.read).map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                return (
                  <Card 
                    key={notification.id} 
                    className="border-l-4 border-l-primary bg-primary/5 transition-all hover:shadow-md"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-primary">{notification.title}</h4>
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2">
                                <Badge variant={getPriorityColor(notification.priority)} className="text-xs">
                                  {notification.priority} priority
                                </Badge>
                                <Badge variant="outline" className="text-xs capitalize">
                                  {notification.category}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {formatTimestamp(notification.timestamp)}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="h-8 w-8 p-0"
                                title="Mark as read"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                title="Delete notification"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}