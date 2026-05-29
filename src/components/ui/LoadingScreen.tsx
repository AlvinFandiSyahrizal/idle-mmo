export default function LoadingScreen({ message = "Memuat..." }: { message?: string }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Georgia, serif",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontSize: "36px",
          marginBottom: "16px",
          animation: "pulse 2s infinite",
        }}>
          ⚱
        </div>
        <div style={{
          fontSize: "13px",
          color: "#4a4a5a",
          letterSpacing: "0.1em",
        }}>
          {message}
        </div>
        <div style={{
          width: "120px",
          height: "2px",
          background: "#1a1a28",
          borderRadius: "1px",
          margin: "14px auto 0",
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: "40%",
            background: "linear-gradient(90deg, transparent, #f59e0b, transparent)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
          }} />
        </div>
      </div>
    </div>
  );
}
