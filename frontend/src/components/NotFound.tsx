import NotFoundImg from "../assets/404.svg";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <img src={NotFoundImg} height={"300px"} />
    </div>
  );
}
