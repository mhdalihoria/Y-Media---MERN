import { Skeleton } from "@mui/material";

export default function LoadingFriends() {
  const skeleton = (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <Skeleton variant="rounded" width={100} height={100} />
      <Skeleton variant="rounded" width={80} height={16} />
    </div>
  );

  const friendsArr = [
    { id: 1, component: skeleton },
    { id: 2, component: skeleton },
    { id: 3, component: skeleton },
    { id: 4, component: skeleton },
    { id: 5, component: skeleton },
    { id: 6, component: skeleton },
    { id: 7, component: skeleton },
    { id: 8, component: skeleton },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "1.5rem",
          flexWrap: "wrap",
          gap: ".675rem",
        }}
      >
        {friendsArr.map((friend) => (
          <div key={friend.id} style={{marginBottom: "1rem"}}>
            {friend.component}
          </div>
        ))}
      </div>
    </div>
  );
}
