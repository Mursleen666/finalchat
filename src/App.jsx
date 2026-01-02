import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("https://chatback-production-920e.up.railway.app", {
  transports: ["websocket"],
});



function App() {
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);
const [timer, setTimer] = useState(22); // 12 seconds countdown


useEffect(() => {
  if (chat.length === 0) return; // no need if chat is empty

  const timer = setTimeout(() => {
    setChat([]); // clear the chat
  }, 22000); // 12 seconds = 12000 ms

  return () => clearTimeout(timer); // cleanup on new message or unmount
}, [chat]);
useEffect(() => {
  if (chat.length === 0) {
    setTimer(22); // reset timer when chat is empty
    return;
  }

  const interval = setInterval(() => {
    setTimer((prev) => prev - 1);
  }, 1000); // decrease every 1 second

  return () => clearInterval(interval); // cleanup
}, [chat]);


  
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setChat((prev) => [...prev, msg]);
    });
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = () => {
    if (!message || !user) return;
    socket.emit("sendMessage", { user, text: message });
    setMessage("");
  };

   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
  if (chat.length === 0) return;

  const timer = setTimeout(() => {
    setChat([]);
  }, 22000);

  return () => clearTimeout(timer);
}, [chat]);

useEffect(() => {
  if (timer === 0) {
    setChat([]);   // clear chat
    setTimer(22);  // reset timer
  }
}, [timer]);


 

  return (
    <div
      style={{
        fontFamily: "monospace",
        backgroundColor: "#0f0f0f",
        color: "#00ff00",
        minHeight: "100vh",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundImage:
          'url("https://img.freepik.com/free-vector/stream-binary-code-design_53876-100689.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "rgba(0,0,0,0.6)",
        backgroundBlendMode: "darken",
      }}
    >
      <h1
        style={{
          textShadow: "0 0 5px #00ff00, 0 0 10px #00ff00",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        The Gooners Chatroom — made by Mursleen <br />
        Instructions: <br />
        . You have to be a gooner to use this Chatroom . <br />
        . You should be able to give your self a ** . <br />
        . You can't share this link with anyone for privicy purposes . 
      </h1>

      {/* Main Chat + Friends Container */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "90%",
          maxWidth: "900px",
          gap: "20px",
          flexWrap: "wrap", // for responsiveness on small screens
        }}
      >
      {chat.length > 0 && (
  <p style={{ color: "#00ff00", textAlign: "center" }}>
    Chat will clear in: {timer} s
  </p>
)}

        {/* Chat Section */}
        <div
          style={{
            flex: "1 1 500px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <input
            placeholder="Your Name"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            style={{
              padding: "10px",
              border: "1px solid #00ff00",
              backgroundColor: "#0f0f0f",
              color: "#00ff00",
              outline: "none",
              borderRadius: "5px",
              width: "100%",
            }}
          />

          <div
            style={{
              flex: 1,
              minHeight: "400px",
              border: "1px solid #00ff00",
              padding: "10px",
              overflowY: "auto",
              backgroundColor: "#050505",
              boxShadow: "0 0 10px #00ff00",
              borderRadius: "5px",
            }}
          >
            {chat.map((m, i) => (
              <p key={i} style={{ margin: "5px 0" }}>
                <b style={{ color: "#00ff99" }}>{m.user}:</b> {m.text}
              </p>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Message Input */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              style={{
                flex: 1,
                padding: "10px",
                border: "1px solid #00ff00",
                borderRadius: "5px",
                backgroundColor: "#0f0f0f",
                color: "#00ff00",
                outline: "none",
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                padding: "10px 20px",
                border: "1px solid #00ff00",
                borderRadius: "5px",
                backgroundColor: "#0f0f0f",
                color: "#00ff00",
                cursor: "pointer",
                textShadow: "0 0 5px #00ff00",
                transition: "0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#002200")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#0f0f0f")
              }
            >
              Send
            </button>
          </div>
        </div>

        {/* Friends Section */}
        <div
           style={{
        display: "flex",
        flexDirection: isMobile ? "row" : "column",
        gap: "15px",
        minWidth: "120px",
        alignItems: "center",
      }}
        >
           <p style={{ marginTop: "5px", fontSize: "0.8rem" }}>Members</p>
          <div style={{ textAlign: "center" }}>
            <img
              src="/mursleen.jpg"
              alt="Mursleen"
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #00ff00",
              }}
            />
            <p style={{ marginTop: "5px", fontSize: "0.8rem" }}>Mursleen</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <img
              src="/sarmad.png"
              alt="Sarmad"
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #00ff00",
              }}
            />
            <p style={{ marginTop: "5px", fontSize: "0.8rem" }}>Sarmad</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <img
              src="/amman.png"
              alt="Amman"
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #00ff00",
              }}
            />
            <p style={{ marginTop: "5px", fontSize: "0.8rem" }}>Amman</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;

