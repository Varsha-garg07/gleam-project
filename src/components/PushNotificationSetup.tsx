// Push Notification Setup Component
import React, { useState, useEffect } from "react";
import { Bell, BellOff, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requestNotificationPermission, saveFCMToken } from "@/lib/firebase/messaging";
import { toast } from "sonner";

interface PushNotificationSetupProps {
  userId?: string;
  onComplete?: () => void;
}

const PushNotificationSetup: React.FC<PushNotificationSetupProps> = ({
  userId,
  onComplete,
}) => {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const handleEnableNotifications = async () => {
    setIsLoading(true);
    try {
      const token = await requestNotificationPermission();
      
      if (token) {
        // Save token to user profile if userId is provided
        if (userId) {
          await saveFCMToken(userId, token);
        }
        
        setPermissionStatus("granted");
        setIsSetupComplete(true);
        toast.success("Push notifications enabled!", {
          description: "You'll receive updates about your rides.",
        });
        onComplete?.();
      } else {
        setPermissionStatus(Notification.permission);
        if (Notification.permission === "denied") {
          toast.error("Notifications blocked", {
            description: "Please enable notifications in your browser settings.",
          });
        }
      }
    } catch (error) {
      console.error("Error enabling notifications:", error);
      toast.error("Failed to enable notifications");
    } finally {
      setIsLoading(false);
    }
  };

  if (!("Notification" in window)) {
    return null; // Browser doesn't support notifications
  }

  if (permissionStatus === "granted" || isSetupComplete) {
    return (
      <Card className="border-success/20 bg-success/5">
        <CardContent className="flex items-center gap-4 py-4">
          <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
            <Check className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Notifications Enabled</p>
            <p className="text-sm text-muted-foreground">
              You'll receive push notifications for ride updates
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (permissionStatus === "denied") {
    return (
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="flex items-center gap-4 py-4">
          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
            <BellOff className="w-5 h-5 text-destructive" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground">Notifications Blocked</p>
            <p className="text-sm text-muted-foreground">
              Enable notifications in your browser settings to receive ride updates
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="w-5 h-5 text-primary" />
          Enable Push Notifications
        </CardTitle>
        <CardDescription>
          Get real-time updates about your rides, pool status, and more
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              Know when your driver is arriving
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              Get updates when someone joins your pool
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              Receive ride status notifications
            </li>
          </ul>
          <Button
            onClick={handleEnableNotifications}
            disabled={isLoading}
            className="w-full btn-primary-gradient"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enabling...
              </>
            ) : (
              <>
                <Bell className="w-4 h-4 mr-2" />
                Enable Notifications
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PushNotificationSetup;
