import useUserStore from "../stores/userStore";

export default function Notifications() {
  const { notifications } = useUserStore();

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications?.map((notification, index) => (
          <li key={index}>
            <p>{notification.type}</p>
            <p>From: {notification.from.username}</p>
            <p>At: {new Date(notification.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
