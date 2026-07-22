import { useEffect, useState } from "react";
import DashboardLayout from "@/mainLayout/DashboardLayout";
import Checkbox from "@/Components/layout/NotificationIcon";
import NotificationCard from "@/Components/Notification/notificationCard";

import {
  getNotifications,
  unreadCount,
  readAllNotifications,
  readNotification,
} from "@/Services/notifications";
import Loader from "@/Components/Loader/Loader";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [counter, setCounter] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const data = await unreadCount();
      setCounter(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReadNotification = async (id) => {
    try {
      await readNotification(id);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );

      setCounter((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error(error);
    }
  };

  const handleReadAll = async () => {
    try {
      await readAllNotifications();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      setCounter(0);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      await Promise.all([
        loadNotifications(),
        loadUnreadCount(),
      ]);

      setLoading(false);
    };

    load();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <nav
          className="
            w-full rounded-xl
            bg-white shadow-md
            px-6 py-5
            flex justify-between items-center
          "
        >
          <h2 className="text-sm sm:text-lg lg:text-3xl font-bold text-sky-900">
            You have {counter} new notifications
          </h2>

          <button
            onClick={handleReadAll}
            className="flex items-center text-sky-700 hover:text-sky-900 transition gap-5"
          >
            <Checkbox />
            <span className="font-bold text-xs lg:text-xl">
              Read all
            </span>
          </button>
        </nav>

        {loading ? (
          <Loader/>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-500">
              No Notifications Yet
            </h2>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onClick={handleReadNotification}
              />
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Notification;