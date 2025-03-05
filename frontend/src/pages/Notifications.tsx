import useUserStore from "../stores/userStore";
import Logo from "../assets/default-user.jpg";
import { useNavigate } from "react-router";

export default function Notifications() {
  const { notifications } = useUserStore();
  const navigate = useNavigate();

  const determineType = (notification, idx) => {
    console.log(notification);
    switch (notification.type) {
      case "follow": {
        return (
          <div
            key={idx}
            style={{
              margin: "2rem 0",
              display: "flex",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <img
              src={notification.from.profileImg || Logo}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "100%",
                objectFit: "cover",
              }}
            />
            <p>
              <span
                onClick={() => navigate(`/profile/${notification.from._id}`)}
                style={{ cursor: "pointer", fontWeight: "bold" }}
              >
                {notification.from.username}
              </span>{" "}
              Followed You
            </p>
          </div>
        );
      }
      case "message": {
        return;
      }
      case "like": {
        return;
      }
      default:
        break;
    }
  };

  return (
    <div style={{ paddingTop: "2.5rem", width: "100%" }}>
      <h1 style={{ marginBottom: "1.5rem" }}>Notifications</h1>
      {notifications.length > 0 ? (
        notifications.map((notification, index) =>
          determineType(notification, index)
        )
      ) : (
        <h5>No notifications so far</h5>
      )}
    </div>
  );
}
