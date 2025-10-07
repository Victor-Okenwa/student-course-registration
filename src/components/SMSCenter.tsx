import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  MessageSquare,
  Send,
  Inbox,
  Users,
  Check,
  CheckCheck,
} from "lucide-react";

interface SMSMessage {
  id: string;
  sender: string;
  recipient: string;
  message: string;
  timestamp: string;
  status: "sent" | "delivered" | "read" | "failed";
  type: "received" | "sent";
  category: "academic" | "administrative" | "personal";
}

export function SMSCenter() {
  const [messages, setMessages] = useState<SMSMessage[]>([
    {
      id: "1",
      sender: "Registrar Office",
      recipient: "You",
      message:
        "Course registration deadline extended to January 25th. Complete your registration to avoid penalties.",
      timestamp: "2024-01-15T14:30:00Z",
      status: "read",
      type: "received",
      category: "administrative",
    },
    {
      id: "2",
      sender: "You",
      recipient: "Dr. Johnson (Advisor)",
      message:
        "Good day sir, I would like to schedule a meeting to discuss my final year project proposal.",
      timestamp: "2024-01-15T10:15:00Z",
      status: "delivered",
      type: "sent",
      category: "academic",
    },
    {
      id: "3",
      sender: "Academic Office",
      recipient: "You",
      message:
        "Your result for CSC 301 has been published. Login to your portal to view details.",
      timestamp: "2024-01-14T16:45:00Z",
      status: "read",
      type: "received",
      category: "academic",
    },
    {
      id: "4",
      sender: "You",
      recipient: "Finance Office",
      message:
        "I made a payment yesterday but it's not reflecting in my account. Payment reference: FEE2024001234",
      timestamp: "2024-01-14T09:20:00Z",
      status: "read",
      type: "sent",
      category: "administrative",
    },
    {
      id: "5",
      sender: "IT Support",
      recipient: "You",
      message:
        "System maintenance completed. Portal is now fully operational. Thank you for your patience.",
      timestamp: "2024-01-13T06:00:00Z",
      status: "read",
      type: "received",
      category: "administrative",
    },
  ]);

  const [newMessage, setNewMessage] = useState({
    recipient: "",
    category: "",
    message: "",
  });

  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const contacts = [
    { id: "registrar", name: "Registrar Office", category: "administrative" },
    { id: "academic", name: "Academic Office", category: "academic" },
    { id: "finance", name: "Finance Office", category: "administrative" },
    { id: "it-support", name: "IT Support", category: "administrative" },
    { id: "advisor", name: "Dr. Johnson (Advisor)", category: "academic" },
    { id: "hod", name: "HOD Computer Science", category: "academic" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return Check;
      case "delivered":
        return CheckCheck;
      case "read":
        return CheckCheck;
      case "failed":
        return MessageSquare;
      default:
        return MessageSquare;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "text-gray-500";
      case "delivered":
        return "text-blue-500";
      case "read":
        return "text-green-500";
      case "failed":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const sendMessage = () => {
    if (newMessage.recipient && newMessage.message && newMessage.category) {
      const message: SMSMessage = {
        id: Date.now().toString(),
        sender: "You",
        recipient: newMessage.recipient,
        message: newMessage.message,
        timestamp: new Date().toISOString(),
        status: "sent",
        type: "sent",
        category: newMessage.category as
          | "academic"
          | "administrative"
          | "personal",
      };

      setMessages([message, ...messages]);
      setNewMessage({ recipient: "", category: "", message: "" });
    }
  };

  const filteredMessages =
    selectedFilter === "all"
      ? messages
      : selectedFilter === "received"
        ? messages.filter((msg) => msg.type === "received")
        : selectedFilter === "sent"
          ? messages.filter((msg) => msg.type === "sent")
          : messages.filter((msg) => msg.category === selectedFilter);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours =
      Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const messageStats = {
    total: messages.length,
    received: messages.filter((m) => m.type === "received").length,
    sent: messages.filter((m) => m.type === "sent").length,
    unread: messages.filter((m) => m.type === "received" && m.status !== "read")
      .length,
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">SMS Center</h1>
          <p className="text-muted-foreground">
            Send and receive messages with university departments
          </p>
        </div>

        {/* Message Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Total Messages</p>
                  <p className="text-2xl font-bold">{messageStats.total}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Received</p>
                  <p className="text-2xl font-bold">{messageStats.received}</p>
                </div>
                <Inbox className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Sent</p>
                  <p className="text-2xl font-bold">{messageStats.sent}</p>
                </div>
                <Send className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Unread</p>
                  <p className="text-2xl font-bold">{messageStats.unread}</p>
                </div>
                <Badge variant="destructive" className="h-8 px-3">
                  {messageStats.unread}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="inbox" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inbox">Inbox</TabsTrigger>
            <TabsTrigger value="compose">Compose Message</TabsTrigger>
          </TabsList>

          <TabsContent value="inbox" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={selectedFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter("all")}
                  >
                    All Messages
                  </Button>
                  <Button
                    variant={
                      selectedFilter === "received" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedFilter("received")}
                  >
                    Received
                  </Button>
                  <Button
                    variant={selectedFilter === "sent" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter("sent")}
                  >
                    Sent
                  </Button>
                  <Button
                    variant={
                      selectedFilter === "academic" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedFilter("academic")}
                  >
                    Academic
                  </Button>
                  <Button
                    variant={
                      selectedFilter === "administrative"
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedFilter("administrative")}
                  >
                    Administrative
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Messages List */}
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>
                  {filteredMessages.length} messages found
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredMessages.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No messages found</p>
                    </div>
                  ) : (
                    filteredMessages.map((message) => {
                      const StatusIcon = getStatusIcon(message.status);
                      return (
                        <Card
                          key={message.id}
                          className={`hover:shadow-md transition-all ${
                            message.type === "received" &&
                            message.status !== "read"
                              ? "border-l-4 border-l-primary bg-primary/5"
                              : ""
                          }`}
                        >
                          <CardContent className="pt-4">
                            <div className="flex items-start gap-4">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  message.type === "received"
                                    ? "bg-blue-100"
                                    : "bg-green-100"
                                }`}
                              >
                                {message.type === "received" ? (
                                  <Inbox className="w-4 h-4 text-blue-600" />
                                ) : (
                                  <Send className="w-4 h-4 text-green-600" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium">
                                      {message.type === "received"
                                        ? message.sender
                                        : `To: ${message.recipient}`}
                                    </p>
                                    <Badge
                                      variant="outline"
                                      className="text-xs capitalize"
                                    >
                                      {message.category}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">
                                      {formatTimestamp(message.timestamp)}
                                    </span>
                                    {message.type === "sent" && (
                                      <StatusIcon
                                        className={`w-4 h-4 ${getStatusColor(message.status)}`}
                                      />
                                    )}
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {message.message}
                                </p>
                                {message.type === "sent" && (
                                  <p className="text-xs text-muted-foreground mt-1 capitalize">
                                    Status: {message.status}
                                  </p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compose" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Compose New Message</CardTitle>
                <CardDescription>
                  Send a message to university departments or staff
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Recipient
                    </label>
                    <Select
                      value={newMessage.recipient}
                      onValueChange={(value) =>
                        setNewMessage({ ...newMessage, recipient: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipient" />
                      </SelectTrigger>
                      <SelectContent>
                        {contacts.map((contact) => (
                          <SelectItem key={contact.id} value={contact.name}>
                            {contact.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Category
                    </label>
                    <Select
                      value={newMessage.category}
                      onValueChange={(value) =>
                        setNewMessage({ ...newMessage, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="administrative">
                          Administrative
                        </SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Message
                  </label>
                  <Textarea
                    placeholder="Type your message here..."
                    value={newMessage.message}
                    onChange={(e) =>
                      setNewMessage({ ...newMessage, message: e.target.value })
                    }
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {newMessage.message.length}/160 characters
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={sendMessage}
                    disabled={
                      !newMessage.recipient ||
                      !newMessage.message ||
                      !newMessage.category
                    }
                    className="gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setNewMessage({
                        recipient: "",
                        category: "",
                        message: "",
                      })
                    }
                  >
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Contacts */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Contacts</CardTitle>
                <CardDescription>
                  Frequently contacted departments and staff
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contacts.map((contact) => (
                    <Card
                      key={contact.id}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {contact.name}
                            </p>
                            <Badge
                              variant="outline"
                              className="text-xs capitalize"
                            >
                              {contact.category}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setNewMessage({
                                ...newMessage,
                                recipient: contact.name,
                                category: contact.category,
                              })
                            }
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
