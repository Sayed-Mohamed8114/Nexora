import { Bell, Circle } from "lucide-react";

const NotificationCard = ({ notification, onClick }) => {
  return (
    <div
      onClick={() => onClick?.(notification.id)}
      className={`
        w-full rounded-xl border p-5 cursor-pointer
        transition-all duration-200
        hover:shadow-lg hover:-translate-y-1
        ${
          notification.isRead
            ? "bg-white border-slate-200"
            : "bg-sky-50 border-sky-300"
        }
      `}
    >
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <div
            className="
              w-12 h-12 rounded-full
              bg-sky-100
              flex items-center justify-center
            "
          >
            <Bell className="text-sky-700" size={22} />
          </div>

          <div>
            <h3 className="font-bold text-slate-800 text-lg">
              {notification.title}
            </h3>

            <span className="text-sm text-sky-700 font-medium">
              {notification.type}
            </span>

            <p className="text-slate-600 mt-2 leading-relaxed">
              {notification.message}
            </p>

            <p className="text-xs text-slate-400 mt-4">
              {new Date(notification.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {!notification.isRead && (
          <Circle
            size={10}
            fill="rgb(14 165 233)"
            className="text-sky-500 mt-1"
          />
        )}
      </div>
    </div>
  );
};

export default NotificationCard;