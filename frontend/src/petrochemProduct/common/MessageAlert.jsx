// common/MessageAlert.jsx
const MessageAlert = ({ message }) => {
    if (!message || !message.text) return null;
    
    return (
      <div
        className={`p-4 mb-6 rounded-md ${
          message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}
      >
        {message.text}
      </div>
    );
  };
  
  export default MessageAlert;