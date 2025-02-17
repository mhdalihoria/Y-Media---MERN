import NotHere from "../assets/not-here.svg";

export default function Empty() {
  return (
    <div style={{display: "flex", flexDirection: "column",justifyContent: "center"}}>
      <img src={NotHere} height={"300px"}/>
      <div style={{textAlign: "center"}}>
      <p>We Can't See Anything Here...</p>
      <p>Can You?</p>
      </div>
    </div>
  );
}
